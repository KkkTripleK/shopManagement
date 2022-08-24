import {
  Body,
  Controller,
  Get,
  Headers,
  Patch,
  Post,
  // eslint-disable-next-line prettier/prettier
  UseGuards
} from '@nestjs/common';
import { VerifyToken } from 'src/utils/util.verifyToken';
import { Roles } from '../decorator/decorator.roles';
import { JwtAuthGuard } from '../guards/guard.jwt';
import { RolesGuard } from '../guards/guard.roles';
import { UpdateDTO } from './dto/update.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private verifyToken: VerifyToken,
  ) {}

  @Get('info')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles('admin', 'member')
  async findInfo(@Headers() requestHeader: any): Promise<UserEntity> {
    const payload = await this.verifyToken.verifyJWT(
      requestHeader.authorization,
    );
    return await this.userService.findInfo({ username: payload.username });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async updateInfo(
    @Body() param: UpdateDTO,
    @Headers() requestHeader: any,
  ): Promise<any> {
    const payload = await this.verifyToken.verifyJWT(
      requestHeader.authorization,
    );
    return this.userService.updateInfo({ username: payload.username }, param);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() requestBody: any): Promise<any> {
    return this.userService.forgotPassword({ username: requestBody.username });
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Body() requestBody: any,
    @Headers() requestHeader: any,
  ) {
    const payload = await this.verifyToken.verifyJWT(requestHeader);
    return this.userService.changePassword(requestBody, payload);
  }

  // @Get('/:id')
  // getUserByID(@Param('id', ParseIntPipe) id: number): Promise<User> {
  //   return this.userService.getUserByID(id);
  // }
  //   @Post('')
  // @UserPipes(ValidationPipe)
  //   createUser(@Body() createUserDto: any = CreateUserDto): Promise<User> {
  //     console.log(createUserDto);
  //     return this.userService.createUser(createUserDto);
  //   }
  // @Get('login')
  // getHello(): string {
  //   return 'hello';
  // }
}
