import { IsString } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class ChangePasswordDTO {
  @IsString()
  password: string;

  @IsString()
  newPassword: string;
}
