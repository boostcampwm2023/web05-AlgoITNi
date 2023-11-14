import { IsString } from 'class-validator';

export class GetCodeBlockDto {
  @IsString()
  data: string;
}
