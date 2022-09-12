import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HeadersObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
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
    @ApiCreatedResponse()
    @ApiBadRequestResponse()
    @ApiConsumes('application/x-www-form-urlencoded')
    async userRegister(@Body() requestBody: CreateUserDto): Promise<object> {
        return this.authService.createUser(requestBody);
    }

    @Post('register/verify')
    @ApiOkResponse()
    @ApiBadRequestResponse()
    @ApiConsumes('application/x-www-form-urlencoded')
    async userVerify(@Body() requestBody: VerifyDTO): Promise<string> {
        await this.authService.verifyUser(requestBody);
        return 'Verify account successful!';
    }

    @Post('login')
    @ApiOkResponse()
    @ApiBadRequestResponse()
    @ApiConsumes('application/x-www-form-urlencoded')
    async userLogin(@Body() requestBody: LoginDTO): Promise<object> {
        return this.authService.userLogin(requestBody);
    }

    @Post('access-token')
    @ApiOkResponse()
    @ApiBadRequestResponse()
    @ApiConsumes('application/x-www-form-urlencoded')
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
