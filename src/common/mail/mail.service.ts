import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, SentMessageInfo, Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  // Public App Mail-Address
  private readonly sender = this.config.get('MAIL_SERVER_SENDER');

  /**
   * Mail Server Options
   * @see https://nodemailer.com/about/
   */
  private readonly transporter: Transporter = createTransport({
    host: this.config.get('MAIL_SERVER_HOST'),
    port: this.config.get('MAIL_SERVER_PORT'),
    secure: false,
    tls: {
      ciphers: 'SSLv3',
    },
    // auth: {
    //   user: '',
    //   password: ''
    // }
  });

  constructor(private config: ConfigService) {}

  /**
   * Send a email with an template
   * @param receiver Receiver Mail Address
   * @param mailTemplate mail template
   * @param parmas params to replace in subject, text and html
   */
  async sendWithTemplate(
    receiver: string,
    mailTemplate: MailTemplate,
    parmas?: Record<string, string>,
  ): Promise<SentMessageInfo> {
    return this.send(receiver, mailTemplate.subject, mailTemplate.text, mailTemplate.html, parmas);
  }

  /**
   * Send a email
   * with freesmtpservers
   * @see https://www.wpoven.com/tools/free-smtp-server-for-testing
   *
   * @param receiver Receiver Mail Address
   * @param subject Subject of the mail
   * @param text Text of the mail
   * @param html html bofy of the mail
   * @param parmas params to replace in subject, text and html
   */
  async send(
    receiver: string,
    subject?: string,
    text?: string,
    html?: string,
    parmas?: Record<string, string>,
  ): Promise<SentMessageInfo> {
    try {
      const info = await this.transporter.sendMail({
        from: this.sender,
        to: receiver,
        subject: this.replaceParameter(subject, parmas),
        text: this.replaceParameter(text, parmas),
        html: this.replaceParameter(html, parmas),
      });

      Logger.log(`Message sent to ${receiver}, Message-ID: ${info.messageId}`);

      return info;
    } catch (e) {
      Logger.error('Error while sending mail: ', e.toString());
      throw e;
    }
  }

  /**
   * Replace parameter in a text
   * Structure of Paramer: <name>
   */
  private replaceParameter(text: string, params: Record<string, string>): string {
    if (text != null && text != '') {
      for (let key in params) {
        const param = params[key];
        text = text.replace(`<${key}>`, param);
      }
    }

    return text;
  }
}

/**
 * Template for mails
 */
export interface MailTemplate {
  subject?: string;
  text?: string;
  html?: string;
}
