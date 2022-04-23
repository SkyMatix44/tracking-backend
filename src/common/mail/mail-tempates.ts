import { MailTemplate } from './mail.service';

// Mail-Template after registration
export const MAIL_TEMPLATE_REGISTER: MailTemplate = {
  subject: 'Bitte validieren Sie Ihr Konto',
  text: 'Bitte validieren Sie Ihr Konto.\nValidation-Code: <code>',
};
