import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { userGender, userRole, userStatus } from 'src/commons/common.enum';

export class CreateUserDto {
    @ApiProperty()
    @IsAlphanumeric()
    @IsString()
    @Length(4, 12)
    username: string;

    @ApiProperty()
    @IsAlphanumeric()
    @IsString()
    @Length(4, 12)
    password: string;

    @ApiProperty()
    @IsEmail()
    @Length(5, 50)
    email: string;

    @ApiProperty()
    @IsString()
    @Length(3, 20)
    fullName: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEnum(userGender)
    gender: userGender;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    age: string;

    @IsString()
    @IsEnum(userStatus)
    @IsOptional()
    accountStatus?: userStatus;

    @IsString()
    @IsEnum(userRole)
    @IsOptional()
    role?: userRole;

    @ApiProperty()
    @IsString()
    @IsOptional()
    address: string;

    // @ApiQuery({ name: 'role', enum: userRole })
    // async filterByRole(@Query('role') role = userRole.MEMBER) {}
}
