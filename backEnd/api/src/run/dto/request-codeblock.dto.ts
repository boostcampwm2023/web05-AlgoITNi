import { IsString } from 'class-validator';
import { supportLang } from '../../common/supportLang';

export class RequestCodeBlockDto {
  @IsString()
  code: string;

  @IsString()
  language: supportLang;
}
