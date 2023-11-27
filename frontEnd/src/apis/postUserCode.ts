import AuthRequest from './AuthRequest';

export default function postUserCode(title: string, content: string) {
  return AuthRequest.post('/codes', {
    title,
    content,
  });
}
