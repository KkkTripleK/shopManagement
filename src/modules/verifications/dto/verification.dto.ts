import { IsAlphanumeric, IsOptional, IsString, Length } from 'class-validator';

export class VerificationDTO {
  @IsAlphanumeric()
  @IsString()
  @Length(6, 12)
  username: string;

  @IsString()
  @IsOptional()
  activeCode: string;
}
