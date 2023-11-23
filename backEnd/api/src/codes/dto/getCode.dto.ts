import { Expose } from 'class-transformer';

export class GetCodeDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  content: string;
}
