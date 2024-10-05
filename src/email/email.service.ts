import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService) { 
        const key = process.env.SENDGRID_API_KEY
        sgMail.setApiKey(key)
    }

    async sendEmail(to: string, subject: string, text: string) {
        const { SENDER_EMAIL, SENDER_NICKNAME } = process.env
        const emailTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }
                .container {
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #f9f9f9;
                }
                .header {
                    font-size: 24px;
                    margin-bottom: 20px;
                }
                .content {
                    font-size: 18px;
                    margin-bottom: 20px;
                }
                .footer {
                    font-size: 16px;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    New Info From NewsLetter !!!
                </div>
                <div class="content">
                    <strong>${text}</strong>
                </div>
                <div class="footer">
                    Thank you,<br>
                    Team NewsLetter
                </div>
            </div>
        </body>
        </html>
        `;

        const msg = {
            to,
            from: {
                name: SENDER_NICKNAME,
				email: SENDER_EMAIL
            },
            subject,
            text,
            html: emailTemplate
        }

        try {
            await sgMail.send(msg)
        } catch (err) {
            return {
                message: "Something went wrong",
				error: err.message
            }
        }
    }

}
