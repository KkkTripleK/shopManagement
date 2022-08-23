import { Injectable } from '@nestjs/common/decorators';

@Injectable()
export class RandomOTP {
  randomOTP() {
    return Math.floor(Math.random() * (999999 - 100000) + 100000).toString();
  }
}
