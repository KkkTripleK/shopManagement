import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Product')
@Controller()
export class ProductController {
  constructor() {
    //
  }

  @Get('info')
  async getInfo() {
    //
  }
}
