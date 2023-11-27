export class ResponseCodeBlockDto {
  jobID?: string | number;
  statusCode: number;
  result: string | string[];
  message: string;
  timestamp: string;
  constructor() {
    this.timestamp = new Date().toISOString();
  }
}
