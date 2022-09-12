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
import { ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
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

    @Get('user')
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

    @Get('admin/account')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    @ApiForbiddenResponse()
    async showList(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit = 3,
    ): Promise<Pagination<UserEntity>> {
        return this.userService.getListAccount({
            page,
            limit,
            route: `localhost:${process.env.PORT}/api/v1/admin/list-account`,
        });
    }

    @Get('admin/account/:id')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    @ApiForbiddenResponse()
    async showUserByID(@Param('id', new ParseUUIDPipe()) id: string) {
        return await this.userService.findAccount({ id: id });
    }

    @Delete('admin/account/:id')
    @UseGuards(JWTandRolesGuard)
    @Roles(userRole.ADMIN)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    @ApiForbiddenResponse()
    async deleteUserByID(@Param('id', new ParseUUIDPipe()) id: string) {
        await this.userService.deleteAccount({ id: id });
        return 'The account have been change to Inactive status!';
    }
}
