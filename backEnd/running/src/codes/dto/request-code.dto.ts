import { IsString } from 'class-validator';
import { supportLang } from '../../common/type';

export class RequestCodeDto {
  @IsString()
  code: string;

  @IsString()
  language: supportLang;
}
