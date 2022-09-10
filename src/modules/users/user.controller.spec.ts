import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { userGender, userRole, userStatus } from '../../commons/common.enum';
import { JWTandRolesGuard } from '../../guards/guard.roles';
import { AuthService } from '../auths/auth.service';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repo';

import { UserService } from './user.service';

describe('User Controller', () => {
    let app: INestApplication;
    let moduleRef: TestingModule;
    let userService: UserService;
    let userRepo: UserRepository;
    let authService: AuthService;
    let server;
    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(JWTandRolesGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        userService = moduleRef.get<UserService>(UserService);
        userRepo = moduleRef.get<UserRepository>(UserRepository);
        authService = moduleRef.get<AuthService>(AuthService);
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        server = app.getHttpServer();
        await app.init();
    });
    const input = new UserEntity();
    input.id = '41a4241e-16aa-413a-9078-481278373050';
    input.fullName = 'HoaNK';
    input.username = 'HoaNK';
    input.password = 'hoaaaaaaa';
    // input.accountStatus = userStatus.ACTIVE || userStatus.REMOVED;
    input.gender = userGender.MALE || userGender.FEMALE;
    input.address = 'Dong Anh';
    input.age = '18';
    input.email = 'nguyenkhanhhoapso@gmail.com';
    input.role = userRole.ADMIN || userRole.MEMBER;

    describe('Get List Account', () => {
        it('Get list Accounts', async () => {
            const response = await request(server).get('/admin/list-account');
            expect(response.status).toBe(200);
        });
    });

    describe('Update account', () => {
        it('Update account successful', async () => {
            jest.spyOn(userService, 'updateAccount').mockResolvedValue(input as UserEntity);
            await request(server)
                .patch('/user/update')
                .send({
                    fullName: 'HoaNK',
                })
                .expect(200);
        });

        it('Update account failed, param is incorrect', async () => {
            jest.spyOn(userService, 'updateAccount').mockRejectedValue(input as UserEntity);
            await request(server)
                .patch('/user/update')
                .send({
                    fullName: 'HoaNK@',
                })
                .expect(400);
        });
    });

    describe('Admin find an account', () => {
        it('Admin find an account successful', async () => {
            jest.spyOn(userService, 'findAccount').mockResolvedValue(input as UserEntity);
            await request(server).get('/admin/account/41a4241e-16aa-413a-9078-481278373050').expect(200);
        });

        it('Admin find an account failed, Can not find your account!', async () => {
            jest.spyOn(userService, 'findAccount').mockRejectedValue(new BadRequestException());
            await request(server).get('/admin/account/41a4241e-16aa-413a-9078-481278373051').expect(400);
        });
    });

    describe('user get account info', () => {
        it('user get account info successful', async () => {
            jest.spyOn(userService, 'findAccount').mockResolvedValue(input as UserEntity);
            await request(server).get('/user/info').expect(200);
        });

        it('user get account info failed, Can not find your account!', async () => {
            jest.spyOn(userService, 'findAccount').mockRejectedValue(new BadRequestException());
            await request(server).get('/user/info').expect(400);
        });
    });

    // describe('Admin find all accounts', () => {
    //     it('Admin find aall accounts successful', async () => {
    //         jest.spyOn(userService, 'getListAccount').mockResolvedValue();
    //         await request(server).get('/admin/account/41a4241e-16aa-413a-9078-481278373050').expect(200);
    //     });

    //     it('Admin find an account failed, Can not find your account!', async () => {
    //         jest.spyOn(userService, 'findAccount').mockRejectedValue(new BadRequestException());
    //         await request(server).get('/admin/account/41a4241e-16aa-413a-9078-481278373051').expect(400);
    //     });
    // });

    describe('Forgot password', () => {
        it('Forgot password successful', async () => {
            jest.spyOn(userService, 'forgotPassword').mockResolvedValue();
            await request(server)
                .post('/user/forgot-password')
                .send({
                    username: 'HoaNK',
                })
                .expect(201);
        });

        it('Forgot password failed', async () => {
            jest.spyOn(userService, 'forgotPassword').mockRejectedValue(new BadRequestException());
            await request(server)
                .post('/user/forgot-password')
                .send({
                    username: 'HoaNK',
                })
                .expect(400);
        });
    });

    describe('Change password', () => {
        it('Change password successful', async () => {
            jest.spyOn(userService, 'changePassword').mockResolvedValue(input as UserEntity);
            await request(server)
                .post('/user/change-password')
                .send({
                    password: 'hoa123',
                    newPassword: '123456',
                })
                .expect(201);
        });

        it('Change password failed', async () => {
            jest.spyOn(userService, 'changePassword').mockRejectedValue(new BadRequestException());
            await request(server)
                .post('/user/change-password')
                .send({
                    username: 'HoaNK',
                    password: 'hoa123',
                })
                .expect(400);
        });
    });

    describe('Delete account', () => {
        it('Delete account successful', async () => {
            jest.spyOn(moduleRef.get<UserRepository>(UserRepository), 'updateAccount').mockResolvedValue(
                input as UserEntity,
            );
            jest.spyOn(moduleRef.get<AuthService>(AuthService), 'validateUser').mockResolvedValue(input as UserEntity);
            jest.spyOn(userService, 'deleteAccount').mockResolvedValue(input as UserEntity);
            await request(server)
                .delete('/user')
                .send({
                    id: '41a4241e-16aa-413a-9078-481278373050',
                    password: 'hoaaaaaaa',
                })
                .expect(200);
        });

        it('Delete account failed', async () => {
            jest.spyOn(moduleRef.get<AuthService>(AuthService), 'validateUser').mockResolvedValue(input as UserEntity);
            jest.spyOn(moduleRef.get<UserRepository>(UserRepository), 'updateAccount').mockResolvedValue(
                input as UserEntity,
            );
            jest.spyOn(userService, 'deleteAccount').mockRejectedValue(new BadRequestException());
            await request(server)
                .delete('/user')
                .send({
                    id: '41a4241e-16aa-413a-9078-481278373050',
                    password: 'hoaaaaaaa',
                })
                .expect(400);
        });

        it('Delete account failed, empty param update', async () => {
            jest.spyOn(moduleRef.get<AuthService>(AuthService), 'validateUser').mockResolvedValue(input as UserEntity);
            jest.spyOn(moduleRef.get<UserRepository>(UserRepository), 'updateAccount').mockRejectedValue(
                new BadRequestException(),
            );
            jest.spyOn(userService, 'deleteAccount').mockRejectedValue(new BadRequestException());
            await request(server)
                .delete('/user')
                .send({
                    id: '41a4241e-16aa-413a-9078-481278373050',
                    password: 'hoaaaaaaa',
                })
                .expect(400);
        });
    });

    describe('Admin delete account', () => {
        it('Admin delete account successful', async () => {
            jest.spyOn(moduleRef.get<UserRepository>(UserRepository), 'findAccount').mockResolvedValue(
                input as UserEntity,
            );
            jest.spyOn(userService, 'deleteAccount').mockResolvedValue(input as UserEntity);
            await request(server).delete('/admin/account/41a4241e-16aa-413a-9078-481278373050').send({}).expect(200);
        });

        it('Admin delete account failed', async () => {
            jest.spyOn(userService, 'deleteAccount').mockRejectedValue(new BadRequestException());
            jest.spyOn(moduleRef.get<UserRepository>(UserRepository), 'findAccount').mockRejectedValue(
                new BadRequestException(),
            );
            await request(server).delete('/admin/account/41a4241e-16aa-413a-9078-481278373050').send({}).expect(400);
        });
    });

    describe('Register', () => {
        it('Register successfull', async () => {
            jest.spyOn(userRepo, 'createUser').mockResolvedValue(null as UserEntity);
            jest.spyOn(authService, 'checkExistUsername').mockResolvedValue(0);
            jest.spyOn(authService, 'checkExistEmail').mockResolvedValue(0);

            // jest.spyOn(authService, 'createUser').mockResolvedValue(input as UserEntity);
            const k = await request(server)
                .post('/register')
                .send({
                    fullName: 'HoaNK',
                    username: 'HoaNK1',
                    password: 'hoaaaaaaa',
                    //accountStatus: userStatus.ACTIVE || userStatus.REMOVED,
                    gender: userGender.MALE || userGender.FEMALE,
                    address: 'Dong Anh',
                    age: '18',
                    email: 'nguyenkhanhhoapso10@gmail.com',
                });
            // .expect(400);
            console.log(k.body);
        });

        it('Register failed, username is exist', async () => {
            jest.spyOn(userRepo, 'createUser').mockRejectedValue(null as UserEntity);
            jest.spyOn(userRepo, 'checkExistUsername').mockRejectedValue(new BadRequestException());
            await request(server)
                .post('/register')
                .send({
                    fullName: 'HoaNK',
                    username: 'HoaNK',
                    password: 'hoaaaaaaa',
                    accountStatus: userStatus.ACTIVE || userStatus.REMOVED,
                    gender: userGender.MALE || userGender.FEMALE,
                    address: 'Dong Anh',
                    age: '18',
                    email: 'nguyenkhanhhoapso21@gmail.com',
                })
                .expect(400);
        });
    });

    describe('Find account', () => {
        it('Find account succesful', async () => {
            jest.spyOn(userRepo, 'findAccount').mockResolvedValue(input as UserEntity);
            const k = await request(server).get('/admin/account/41a4241e-16aa-413a-9078-481278373050').send({});
            // .expect(200);
            console.log(k.body);
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
