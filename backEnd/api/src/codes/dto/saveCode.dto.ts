import { IsString } from 'class-validator';
import { supportLang } from '../../common/supportLang';

export class SaveCodeDto {
  userID?: number;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  language: supportLang;
}
