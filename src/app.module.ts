import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auths/auth.module';
import { CategoryModule } from './modules/categories/category.module';
import { CouponModule } from './modules/coupons/coupon.module';
import { OrderProductModule } from './modules/orderProducts/orderProduct.module';
import { OrderModule } from './modules/orders/order.module';
import { PictureModule } from './modules/picture/picture.module';
import { ProductModule } from './modules/products/product.module';
import { UserModule } from './modules/users/user.module';

@Module({
    imports: [
        AuthModule,
        UserModule,
        CategoryModule,
        ProductModule,
        PictureModule,
        OrderModule,
        OrderProductModule,
        CouponModule,
        MailerModule,
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
