import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useModal from '@/hooks/useModal';
import LinkInputModal from './modal/LinkInputModal';
import QUERY_KEYS from '@/constants/queryKeys';
import getQuizData from '@/apis/getQuizData';
import Button from '../common/Button';
import ClickToQuizInput from './quizView/ClickToQuizInput';
import QuizIframe from './quizView/QuizIframe';
import Loading from './quizView/Loading';

export default function QuizViewSection() {
  const [url, setURL] = useState('');
  const { show: showLinkInputModal } = useModal(LinkInputModal);
  const { data, isLoading } = useQuery({ queryKey: [QUERY_KEYS, url], queryFn: () => getQuizData(url), enabled: !!url });

  if (url === '' && !data)
    return (
      <button
        type="button"
        className="flex items-center justify-center w-full h-full text-white rounded-lg bg-primary "
        onClick={() => showLinkInputModal({ setURL })}
      >
        <ClickToQuizInput />
      </button>
    );

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col w-full h-full gap-2 p-4 rounded-lg ovelrflow-hidden bg-primary">
      <div className="flex justify-end w-full">
        <Button.Dark fontSize="0.8rem" onClick={() => showLinkInputModal({ setURL })}>
          변경하기
        </Button.Dark>
      </div>
      <QuizIframe htmlData={data} />
    </div>
  );
}
