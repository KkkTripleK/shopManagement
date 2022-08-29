import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  // eslint-disable-next-line prettier/prettier
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HeadersObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { VerifyToken } from 'src/utils/util.verifyToken';
import { MailService } from '../email/email.service';
import { ValidateAuthGuard } from '../guards/guard.validate';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/dto.create';
import { GenerateTokenDto } from './dto/dto.generateToken';
import { LoginDTO } from './dto/dto.login';
import { VerifyDTO } from './dto/dto.verify';

@ApiTags('Auth')
@Controller('')
export class AuthController {
  constructor(
    private authService: AuthService,
    private mailService: MailService,
    private verifyToken: VerifyToken,
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

  @Post('login')
  @UseGuards(ValidateAuthGuard)
  async userLogin(@Body() loginDTO: LoginDTO): Promise<object> {
    return this.authService.userLogin(loginDTO.username);
  }

  @Post('regenerateToken')
  async regenerateToken(
    @Body() requestBody: GenerateTokenDto,
  ): Promise<object> {
    return this.authService.regenerateToken(requestBody.refreshToken);
  }

  @Get('logout')
  async logout(@Headers() requestHeader: HeadersObject): Promise<any> {
    const payload = await this.verifyToken.verifyJWT(
      requestHeader.authorization,
    );
    await this.authService.userLogout(payload.username);
    return 'Logout successful!';
  }
}
