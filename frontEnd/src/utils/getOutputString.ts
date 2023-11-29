import { RunCodeResponse } from '@/types/runCode';
import dateFormatter from './dateFormatter';

export default function getOutputString(runCodeResponse: RunCodeResponse): string {
  return `${runCodeResponse.result}\n\n실행시간: ${dateFormatter(runCodeResponse.timestamp)}`;
}
