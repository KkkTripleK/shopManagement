import { IsAlphanumeric, IsString, Length } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class LoginDTO {
  @IsAlphanumeric()
  @IsString()
  @Length(6, 12)
  username: string;

  @IsAlphanumeric()
  @IsString()
  @Length(6, 12)
  password: string;
}
