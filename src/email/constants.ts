export const SMTP_CONSTANTS = {
  HOST: process.env.SMTP_MAIL_HOST,
  PORT: process.env.SMTP_MAIL_PORT || '587',
  USER: process.env.SMTP_MAIL_USER,
  PASS: process.env.SMTP_MAIL_PASS,
  FROM: process.env.SMTP_MAIL_FROM,
} as const;
