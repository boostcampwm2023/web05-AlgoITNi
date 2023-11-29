import { Expose } from 'class-transformer';
import { supportLang } from '../../common/type';

export class GetCodeDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  language: supportLang;
}
