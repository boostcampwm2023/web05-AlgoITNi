import { LoadCodeData } from '@/types/loadCodeData';
import AuthRequest from './AuthRequest';

export default async function getUserCodes() {
  const result = await AuthRequest.get<LoadCodeData[]>('/codes');
  return result.data;
}
