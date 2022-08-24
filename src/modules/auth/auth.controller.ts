import {
  Body,
  Controller,
  // eslint-disable-next-line prettier/prettier
  Post
} from '@nestjs/common';
import { MailService } from '../sendEmail/email.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create.dto';
import { LoginDTO } from './dto/login.dto';
import { VerifyDTO } from './dto/verify.dto';

@Controller('')
export class AuthController {
  constructor(
    private authService: AuthService,
    private mailService: MailService,
  ) {}

  @Post('/register')
  async userRegister(@Body() createUserDto: CreateUserDto): Promise<object> {
    await this.authService.checkExistUser(createUserDto);
    return this.authService.createUser(createUserDto);
  }

  @Post('/register/verify')
  async userVerify(@Body() verifyDTO: VerifyDTO): Promise<string> {
    await this.authService.verifyUser(verifyDTO);
    return 'Verify account successful!';
  }

  @Post('/login')
  async userLogin(@Body() loginDTO: LoginDTO): Promise<object> {
    return this.authService.userLogin(loginDTO);
  }

  // @Patch('/info')
  // async updateInfo(@Body() param: UpdateDTO): Promise<UserEntity> {
  //   const username = 'hoaNK97122';
  //   console.log(param);
  //   return await this.authService.updateInfo({ username }, param);
  // }

  // @Delete('remove')
  // userDelete(@Body() removeID: DeleteUser): Promise<object> {
  //   return this.authService.deleteItem(removeID);
  // }

  // @Patch('update')
  // update(@Body() param: UpdateDTO): Promise<UpdateDTO> {
  //   console.log(param);
  //   return this.authService.updateInfo({ id: '10' }, param);
  // }

  // @Get('sendMail')
  // sendMail(): void {
  //   return this.mailService.example();
  // }

  // @Get(':id')
  // getUserByID(@Param('id') id: string): Promise<object> {
  //   return this.authService.getUserByID(id);
  // }
}

// @Get('/:id')
// getUserByID(@Param('id', ParseIntPipe) id: number): Promise<User> {
//   return this.authService.getUserByID(id);
// }
// @Get('login')
// getHello(): string {
//   return 'hello';
// }
