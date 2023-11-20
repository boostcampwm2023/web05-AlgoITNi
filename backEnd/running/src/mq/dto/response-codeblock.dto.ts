export class ResponseCodeBlockDto {
  statusCode: number;
  result: string | string[];
  message: string;
  timestamp: string;
  constructor() {
    this.timestamp = new Date().toISOString();
  }
}
