import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TrackingRequest } from '../auth/middleware/auth.middleware';
import { TokenGeneratorService } from '../common/token-generator/token-generator.service';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { MailService } from '../common/mail/mail.service';
import { MAIL_TEMPLATE_CHANGE_PASSWORD } from '../common/mail/mail-tempates';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private tokenGeneratorService: TokenGeneratorService,
    private mailService: MailService,
  ) {}

  /**
   * Change the password of a user
   * @param req
   * @param data
   */
  async changePassword(req: TrackingRequest, data: any): Promise<void> {
    // TODO dto anlegen
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
        await this.mailService.sendWithTemplate(user.email, MAIL_TEMPLATE_CHANGE_PASSWORD);

        return;
      }
    }

    throw new UnauthorizedException();
  }
}
