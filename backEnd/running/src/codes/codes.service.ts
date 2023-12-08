import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ResponseCodeDto } from './dto/response-code.dto ';
import { RunningException } from 'src/common/exception/exception';
import { spawn } from 'child_process';
import { Messages } from '../common/utils';
import {
  supportLang,
  languageExtName,
  distExtName,
  needCompile,
  languageCommand,
} from '../common/supportLang';
import { runCommandResult } from '../common/type';
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
        console.log(stderr);
        throw new RunningException(stderr.trim());
      }
      return this.getOutput(stdout);
    } finally {
      try {
        fs.unlinkSync(filePath);
        if (needCompile.includes(language)) {
          fs.unlinkSync(compile_dist);
        }
      } catch (e) {
        this.logger.error('fail to delete file', e);
      }
    }
  }

  runCommand(
    filePaths: string[],
    language: supportLang,
  ): Promise<runCommandResult> {
    const command = languageCommand(language, filePaths);
    return new Promise((resolve) => {
      const commandParts = command.split(' ');
      const stdout = [];
      const stderr = [];
      try {
        const childProcess = spawn(commandParts[0], commandParts.slice(1));
        const timer = setTimeout(() => {
          this.logger.log('timeout!');
          childProcess.kill(this.killSignal);
        }, this.timeOut);

        childProcess.stdout.on('data', (data) => {
          // Handle stdout data
          stdout.push(data);
        });

        childProcess.stderr.on('data', (data) => {
          // Handle stderr data
          stderr.push(data);
        });

        childProcess.on('close', (code, signal) => {
          this.logger.log(`child process exited with code ${code}, ${signal}`);
          clearTimeout(timer);
          const out = Buffer.concat(stdout).toString();
          const err =
            signal === this.killSignal
              ? Messages.TIMEOUT
              : Buffer.concat(stderr).toString();
          resolve({ stdout: out, stderr: err });
        });
      } catch (e) {
        this.logger.error(e);
      }
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

    const fileExtension = languageExtName[language] || '';
    const distExtension = distExtName[language] || '';
    return [
      path.join(this.tempDir, `${uuid}${fileExtension}`),
      path.join(this.tempDir, `${uuid}${distExtension}`),
    ];
  }
}
