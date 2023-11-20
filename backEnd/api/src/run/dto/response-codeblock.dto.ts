export class ResponseCodeBlockDto {
  statusCode: number;
  result: string | string[];
  message: string;
  timestamp: string;
  constructor(statusCode, result, message) {
    this.statusCode = statusCode;
    this.result = result;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }
}
