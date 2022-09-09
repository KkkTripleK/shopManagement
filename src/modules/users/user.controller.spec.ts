import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { UserRepository } from './user.repo';
import { UserService } from './user.service';

describe('User', () => {
    let app: INestApplication;
    let moduleRef: TestingModule;
    let userRepo: UserRepository;
    const userService = {
        getListAccount: () => [
            {
                id: 1,
                username: 'admin',
                password: '$2b$12$4.RDHHo7uns2Y23QiNDutOoXvVhJJsl2TnU4gLUxisQRkPPguq6V.',
                email: 'nguyenkhanhhoapso@gmail.com',
                fullName: 'HoaK',
                gender: 'female',
                age: '18',
                role: 'admin',
                address: 'Dong Anh - Ha Noi',
                accountStatus: 'Active',
                createAt: '2022-09-01T09:41:01.455Z',
                updateAt: '2022-09-01T09:41:01.455Z',
            },
        ],
    };
    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(UserService)
            .useValue(userService)
            .compile();

        userRepo = moduleRef.get<UserRepository>(UserRepository);
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    it('Get list Accounts', () => {
        return request(app.getHttpServer()).get('/admin/list-account').expect(200);
    });
    afterAll(async () => {
        await app.close();
    });
});
