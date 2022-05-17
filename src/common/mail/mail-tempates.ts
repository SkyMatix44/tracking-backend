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

// Mail-Template reset password
export const MAIL_TEMPLATE_RESET_PASSWORD: MailTemplate = {
  subject: 'Password zurücksetzen',
  text: 'Bitte klicken Sie auf den Link um Ihr Passwort zurückzusetzen: <link>\noder geben Sie folgenden Code in der App ein: <code>',
};
