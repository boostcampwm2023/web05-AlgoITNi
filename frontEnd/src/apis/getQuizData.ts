import Request from './Request';

export default async function getQuizData(problemURL: string) {
  const result = await Request.get(`/cache?url=${problemURL}`);
  return result.data;
}
