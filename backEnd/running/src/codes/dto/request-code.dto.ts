import { IsString } from 'class-validator';
import { supportLang } from '../../common/supportLang';

export class RequestCodeDto {
  @IsString()
  code: string;

  @IsString()
  language: supportLang;
}
