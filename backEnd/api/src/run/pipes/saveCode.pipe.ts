import { PipeTransform, Injectable } from '@nestjs/common';
import { ExtNameException } from '../../common/exception/exception';
import { RequestCodeBlockDto } from '../dto/request-codeblock.dto';
import { ResponseMessage } from '../../common/utils';
import { NotSupportLang } from '../../common/supportLang';

@Injectable()
export class RequestRunPipe implements PipeTransform {
  transform(value: RequestCodeBlockDto) {
    if (NotSupportLang(value.language)) {
      throw new ExtNameException(ResponseMessage.NOT_SUPPORT);
    }
    return value;
  }
}
