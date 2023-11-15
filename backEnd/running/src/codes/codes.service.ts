import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { execPromise } from 'src/common/utils';
import { ResponseCodeDto } from './dto/response-code.dto ';
import { RunningException } from 'src/common/exception/exception';

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
      const { stdout, stderr } = await execPromise(`py ${filePath}`);

      if (stderr) {
        const errorMessage = this.getErrorMessage(stderr);
        throw new RunningException(errorMessage);
      }

      return this.getOutput(stdout);
    } catch (error) {
      const errorMessage = this.getErrorMessage(error.message);
      throw new RunningException(errorMessage);
    } finally {
      fs.unlinkSync(filePath);
    }
  }

  getOutput(stdout: string): ResponseCodeDto {
    const output = stdout.split('\n').map((line) => line.replace('\r', ''));
    output.pop();
    const result: ResponseCodeDto = { output: output };
    return result;
  }

  getErrorMessage(stderr: string): string {
    const errorLines = stderr.split('\n');

    const errorLineIndex = errorLines.findIndex(
      (line) =>
        line.trim().startsWith('NameError:') ||
        line.trim().startsWith('SyntaxError:') ||
        line.trim().startsWith('TypeError:') ||
        line.trim().startsWith('IndexError:') ||
        line.trim().startsWith('ValueError:') ||
        line.trim().startsWith('KeyError:') ||
        line.trim().startsWith('AttributeError:') ||
        line.trim().startsWith('IndentationError:') ||
        line.trim().startsWith('FileNotFoundError:'),
    );

    if (errorLineIndex !== -1) {
      const errorMessage = errorLines[errorLineIndex].trim();
      return errorMessage;
    }

    const errorMessage = '알수없는 에러가 발생했습니다.';
    return errorMessage;
  }
}
