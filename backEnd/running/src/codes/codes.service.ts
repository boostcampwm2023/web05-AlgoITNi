import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ResponseCodeDto } from './dto/response-code.dto ';
import { RunningException } from 'src/common/exception/exception';
import { exec } from 'child_process';
type runCommandResult = { stdout: string; stderr: string };
@Injectable()
export class CodesService {
  private logger = new Logger(CodesService.name);
  private tempDir = path.join(__dirname, '..', 'tmp');
  private timeOutMessage = '코드가 실행되는데 너무 오래 걸립니다.';
  private unKnownMessage = '알 수 없는 에러가 발생했습니다.';
  private killSignal: NodeJS.Signals = 'SIGINT';
  private readonly timeOut = 5000;

  constructor() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir);
    }
  }

  async testCode(code: string): Promise<ResponseCodeDto | string> {
    this.logger.debug('function[testCode] Called');

    const filePath = this.getFilePath();

    try {
      fs.writeFileSync(filePath, code);
      const { stdout, stderr } = await this.runCommand(filePath, this.timeOut);
      if (stderr) {
        const errorMessage = this.getErrorMessage(stderr);
        throw new RunningException(errorMessage);
      }

      return this.getOutput(stdout);
    } catch (error) {
      this.logger.error(error.message);
      const errorMessage = this.getErrorMessage(error.message);

      if (errorMessage === this.unKnownMessage) {
        throw new InternalServerErrorException();
      }
      throw new RunningException(errorMessage);
    } finally {
      fs.unlinkSync(filePath);
    }
  }

  getFilePath() {
    const fileName = `python-${Date.now()}.py`;
    return path.join(this.tempDir, fileName);
  }

  runCommand(filePath, timeout): Promise<runCommandResult> {
    return new Promise((resolve) => {
      const childProcess = exec(
        `python3 ${filePath}`,
        (error, stdout, stderr) => {
          if (error) {
            this.logger.error(`failed to run requested code ${error.message}`);

            if (error.signal === this.killSignal) {
              stderr = this.timeOutMessage;
            }
            resolve({ stdout, stderr });
          } else {
            resolve({ stdout, stderr });
          }
        },
      );

      // 일정 시간 후 자식 프로세스 강제 종료
      setTimeout(() => {
        this.logger.log('timeout!');
        childProcess.kill(this.killSignal);
      }, timeout);
    });
  }

  getOutput(stdout: string): ResponseCodeDto {
    const output = stdout.split('\n').map((line) => line.replace('\r', ''));
    output.pop();
    const result: ResponseCodeDto = { output: output };
    return result;
  }

  getErrorMessage(stderr: string): string {
    if (stderr === this.timeOutMessage) return stderr;

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

    return this.unKnownMessage;
  }
}
