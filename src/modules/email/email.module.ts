import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        ignoreTLS: true,
        secure: false,
        auth: {
          user: process.env.emailID,
          pass: process.env.emailPassword,
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@localhost>',
      },
    }),
  ],
  controllers: [],
  providers: [MailService],
})
export class MailModule {}
