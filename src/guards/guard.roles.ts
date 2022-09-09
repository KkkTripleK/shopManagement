import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRepository } from '../modules/users/user.repo';
import { VerifyToken } from '../utils/util.verifyToken';

@Injectable()
export class JWTandRolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private verifyToken: VerifyToken, private userRepo: UserRepository) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
            const request = context.switchToHttp().getRequest();
            const payload = await this.verifyToken.verifyJWT(request.get('Authorization'));
            const userInfo = await this.userRepo.findAccount({
                username: payload.username,
            });
            if (userInfo === null) {
                throw new HttpException('Token is invalid!', HttpStatus.BAD_REQUEST);
            }
            request.userInfo = { username: payload.username };
            return requiredRoles.includes(userInfo.role);
        } catch (error) {
            throw new HttpException('Token is invalid or expired!', HttpStatus.BAD_REQUEST);
        }
    }
}
