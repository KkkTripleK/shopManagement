import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/create.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  public sendMail(createUserDto: CreateUserDto, OTP: string): void {
    this.mailerService
      .sendMail({
        to: createUserDto.email, // list of receivers
        from: 'nguyenkhanhhoapso@gmail.com', // sender address
        subject: 'OPT Code ✔', // Subject line
        text: 'OPT number', // plaintext body
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
