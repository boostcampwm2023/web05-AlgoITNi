import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { execPromise } from 'src/common/utils';

@Injectable()
export class CodesService {
  private readonly pythonContainer = 'python-container-1';

  async testCode(code: string) {
    const tempDir = path.join(__dirname, '..', 'tmp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const fileName = `python-${Date.now()}.py`;
    const filePath = path.join(tempDir, fileName);
    const mountPath = `/tmp/${fileName}`;

    fs.writeFileSync(filePath, code);

    try {
      const container = this.pythonContainer;
      const command = `docker exec ${container} python ${mountPath}`;
      const { stdout, stderr } = await execPromise(command);
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
