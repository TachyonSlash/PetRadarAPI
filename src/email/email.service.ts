import { Injectable } from '@nestjs/common';
import { envs } from '../config/envs';
import { lookup } from 'node:dns';
import * as nodemailer from 'nodemailer';
import { EmailOptions } from 'src/core/models/email-options.model';

@Injectable()
export class EmailService {
    private readonly gmailOAuthEnabled =
        envs.MAILER_SERVICE.toLowerCase() === 'gmail' &&
        Boolean(envs.GOOGLE_CLIENT_ID && envs.GOOGLE_CLIENT_SECRET && envs.GOOGLE_REFRESH_TOKEN);

    private transporter =
        this.gmailOAuthEnabled
            ? nodemailer.createTransport({
                  host: 'smtp.gmail.com',
                  port: 587,
                  secure: false,
                  requireTLS: true,
                  auth: {
                      type: 'OAuth2',
                      user: envs.MAILER_EMAIL,
                      clientId: envs.GOOGLE_CLIENT_ID,
                      clientSecret: envs.GOOGLE_CLIENT_SECRET,
                      refreshToken: envs.GOOGLE_REFRESH_TOKEN,
                  },
                  lookup: (hostname, options, callback) =>
                      lookup(hostname, { ...options, family: 4 }, callback),
                  tls: {
                      servername: 'smtp.gmail.com',
                  },
              } as nodemailer.TransportOptions)
            : nodemailer.createTransport({
                  service: envs.MAILER_SERVICE,
                  auth: {
                      user: envs.MAILER_EMAIL,
                      pass: envs.MAILER_PASSWORD,
                  },
              });

    async sendEmail(options: EmailOptions) : Promise<Boolean>{
        try{
            await this.transporter.sendMail({
                to: options.to,
                subject: options.subject,
                html: options.htmlBody
            });
            return true;
        } catch (error) {
            console.error("Error sending email:", error);
            return false;
        }
    }
}
