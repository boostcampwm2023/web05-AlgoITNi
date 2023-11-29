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
import { LanguageCommand, Messages } from '../common/utils';
import { supportLang, runCommandResult } from '../common/type';
import { RequestCodeDto } from './dto/request-code.dto';
import * as process from 'process';
import { errorMessage } from './errorMessage';
@Injectable()
export class CodesService {
  private logger = new Logger(CodesService.name);
  private tempDir =
    process.env.NODE_ENV === 'dev' ? path.join(__dirname, '..', 'tmp') : '/';
  private killSignal: NodeJS.Signals = 'SIGINT';
  private readonly timeOut = 5000;
  constructor() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir);
    }
  }

  async runCode(codeBlock: RequestCodeDto): Promise<ResponseCodeDto | string> {
    this.logger.debug('function[testCode] Called');
    const { code, language } = codeBlock;
    const filePath = this.getFilePath(language);

    fs.writeFileSync(filePath, code);
    const { stdout, stderr } = await this.runCommand(filePath, language);
    if (stderr) {
      if (stderr === Messages.UNKNOWN) {
        throw new InternalServerErrorException();
      }
      const errorMessage = this.getErrorMessage(stderr, language);
      throw new RunningException(errorMessage);
    }
    fs.unlinkSync(filePath);
    return this.getOutput(stdout);
  }

  runCommand(filePath, language: supportLang): Promise<runCommandResult> {
    const command = LanguageCommand[language];
    return new Promise((resolve) => {
      // eslint-disable-next-line
      let timer;
      const childProcess = exec(
        `${command} ${filePath}`,
        (error, stdout, stderr) => {
          if (error) {
            this.logger.error(`failed to run requested code ${error.message}`);

            if (error.signal === this.killSignal) {
              stderr = Messages.TIMEOUT;
            }
            resolve({ stdout, stderr });
          } else {
            clearTimeout(timer);
            resolve({ stdout, stderr });
          }
        },
      );

      timer = setTimeout(() => {
        this.logger.log('timeout!');
        childProcess.kill(this.killSignal);
      }, this.timeOut);
    });
  }

  getOutput(stdout: string): ResponseCodeDto {
    return { output: stdout.trim() };
  }

  getErrorMessage(stderr: string, language: supportLang): string {
    if (stderr === Messages.TIMEOUT) return stderr;

    const errorLines = stderr.split('\n');
    const errorList = errorMessage[language];
    const errorLineIndex = errorLines.findIndex((line) =>
      errorList.some((keyword) => line.trim().startsWith(keyword)),
    );

    if (errorLineIndex !== -1) {
      return errorLines[errorLineIndex].trim();
    }

    return Messages.UNKNOWN;
  }

  getFilePath(language: supportLang) {
    switch (language) {
      case 'python':
        return path.join(this.tempDir, `python-${Date.now()}.py`);
      case 'javascript':
        return path.join(this.tempDir, `javascript-${Date.now()}.js`);
    }
  }
}
