import { IsString } from 'class-validator';

export class RequestCodeblockDto {
  @IsString()
  code: string;
}
