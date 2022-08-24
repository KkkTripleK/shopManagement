import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auths/auth.module';
import { UserModule } from './modules/users/user.module';

@Module({
  imports: [
    AuthModule,
    MailerModule,
    UserModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        ignoreTLS: true,
        secure: true,
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
  providers: [],
})
export class AppModule {}
