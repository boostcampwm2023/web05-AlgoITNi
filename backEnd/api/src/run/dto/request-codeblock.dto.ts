import { IsString } from 'class-validator';
import { supportLang } from '../../common/type';

export class RequestCodeblockDto {
  @IsString()
  code: string;

  @IsString()
  language: supportLang;
}
