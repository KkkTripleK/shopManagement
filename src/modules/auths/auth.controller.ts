import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HeadersObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ValidateAuthGuard } from '../../guards/guard.validate';
import { VerifyToken } from '../../utils/util.verifyToken';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/dto.create';
import { GenerateTokenDto } from './dto/dto.generateToken';
import { LoginDTO } from './dto/dto.login';
import { VerifyDTO } from './dto/dto.verify';

@ApiTags('Auth')
@Controller('')
export class AuthController {
    constructor(private authService: AuthService, private verifyToken: VerifyToken) {}

    @Post('register')
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async userRegister(@Body() requestBody: CreateUserDto): Promise<object> {
        return this.authService.createUser(requestBody);
    }

    @Post('register/verify')
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async userVerify(@Body() requestBody: VerifyDTO): Promise<string> {
        await this.authService.verifyUser(requestBody);
        return 'Verify account successful!';
    }

    @Post('login')
    @UseGuards(ValidateAuthGuard)
    @ApiOkResponse()
    @ApiBadRequestResponse()
    @ApiConsumes('multipart/form-data')
    async userLogin(@Body() requestBody: LoginDTO): Promise<object> {
        console.log(requestBody);
        return this.authService.userLogin(requestBody.username);
    }

    @Post('regenerateToken')
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async regenerateToken(@Body() requestBody: GenerateTokenDto): Promise<object> {
        return this.authService.regenerateToken(requestBody.refreshToken);
    }

    @Get('logout')
    async logout(@Headers() requestHeader: HeadersObject): Promise<any> {
        const payload = await this.verifyToken.verifyJWT(requestHeader.authorization);
        await this.authService.userLogout(payload.username);
        return 'Logout successful!';
    }
}
