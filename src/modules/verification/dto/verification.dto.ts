import { IsAlphanumeric, IsOptional, IsString, Length } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class VerificationDTO {
  @IsAlphanumeric()
  @IsString()
  @Length(6, 12)
  username: string;

  @IsString()
  @IsOptional()
  signature: string;

  @IsString()
  @IsOptional()
  refreshToken: string;

  @IsString()
  @IsOptional()
  accessToken: string;

  @IsString()
  @IsOptional()
  activeCode: string;
}
