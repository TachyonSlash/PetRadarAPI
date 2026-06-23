import { Injectable } from '@nestjs/common';
import { envs } from '../config/envs';
import * as nodemailer from 'nodemailer';
import { EmailOptions } from 'src/core/models/email-options.model';

@Injectable()
export class EmailService {
    private transporter =
        envs.MAILER_SERVICE.toLowerCase() === 'gmail'
            ? nodemailer.createTransport({
                  host: 'smtp.gmail.com',
                  port: 587,
                  secure: false,
                  requireTLS: true,
                  family: 4,
                  auth: {
                      user: envs.MAILER_EMAIL,
                      pass: envs.MAILER_PASSWORD,
                  },
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
