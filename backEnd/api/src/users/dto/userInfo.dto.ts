import { IsNumber, IsString } from 'class-validator';

export class UserInfoDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}
