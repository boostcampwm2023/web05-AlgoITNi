import { IsString } from 'class-validator';
import { supportLang } from '../../common/type';

export class RequestCodeBlockDto {
  @IsString()
  code: string;

  @IsString()
  language: supportLang;
}
