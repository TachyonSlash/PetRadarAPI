import { Injectable } from '@nestjs/common';
import { envs } from '../config/envs';
import * as nodemailer from 'nodemailer';
import { EmailOptions } from 'src/core/models/email-options.model';

@Injectable()
export class EmailService {
    private readonly gmailApiEnabled =
        envs.MAILER_SERVICE.toLowerCase() === 'gmail' &&
        Boolean(envs.GOOGLE_CLIENT_ID && envs.GOOGLE_CLIENT_SECRET && envs.GOOGLE_REFRESH_TOKEN);

    private transporter =
        this.gmailApiEnabled
            ? null
            : nodemailer.createTransport({
                  service: envs.MAILER_SERVICE,
                  auth: {
                      user: envs.MAILER_EMAIL,
                      pass: envs.MAILER_PASSWORD,
                  },
              });

    private async getGmailAccessToken(): Promise<string> {
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: envs.GOOGLE_CLIENT_ID,
                client_secret: envs.GOOGLE_CLIENT_SECRET,
                refresh_token: envs.GOOGLE_REFRESH_TOKEN,
                grant_type: 'refresh_token',
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Gmail token refresh failed: ${response.status} ${errorBody}`);
        }

        const data = (await response.json()) as { access_token?: string };

        if (!data.access_token) {
            throw new Error('Gmail token refresh failed: access_token not returned');
        }

        return data.access_token;
    }

    private buildGmailRawMessage(options: EmailOptions): string {
        const headers = [
            `From: ${envs.MAILER_EMAIL}`,
            `To: ${options.to}`,
            `Subject: ${options.subject}`,
            'Content-Type: text/html; charset="UTF-8"',
            'MIME-Version: 1.0',
            '',
            options.htmlBody,
        ].join('\r\n');

        return Buffer.from(headers)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/g, '');
    }

    private async sendViaGmailApi(options: EmailOptions): Promise<boolean> {
        const accessToken = await this.getGmailAccessToken();
        const raw = this.buildGmailRawMessage(options);

        const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ raw }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Gmail API send failed: ${response.status} ${errorBody}`);
        }

        return true;
    }

    async sendEmail(options: EmailOptions) : Promise<Boolean>{
        try{
            if (this.gmailApiEnabled) {
                await this.sendViaGmailApi(options);
                return true;
            }

            await this.transporter!.sendMail({
                to: options.to,
                subject: options.subject,
                html: options.htmlBody,
            });
            return true;
        } catch (error) {
            console.error("Error sending email:", error);
            return false;
        }
    }
}
