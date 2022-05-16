import { MailTemplate } from './mail.service';

// Mail-Template after registration
export const MAIL_TEMPLATE_REGISTER: MailTemplate = {
  subject: 'Bitte validieren Sie Ihr Konto',
  text: 'Bitte validieren Sie Ihr Konto.\nValidation-Code: <code>',
};

// Mail-Template after registration
export const MAIL_TEMPLATE_CHANGE_PASSWORD: MailTemplate = {
  subject: 'Password wurde geändert',
  text: 'Ihr Passwort wurde geändert',
};

// Mail-Template after registration
export const MAIL_TEMPLATE_CHANGE_EMAIL: MailTemplate = {
  subject: 'Bitte bestätigen Sie die Email Adresse',
  text: 'Bitte bestätigen Sie die Email Adresse mit folgenden Link: <confirmLink>',
};
