import Request from './Request';

export default async function getDevCookie() {
  const { headers } = await Request.get('/auth/dev');
  const auth = headers.authorization;
  const accessToken = auth.split('Bearer')[1];
  return accessToken;
}
