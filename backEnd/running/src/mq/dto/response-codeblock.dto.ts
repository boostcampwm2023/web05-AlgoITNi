export class ResponseCodeBlockDto {
  jobID?: string | number;
  statusCode: number;
  result: string;
  message: string;
  timestamp: string;
  constructor() {
    this.timestamp = new Date().toISOString();
  }
}
