import {
  Body,
  Controller,
  Post,
  // eslint-disable-next-line prettier/prettier
  UseGuards
} from '@nestjs/common';
import { MailService } from '../email/email.service';
import { ValidateAuthGuard } from '../guards/guard.validate';
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

  @Post('register')
  async userRegister(@Body() createUserDto: CreateUserDto): Promise<object> {
    await this.authService.checkExistUsername(createUserDto);
    return this.authService.createUser(createUserDto);
  }

  @Post('register/verify')
  async userVerify(@Body() verifyDTO: VerifyDTO): Promise<string> {
    await this.authService.verifyUser(verifyDTO);
    return 'Verify account successful!';
  }

  @UseGuards(ValidateAuthGuard)
  @Post('login')
  async userLogin(@Body() loginDTO: LoginDTO): Promise<object> {
    return this.authService.userLogin(loginDTO.username);
  }

  @Post('regenerateToken')
  async regenerateToken(@Body() requestBody: any): Promise<any> {
    return this.authService.regenerateToken(requestBody.refreshToken);
  }
}
