import AuthRequest from './AuthRequest';

export default async function deleteUserCode(id: string) {
  const result = await AuthRequest.delete(`/codes/${id}`);
  return result.data;
}
