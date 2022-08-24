import { Injectable } from '@nestjs/common/decorators';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './dto/util.verifyToken.dto';

@Injectable()
export class VerifyToken {
  constructor(private jwtService: JwtService) {}

  async verifyJWT(header: any): Promise<Payload> {
    const token = header.authorization.split(' ');
    return this.jwtService.verifyAsync(token[1], {
      secret: process.env.SECRET,
    });
  }
}
