import { Language } from '@/types/editor';
import AuthRequest from './AuthRequest';

export default function postUserCode(title: string, content: string, language: Language) {
  return AuthRequest.post('/codes', {
    title,
    content,
    language,
  });
}
