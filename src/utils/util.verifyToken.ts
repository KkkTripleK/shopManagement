import { Injectable } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './dto/util.verifyToken.dto';

@Injectable()
export class VerifyToken {
  constructor(private jwtService: JwtService) {}

  async verifyJWT(header: any): Promise<Payload> {
    try {
      const token = header.authorization.split(' ');
      if (token[0] !== 'Bearer' || token[1] === undefined) {
        throw new HttpException(
          {
            error: 'Token is not correct!',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      return this.jwtService.verifyAsync(token[1], {
        secret: process.env.SECRET,
      });
    } catch (error) {
      throw new HttpException(
        {
          error: 'Token is expired!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
