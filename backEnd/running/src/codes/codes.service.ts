import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { execPromise } from 'src/common/utils';

@Injectable()
export class CodesService {
  async testCode(code: string) {
    const tempDir = path.join(__dirname, '..', 'tmp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const fileName = `python-${Date.now()}.py`;
    const filePath = path.join(tempDir, fileName);

    fs.writeFileSync(filePath, code);

    try {
      const { stdout, stderr } = await execPromise(`python3 ${filePath}`);
      fs.unlinkSync(filePath);

      if (stderr) {
        throw new HttpException(stderr, HttpStatus.BAD_REQUEST);
      }

      return stdout;
    } catch (error) {
      fs.unlinkSync(filePath);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
