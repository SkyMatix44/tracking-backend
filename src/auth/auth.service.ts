import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import * as argon from 'argon2';
import {
  MAIL_TEMPLATE_CHANGE_PASSWORD,
  MAIL_TEMPLATE_REGISTER,
  MAIL_TEMPLATE_RESET_PASSWORD,
} from '../common/mail/mail-tempates';
import { MailService } from '../common/mail/mail.service';
import { TokenGeneratorService } from '../common/token-generator/token-generator.service';
import { decodeBase64, encodeBase64 } from '../common/utils';
import { PrismaService } from './../prisma/prisma.service';
import { AuthDto } from './dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SignUpDto } from './dto/signUp.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private mailService: MailService,
    private tokenGeneratorService: TokenGeneratorService,
  ) {}

  /**
   * Sign Up for User
   *
   * @param AuthDto dto
   * @returns Promise<{access_token : string}>
   */
  async signup(dto: SignUpDto): Promise<{ access_token: string }> {
    //generate the password
    const hash: string = await argon.hash(dto.password);

    const validationToken: string = this.tokenGeneratorService.generateToken();

    //save the new user in the db
    const user: User = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash: hash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        gender: dto.gender,
        address: dto.address,
        birthday: dto.birthday,
        height: dto.height,
        weight: dto.weight,
        role: Role.USER,
        universityId: null,
        validated: false,
        validation_token: validationToken,
      },
    });

    // Send mail with validation token
    await this.mailService.sendWithTemplate(user.email, MAIL_TEMPLATE_REGISTER, {
      code: validationToken,
    });

    //return saved users JWT
    return this.signToken(user.id, user.email, user.role);
  }

  /**
   * Sign In for User
   *
   * @param dto
   * @returns Promise<{access_token : string}>
   */
  async signin(dto: AuthDto): Promise<{ access_token: string }> {
    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // if user does not exist throw exception
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }
    // compare password with hash
    const pwMatches = await argon.verify(user.hash, dto.password);
    // if password incorrect throw exception and send 403 Response
    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }
    // send back the users JWT
    return this.signToken(user.id, user.email, user.role);
  }

  /**
   * Send an email to reset the password
   * @param email Email of the user
   */
  async resetPassword(email: string): Promise<void> {
    let user: User = await this.prisma.user.findUnique({
      where: { email },
      rejectOnNotFound: true,
    });

    if (user) {
      let token: string;
      if (user.new_password_token) {
        token = user.new_password_token;
      } else {
        token = this.tokenGeneratorService.generateToken();

        user = await this.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            new_password_token: token,
          },
        });
      }

      const bse64Token = encodeBase64(token);
      const bse64Email = encodeBase64(user.email);
      // Link to Client Password Reset Page
      const link = `${this.config.get('CLIENT_URL')}/password/reset/${bse64Email}/${bse64Token}`;

      await this.mailService.sendWithTemplate(user.email, MAIL_TEMPLATE_RESET_PASSWORD, { link, code: token });
      return;
    }

    throw new BadRequestException();
  }

  /**
   * Change the password
   * @param data data
   */
  async changePassword(data: ChangePasswordDto): Promise<void> {
    let user = await this.prisma.user.findUnique({ where: { email: data.email }, rejectOnNotFound: true });

    if (
      user &&
      user.new_password_token &&
      this.tokenGeneratorService.verfiyToken(user.new_password_token, data.token)
    ) {
      const newPwHash = await argon.hash(data.newPassword);

      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          new_password_token: null,
          hash: newPwHash,
        },
      });

      // Send Info-Email
      try {
        await this.mailService.sendWithTemplate(user.email, MAIL_TEMPLATE_CHANGE_PASSWORD);
      } catch (e) {
        console.warn('Mail `MAIL_TEMPLATE_CHANGE_PASSWORD` could not be sent');
      }

      // TODO invalidate jwt tokens of the user

      return;
    }

    throw new BadRequestException();
  }

  /**
   * Confirm new email
   * @param newEmail new email address
   * @param newEmailToken Token to validate new email
   */
  async confirmNewEmail(bse64Email: string, bse64Token: string): Promise<void> {
    if (bse64Email && bse64Token) {
      const newEmail: string = decodeBase64(bse64Email);
      const newEmailToken: string = decodeBase64(bse64Token);
      const user: User = await this.prisma.user.findFirst({ where: { new_email: newEmail }, rejectOnNotFound: true });

      if (user && this.tokenGeneratorService.verfiyToken(user.new_email_token, newEmailToken)) {
        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            email: user.new_email,
            new_email: null,
            new_email_token: null,
          },
        });

        // TODO invalidate jwt tokens of the user

        return;
      }
    }

    throw new UnauthorizedException();
  }

  /**
   * Helper Function to create JWT-Token with 'JWT_SECRET' from .env
   *
   * @param userId
   * @param email
   * @param role
   * @returns Promise<{access_token : string}>
   */
  private async signToken(userId: number, email: string, role: Role): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email: email,
      role: role,
    };
    // Get secret from config of .env file (not published on GitHub)
    const secret = this.config.get('JWT_SECRET');
    //create the JWT-Token
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '30m',
      secret: this.config.get('JWT_SECRET'),
    });
    //return access_token as an Object
    return {
      access_token: token,
    };
  }
}
