import { PipeTransform, Injectable } from '@nestjs/common';
import * as path from 'path';
import { SaveCodeDto } from '../dto/saveCode.dto';
import { ExtNameException } from '../../common/exception/exception';

const languageExtName = {
  '.js': 'javascript',
  '.py': 'python',
};

@Injectable()
export class SaveCodePipe implements PipeTransform {
  transform(value: SaveCodeDto) {
    if (languageExtName[path.extname(value.title)] !== value.language) {
      throw new ExtNameException();
    }
    return value;
  }
}
