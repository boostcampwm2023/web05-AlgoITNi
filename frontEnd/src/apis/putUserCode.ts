import AuthRequest from './AuthRequest';

export default async function putUserCode(id: string, title: string, content: string, language: string) {
  const result = await AuthRequest.put(`/code/${id}`, {
    title,
    content,
    language,
  });
  return result;
}
