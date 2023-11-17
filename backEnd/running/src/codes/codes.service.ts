import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { execPromise } from 'src/common/utils';
import { ResponseCodeDto } from './dto/response-code.dto ';
import { RunningException } from 'src/common/exception/exception';

@Injectable()
export class CodesService {
  private logger = new Logger(CodesService.name);
  private tempDir = path.join(__dirname, '..', 'tmp');

  constructor() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir);
    }
  }

  async testCode(
    code: string,
    isHttp: boolean = true,
  ): Promise<ResponseCodeDto | string> {
    this.logger.debug('testCode Called');

    const filePath = this.getFilePath();

    try {
      fs.writeFileSync(filePath, code);
      // const { stdout, stderr } = await execPromise(`python3 ${filePath}`);
      const { stdout, stderr } = await this.run(filePath);

      if (stderr) {
        const errorMessage = this.getErrorMessage(stderr);
        throw new RunningException(errorMessage);
      }

      return this.getOutput(stdout);
    } catch (error) {
      this.logger.error(error.message);
      const errorMessage = this.getErrorMessage(error.message);
      if (isHttp) throw new RunningException(errorMessage); // Https 요청일 경우
      else return errorMessage;
    } finally {
      fs.unlinkSync(filePath);
    }
  }

  getFilePath() {
    const fileName = `python-${Date.now()}.py`;
    return path.join(this.tempDir, fileName);
  }

  async run(filePath) {
    await new Promise((resolve) => {
      setTimeout(resolve, 10000);
    });
    const { stdout, stderr } = await execPromise(`python3 ${filePath}`);
    console.log('코드 실행 완료');
    return { stdout, stderr };
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

    const errorMessage = '알 수 없는 에러가 발생했습니다.';
    return errorMessage;
  }
}
