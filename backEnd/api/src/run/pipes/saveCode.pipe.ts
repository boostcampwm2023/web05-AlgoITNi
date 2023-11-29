import { PipeTransform, Injectable } from '@nestjs/common';
import { ExtNameException } from '../../common/exception/exception';
import { RequestCodeBlockDto } from '../dto/request-codeblock.dto';
import { ResponseMessage } from '../../common/utils';

@Injectable()
export class RequestRunPipe implements PipeTransform {
  transform(value: RequestCodeBlockDto) {
    if (!['python', 'javascript'].includes(value.language)) {
      throw new ExtNameException(ResponseMessage.NOT_SUPPORT);
    }
    return value;
  }
}
