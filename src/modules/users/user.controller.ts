import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Req,
  // eslint-disable-next-line prettier/prettier
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HeadersObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { VerifyToken } from 'src/utils/util.verifyToken';
import { AuthService } from '../auths/auth.service';
import { Roles } from '../decorators/decorator.roles';
import { JwtAuthGuard } from '../guards/guard.jwt';
import { JWTandRolesGuard } from '../guards/guard.roles';
import { ChangePasswordDto } from './dto/dto.changePassword';
import { DeleteAccountDto } from './dto/dto.deleteAccount';
import { ForgotPasswordDto } from './dto/dto.forgotPassword';
import { UpdateDto } from './dto/dto.update';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('User')
@Controller('')
export class UserController {
  constructor(
    private userService: UserService,
    private verifyToken: VerifyToken,
    private authService: AuthService,
  ) {}

  @Get('user/info')
  @UseGuards(JWTandRolesGuard)
  @Roles('admin', 'member')
  async findInfo(@Req() req: any): Promise<UserEntity> {
    return this.userService.findAccount(req.userInfo);
  }

  @Patch('user/update')
  @UseGuards(JwtAuthGuard)
  async updateAccount(
    @Body() param: UpdateDto,
    @Headers() requestHeader: HeadersObject,
  ): Promise<any> {
    const payload = await this.verifyToken.verifyJWT(
      requestHeader.authorization,
    );
    return this.userService.updateAccount(
      { username: payload.username },
      param,
    );
  }

  @Post('user/forgot-password')
  async forgotPassword(@Body() requestBody: ForgotPasswordDto): Promise<any> {
    await this.userService.forgotPassword(requestBody.username);
    return 'New password is sent to your email!';
  }

  @Post('user/change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body() requestBody: ChangePasswordDto,
    @Req() req: any,
  ) {
    return this.userService.changePassword(requestBody, req.userInfo);
  }

  @Delete('user')
  @UseGuards(JWTandRolesGuard)
  @Roles('admin', 'member')
  async deleteAccount(
    @Body() requestBody: DeleteAccountDto,
    @Headers() requestHeader: HeadersObject,
  ) {
    const payload = await this.verifyToken.verifyJWT(
      requestHeader.authorization,
    );
    const info = await this.userService.findAccount({
      username: payload.username,
    });
    await this.authService.validateUser(payload.username, requestBody.password);
    await this.userService.deleteAccount({ id: info.id });
    return 'Delete account successful!';
  }

  @Get('/admin/list-account')
  @UseGuards(JWTandRolesGuard)
  @Roles('admin')
  async showList() {
    return this.userService.getListUser();
  }

  @Get('/admin/account/:id')
  @UseGuards(JWTandRolesGuard)
  @Roles('admin')
  async showUserByID(@Param('id') id: string) {
    return await this.userService.findAccount({ id });
  }

  @Delete('/admin/account/:userID')
  @UseGuards(JWTandRolesGuard)
  @Roles('admin')
  async deleteUserByID(@Param('userID') userID: string) {
    await this.userService.deleteAccount({ userID });
    return 'Delete account successful!';
  }
}
