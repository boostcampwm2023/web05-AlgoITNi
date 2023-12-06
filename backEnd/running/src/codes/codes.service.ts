import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ResponseCodeDto } from './dto/response-code.dto ';
import { RunningException } from 'src/common/exception/exception';
import { exec } from 'child_process';
import { languageCommand, Messages, needCompile } from '../common/utils';
import { supportLang, runCommandResult } from '../common/type';
import { RequestCodeDto } from './dto/request-code.dto';
import * as process from 'process';
import { errorMessage } from './errorMessage';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CodesService {
  private logger = new Logger(CodesService.name);
  private tempDir =
    process.env.NODE_ENV === 'dev'
      ? path.join(__dirname, '..', 'tmp')
      : '/algoitni';
  private killSignal: NodeJS.Signals = 'SIGINT';
  private readonly timeOut = 5000;
  constructor() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir);
    }
  }

  async runCode(codeBlock: RequestCodeDto): Promise<ResponseCodeDto | string> {
    const { code, language } = codeBlock;
    const filePaths = this.getFilePath(language);
    const [filePath, compile_dist] = filePaths;
    try {
      fs.writeFileSync(filePath, code);
      const { stdout, stderr } = await this.runCommand(filePaths, language);
      if (stderr) {
        throw new RunningException(stderr.trim());
      }
      return this.getOutput(stdout);
    } finally {
      fs.unlinkSync(filePath);
      if (needCompile.includes(language)) {
        fs.unlinkSync(compile_dist);
      }
    }
  }

  runCommand(
    filePaths: string[],
    language: supportLang,
  ): Promise<runCommandResult> {
    const command = languageCommand(language, filePaths);
    return new Promise((resolve) => {
      // eslint-disable-next-line
      let timer;
      const childProcess = exec(command, (error, stdout, stderr) => {
        clearTimeout(timer);
        if (error) {
          this.logger.error(`failed to run requested code ${error.message}`);

          if (error.signal === this.killSignal) {
            stderr = Messages.TIMEOUT;
          }
          resolve({ stdout, stderr });
        } else {
          resolve({ stdout, stderr });
        }
      });

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
    const uuid = uuidv4();
    const extensions = {
      python: '.py',
      javascript: '.js',
      java: '.java',
      c: '.c',
    };

    const fileExtension = extensions[language] || '';

    return [
      path.join(this.tempDir, `${uuid}${fileExtension}`),
      path.join(this.tempDir, `${uuid}`),
    ];
  }
}
