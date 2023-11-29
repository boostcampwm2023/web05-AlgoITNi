import Request from './Request';

export default async function postRunCode(socketId: string, code: string, language: string) {
  const response = await Request.post(`/run/v3?id=${socketId}`, { code, language });

  return response.data;
}
