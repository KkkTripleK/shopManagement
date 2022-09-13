import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CacheService } from '../modules/cache/cache.service';
import { UserRepository } from '../modules/users/user.repo';
import { VerifyToken } from '../utils/util.verifyToken';

@Injectable()
export class JWTandRolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private verifyToken: VerifyToken,
        private userRepo: UserRepository,
        private cacheService: CacheService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
            const request = context.switchToHttp().getRequest();
            const payload = await this.verifyToken.verifyJWT(request.get('Authorization'));
            const userRole = await this.cacheService.get(`users:${payload.username}:role`);
            request.userInfo = { username: payload.username };
            return requiredRoles.includes(userRole);
        } catch (error) {
            throw new HttpException('Token is invalid or expired!', HttpStatus.BAD_REQUEST);
        }
    }
}

// const userInfo = await this.userRepo.findAccount({
//     username: payload.username,
// });
// if (userInfo === null) {
//     throw new HttpException('Token is invalid!', HttpStatus.BAD_REQUEST);
// }
