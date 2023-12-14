import { Expose } from 'class-transformer';

export class SaveResultDto {
  @Expose()
  id: string;
}
