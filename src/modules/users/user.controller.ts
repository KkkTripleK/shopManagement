import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { userRole } from '../../commons/common.enum';
import { Roles } from '../../decorators/decorator.roles';
import { JWTandRolesGuard } from '../../guards/guard.roles';
import { AuthService } from '../auths/auth.service';
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
    constructor(private userService: UserService, private authService: AuthService) {}

    @Get('user/info')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN, userRole.MEMBER)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async findInfo(@Req() req: any): Promise<UserEntity> {
        return this.userService.findAccount(req.userInfo);
    }

    @Patch('user/update')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN, userRole.MEMBER)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async updateAccount(@Body() param: UpdateDto, @Req() req: any): Promise<any> {
        return this.userService.updateAccount(req.userInfo, param);
    }

    @Post('user/forgot-password')
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async forgotPassword(@Body() requestBody: ForgotPasswordDto): Promise<any> {
        await this.userService.forgotPassword(requestBody.username);
        return 'New password is sent to your email!';
    }

    @Post('user/change-password')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN, userRole.MEMBER)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async changePassword(@Body() requestBody: ChangePasswordDto, @Req() req: any) {
        return this.userService.changePassword(requestBody, req.userInfo);
    }

    @Delete('user')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN, userRole.MEMBER)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async deleteAccount(@Body() requestBody: DeleteAccountDto, @Req() req: any) {
        await this.authService.validateUser(req.userInfo, requestBody.password);
        await this.userService.deleteAccount(req.userInfo);
        return 'The account have been change to Inactive status!';
    }

    @Get('admin/list-account')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async showList(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit = 3,
    ): Promise<Pagination<UserEntity>> {
        return this.userService.getListAccount({
            page,
            limit,
            route: `localhost:${process.env.PORT}/admin/list-account`,
        });
    }

    @Get('admin/account/:userId')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async showUserByID(@Param('userId', new ParseUUIDPipe()) userId: string) {
        return await this.userService.findAccount({ id: userId });
    }

    @Delete('admin/account/:userId')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async deleteUserByID(@Param('userId', new ParseUUIDPipe()) userId: string) {
        await this.userService.deleteAccount({ id: userId });
        return 'The account have been change to Inactive status!';
    }
}
