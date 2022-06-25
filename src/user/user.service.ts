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
    // const bse64 = encodeBase64(newEmail) + '#' + encodeBase64(token);
    const bse64Email = encodeBase64(newEmail);
    const bse64Token = encodeBase64(token);
    const confirmLink = `${this.config.get('SYSTEM_URL')}auth/confirm/new-email/${bse64Email}/${bse64Token}`;
    console.log(confirmLink);

    await this.mailService.sendWithTemplate(newEmail, MAIL_TEMPLATE_CHANGE_EMAIL, { confirmLink });
  }
}
