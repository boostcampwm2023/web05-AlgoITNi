import { isAxiosError } from 'axios';

export default function ErrorView({ error }: { error: Error }) {
  console.log(error);
  if (isAxiosError(error) && error.response && error.response.status === 500) {
    return <div className="font-bold text-point-red animate-[vibration_.5s_linear]">오류가 발생했습니다!</div>;
  }
  if (isAxiosError(error) && error.response && error.response.status === 404) {
    return <div className="font-bold text-point-red animate-[vibration_.5s_linear]">페이지를 찾을 수 없습니다!</div>;
  }
}
