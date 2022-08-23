import { Controller, Get, Headers } from '@nestjs/common';
import { VerifyToken } from 'src/utils/util.verifyToken';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private verifyToken: VerifyToken,
  ) {}

  @Get('/info')
  async showInfo(@Headers() header: any): Promise<UserEntity> {
    const payload = await this.verifyToken.verifyJWT(header);
    console.log(payload);
    const username = payload.username;
    return await this.userService.showInfo({ username });
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
