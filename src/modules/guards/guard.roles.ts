import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { VerifyToken } from 'src/utils/util.verifyToken';
import { UserRepository } from '../users/user.repo';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private verifyToken: VerifyToken,
    private userRepo: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    const payload = await this.verifyToken.verifyJWT(request.rawHeaders[1]);
    const userInfo = await this.userRepo.findInfo({
      username: payload.username,
    });
    return requiredRoles.includes(userInfo.role);
  }
}
