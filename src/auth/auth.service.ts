import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import * as argon from 'argon2';
import { MAIL_TEMPLATE_REGISTER } from '../common/mail/mail-tempates';
import { MailService } from '../common/mail/mail.service';
import { TokenGeneratorService } from '../common/token-generator/token-generator.service';
import { decodeBase64, encodeBase64 } from '../common/utils';
import { PrismaService } from './../prisma/prisma.service';
import { AuthDto } from './dto';
import { SignInResult } from './dto/sign-in-result.dto';
import { SignUpDto } from './dto/signUp.dto';

@Injectable()
export class AuthService {
  private jwtSecret: string;

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private mailService: MailService,
    private tokenGeneratorService: TokenGeneratorService,
  ) {
    this.jwtSecret = this.config.get('JWT_SECRET');
  }

  /**
   * Sign Up for User
   *
   * @param AuthDto dto
   */
  async signup(dto: SignUpDto): Promise<void> {
    //generate the password
    const hash: string = await argon.hash(dto.password);

    const validationToken: string = this.tokenGeneratorService.generateToken(2, 3);

    let role: Role = Role.USER;
    if (dto.role && dto.role != Role.ADMIN) {
      role = dto.role;
    }

    let userData: Partial<User>;
    if (role == Role.USER) {
      userData = {
        gender: dto.gender,
        address: dto.address,
        birthday: dto.birthday,
        height: dto.height,
        weight: dto.weight,
      };
    } else if (role == Role.SCIENTIST) {
      userData = { universityId: dto.universityId };
    }

    //save the new user in the db
    const user: User = await this.prisma.user.create({
      data: {
        ...userData,
        email: dto.email,
        hash: hash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role,
        validated: false,
        validation_token: validationToken,
      },
    });

    // Send mail with validation token
    const bse64Email = encodeBase64(user.email);
    const bse64Token = encodeBase64(validationToken);
    const confirmLink = `${this.config.get('SYSTEM_URL')}auth/confirm/email/${bse64Email}/${bse64Token}`;
    await this.mailService.sendWithTemplate(user.email, MAIL_TEMPLATE_REGISTER, {
      code: validationToken,
      confirmLink,
    });
  }

  /**
   * Sign In for User
   *
   * @param dto
   * @returns Promise<{access_token : string}>
   */
  async signin(dto: AuthDto): Promise<SignInResult> {
    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // if user does not exist throw exception
    if (!user || !user.validated || user.blocked) {
      throw new ForbiddenException('Credentials incorrect');
    }
    // compare password with hash
    const pwMatches = await argon.verify(user.hash, dto.password);
    // if password incorrect throw exception and send 403 Response
    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }
    // send back the users JWT
    return this.signToken(user);
  }

  /**
   * Confirm email after signup
   */
  async confirm(bse64Email: string, bse64Token: string): Promise<SignInResult> {
    const email: string = decodeBase64(bse64Email);
    const validationToken: string = decodeBase64(bse64Token);
    const user: User = await this.prisma.user.findFirst({
      where: { email, validated: false, blocked: false },
      rejectOnNotFound: true,
    });

    if (user && this.tokenGeneratorService.verfiyToken(user.validation_token, validationToken)) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          validated: true,
          validation_token: null,
        },
      });

      return this.signToken(user);
    }

    throw new UnauthorizedException();
  }

  /**
   * Confirm new email
   * @param newEmail new email address
   * @param newEmailToken Token to validate new email
   */
  async confirmNewEmail(bse64Email: string, bse64Token: string): Promise<SignInResult> {
    if (bse64Email && bse64Token) {
      const newEmail: string = decodeBase64(bse64Email);
      const newEmailToken: string = decodeBase64(bse64Token);
      let user: User = await this.prisma.user.findFirst({ where: { new_email: newEmail }, rejectOnNotFound: true });

      if (user && this.tokenGeneratorService.verfiyToken(user.new_email_token, newEmailToken)) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            email: user.new_email,
            new_email: null,
            new_email_token: null,
          },
        });

        // TODO invalidate jwt tokens of the user

        return this.signToken(user);
      }
    }

    throw new UnauthorizedException();
  }

  /**
   * Verify a jwt token
   */
  verifyToken(token: string) {
    return this.jwt.verify(token, { secret: this.jwtSecret });
  }

  /**
   * Helper Function to create JWT-Token
   */
  private async signToken(user: User): Promise<SignInResult> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    //create the JWT-Token
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '30m',
      secret: this.jwtSecret,
    });

    let userData: Partial<User>;
    if (user.role == Role.USER) {
      userData = {
        gender: user.gender,
        address: user.address,
        birthday: user.birthday,
        height: user.height,
        weight: user.weight,
      };
    } else if (user.role == Role.SCIENTIST) {
      userData = {
        universityId: user.universityId,
      };
    }

    return {
      accessToken: token,
      user: {
        ...userData,
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }
}
