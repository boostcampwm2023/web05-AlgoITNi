import { IsString } from 'class-validator';

export class SaveCodeDto {
  userID?: number;

  @IsString()
  title: string;

  @IsString()
  content: string;
}
