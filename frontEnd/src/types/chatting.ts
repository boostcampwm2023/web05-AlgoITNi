export interface MessageData {
  message: string;
  nickname: string;
  socketId: string;
  ai: boolean;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
}

export interface ErrorData {
  text1: string;
  text2: string;
}
