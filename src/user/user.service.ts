import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon from 'argon2';
import { TrackingRequest } from '../auth/middleware/auth.middleware';
import { MAIL_TEMPLATE_CHANGE_PASSWORD } from '../common/mail/mail-tempates';
import { MailService } from '../common/mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    // private tokenGeneratorService: TokenGeneratorService,
    private mailService: MailService,
  ) {}

  /**
   * Change the password of a user
   * @param req Tracking-Request
   * @param data chnage pw data
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
}
