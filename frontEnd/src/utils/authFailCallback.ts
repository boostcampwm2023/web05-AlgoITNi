import { isAxiosError } from 'axios';

export default function createAuthFailCallback(callback: () => void) {
  return (err: Error) => {
    if (isAxiosError(err) && err.response && (err.response.status === 401 || err.response.status === 403)) {
      callback();
    }
  };
}
