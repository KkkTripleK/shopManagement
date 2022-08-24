import { Body, Controller, Get, Headers, Patch, Post } from '@nestjs/common';
import { VerifyToken } from 'src/utils/util.verifyToken';
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
  async showInfo(@Headers() requestHeader: any): Promise<UserEntity> {
    const payload = await this.verifyToken.verifyJWT(requestHeader);
    console.log(payload);
    const username = payload.username;
    return await this.userService.showInfo({ username });
  }

  @Patch('update')
  async updateInfo(
    @Body() param: UpdateDTO,
    @Headers() requestHeader: any,
  ): Promise<any> {
    const payload = await this.verifyToken.verifyJWT(requestHeader);
    return this.userService.updateInfo({ username: payload.username }, param);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() requestBody: any): Promise<any> {
    return this.userService.forgotPassword({ username: requestBody.username });
  }

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
