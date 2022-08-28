import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  // eslint-disable-next-line prettier/prettier
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VerifyToken } from 'src/utils/util.verifyToken';
import { AuthService } from '../auths/auth.service';
import { Roles } from '../decorators/decorator.roles';
import { JwtAuthGuard } from '../guards/guard.jwt';
import { RolesGuard } from '../guards/guard.roles';
import { DeleteAccount } from './dto/dto.deleteAccount';
import { UpdateDTO } from './dto/dto.update';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('')
export class UserController {
  constructor(
    private userService: UserService,
    private verifyToken: VerifyToken,
    private authService: AuthService,
  ) {}

  @ApiTags('User')
  @Get('user/info')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Member')
  async findInfo(@Headers() requestHeader: any): Promise<UserEntity> {
    const payload = await this.verifyToken.verifyJWT(
      requestHeader.authorization,
    );
    return await this.userService.findAccount({
      username: payload.username,
    });
  }

  @ApiTags('User')
  @UseGuards(JwtAuthGuard)
  @Patch('user/update')
  async updateAccount(
    @Body() param: UpdateDTO,
    @Headers() requestHeader: any,
  ): Promise<any> {
    const payload = await this.verifyToken.verifyJWT(
      requestHeader.authorization,
    );
    return this.userService.updateAccount(
      { username: payload.username },
      param,
    );
  }

  @ApiTags('User')
  @Post('user/forgot-password')
  async forgotPassword(@Body() requestBody: any): Promise<any> {
    await this.userService.forgotPassword(requestBody.username);
    return 'New password is sent to your email!';
  }

  @ApiTags('User')
  @UseGuards(JwtAuthGuard)
  @Post('user/change-password')
  async changePassword(
    @Body() requestBody: any,
    @Headers() requestHeader: any,
  ) {
    const payload = await this.verifyToken.verifyJWT(
      requestHeader.authorization,
    );
    return this.userService.changePassword(requestBody, payload);
  }

  @ApiTags('User')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Member')
  @Delete('user')
  async deleteAccount(
    @Body() requestBody: DeleteAccount,
    @Headers() requestHeader: any,
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

  @ApiTags('Admin')
  @Get('/admin/list-account')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles('Admin')
  async showList() {
    return this.userService.getListUser();
  }

  @ApiTags('Admin')
  @Get('/admin/account/:userID')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles('Admin')
  async showUserByID(@Param('userID') userID: string) {
    return await this.userService.findAccount({ userID });
  }

  @ApiTags('Admin')
  @Delete('/admin/account/:userID')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles('Admin')
  async deleteUserByID(@Param('userID') userID: string) {
    await this.userService.deleteAccount({ userID });
    return 'Delete account successful!';
  }
}
