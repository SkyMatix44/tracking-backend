import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import * as argon from 'argon2';
import { TrackingRequest } from '../auth/middleware/auth.middleware';
import { MAIL_TEMPLATE_CHANGE_EMAIL, MAIL_TEMPLATE_CHANGE_PASSWORD } from '../common/mail/mail-tempates';
import { MailService } from '../common/mail/mail.service';
import { TokenGeneratorService } from '../common/token-generator/token-generator.service';
import { encodeBase64 } from '../common/utils';
import { PrismaService } from '../prisma/prisma.service';
import { ChangeEmailDto } from './dto/change-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private tokenGeneratorService: TokenGeneratorService,
    private mailService: MailService,
    private config: ConfigService,
  ) {}

  /**
   * Change the password of a user
   * @param req Tracking-Request
   * @param data change pw data
   *
   * TODO maybe invalid all other jwt tokens of the user
   */
  async changePassword(req: TrackingRequest, data: ChangePasswordDto): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: req.userId,
      },
    });

    if (user) {
      const pwMatches = await argon.verify(user.hash, data.password);

      if (pwMatches) {
        //generate the password
        const newPwHash = await argon.hash(data.newPassword);

        await this.prisma.user.update({
          data: {
            hash: newPwHash,
          },
          where: {
            id: req.userId,
          },
        });

        // Send Info-Email
        try {
          await this.mailService.sendWithTemplate(user.email, MAIL_TEMPLATE_CHANGE_PASSWORD);
        } catch (e) {
          console.warn('Mail `MAIL_TEMPLATE_CHANGE_PASSWORD` could not be sent');
        }

        return;
      }
    }

    throw new UnauthorizedException();
  }

  /**
   * Change Email
   * @param req Tracking-Request
   * @param data new email data
   */
  async changeEmail(req: TrackingRequest, data: ChangeEmailDto): Promise<void> {
    const token = this.tokenGeneratorService.generateToken(2, 3);
    const newEmail = data.newEmail.toLowerCase().trim();

    // check already exist a user with this email
    const existUserWithNewEmail: User = await this.prisma.user.findFirst({
      where: { OR: [{ email: newEmail }, { new_email: newEmail }] },
      rejectOnNotFound: false,
    });
    if (existUserWithNewEmail) {
      throw new ForbiddenException();
    }

    const user = await this.prisma.user.update({
      where: {
        id: req.userId,
      },
      data: {
        new_email: newEmail,
        new_email_token: token,
      },
    });

    const bse64Email = encodeBase64(newEmail);
    const bse64Token = encodeBase64(token);
    const confirmLink = `${this.config.get('SYSTEM_URL')}auth/confirm/new-email/${bse64Email}/${bse64Token}`;
    console.log(confirmLink);

    await this.mailService.sendWithTemplate(newEmail, MAIL_TEMPLATE_CHANGE_EMAIL, { confirmLink });
  }

  /**
   * (Un)block a user
   *
   * @param req Tracking-Request
   * @param userId user id to block
   * @param block block status
   */
  async blockUser(req: TrackingRequest, userId: number, blocked: boolean): Promise<void> {
    const user: User = await this.prisma.user.update({
      data: {
        blocked: blocked,
      },
      where: {
        id: userId,
      },
    });
  }

  /**
   * Returns all users
   *
   * TODO User aufbereiten
   */
  async getAllUser(req: TrackingRequest): Promise<User[]> {
    return this.prisma.user.findMany({ orderBy: [{ lastName: 'desc' }, { firstName: 'desc' }] });
  }

  /**
   * Update a user
   *
   * @param req Tracking-Request
   * @param data update data
   */
  async update(req: TrackingRequest, userId: number, data: UpdateUserDto | UpdateUserAdminDto): Promise<User> {
    return this.prisma.user.update({ where: { id: userId }, data: { ...data } });
  }

  /**
   * Create a user
   *
   * @param req Tracking-Request
   * @param data user data
   */
  async createUser(req: TrackingRequest, data: CreateUserDto): Promise<User> {
    const hash: string = await argon.hash(data.password);

    const userData = {
      validated: true,
      hash,
      gender: data.gender,
      address: data.address,
      birthday: data.birthday,
      height: data.height,
      weight: data.weight,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      email: data.email,
      universityId: data.universityId,
    };

    return this.prisma.user.create({
      data: { ...userData },
    });
  }
}
