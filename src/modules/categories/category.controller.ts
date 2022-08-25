import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Category')
@Controller()
export class CategoryController {
  constructor() {
    //
  }

  @Get('info')
  async getInfo() {
    //
  }
}
