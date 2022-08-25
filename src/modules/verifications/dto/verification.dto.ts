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
  activeCode: string;
}
