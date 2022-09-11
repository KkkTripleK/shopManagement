import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}
    public sendMail(email: string, subject: string, content: string): void {
        this.mailerService
            .sendMail({
                to: email, // list of receivers
                from: 'nguyenkhanhhoapso@gmail.com', // sender address
                subject: subject, // Subject line
                text: 'No-reply', // plaintext body
                html: content, // HTML body content
            })
            .then(() => {
                console.log(`Send email title: ${subject} successful!`);
            })
            .catch((error) => {
                console.log(error);
                throw new HttpException(
                    {
                        error: 'Send email failed!',
                    },
                    HttpStatus.BAD_REQUEST,
                );
            });
    }
}
