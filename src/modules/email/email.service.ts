import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}
    public sendMail(email: string, OTP: string): void {
        this.mailerService
            .sendMail({
                to: email, // list of receivers
                from: 'nguyenkhanhhoapso@gmail.com', // sender address
                subject: 'OTP Code ✔', // Subject line
                text: 'OTP number', // plaintext body
                html: OTP, // HTML body content
            })
            .then(() => {
                console.log('Send email successful!');
            })
            .catch(() => {
                throw new HttpException(
                    {
                        error: 'Send email failed!',
                    },
                    HttpStatus.BAD_REQUEST,
                );
            });
    }
}
