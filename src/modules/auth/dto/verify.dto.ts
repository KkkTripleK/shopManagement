import { IsAlphanumeric, IsString, Length } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class VerifyDTO {
  @IsAlphanumeric()
  @IsString()
  @Length(6, 15)
  username: string;

  @IsString()
  activeCode: string;
}
