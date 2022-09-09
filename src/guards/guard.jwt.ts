import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '../modules/users/user.repo';
import { VerifyToken } from '../utils/util.verifyToken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private verifyToken: VerifyToken, private userRepo: UserRepository) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const payload = await this.verifyToken.verifyJWT(request.rawHeaders[1]);
            const userInfo = await this.userRepo.findAccount({
                username: payload.username,
            });
            if (userInfo === null) {
                throw new HttpException('Token is invalid or expired1!', HttpStatus.BAD_REQUEST);
            }
            request.userInfo = { username: payload.username };
            return true;
        } catch (error) {
            throw new HttpException('Token is invalid or expired2!', HttpStatus.BAD_REQUEST);
        }
    }
}
