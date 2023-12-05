export const CHATTING_ERROR_STATUS_CODE = {
  MESSAGE_ERROR_CODE: 400,
  SERVER_ERROR_CODE: 500,
  AI_ERROR_CODE: 429,
};

export const CHATTING_ERROR_TEXT = {
  MESSAGE_ERROR_TEXT: { text1: '메시지를 보내는 과정에 오류가 발생했습니다.', text2: '잠시후 다시 시도해주세요.' },
  SERVER_ERROR_TEXT: { text1: '현재 일시적으로 사용할 수 없습니다.', text2: '이용에 불편을 드려 죄송합니다.' },
  AI_ERROR_TEXT: { text1: '다른 인원이 이미 AI를 사용중입니다.', text2: '잠시후 다시 시도해주세요.' },
};
