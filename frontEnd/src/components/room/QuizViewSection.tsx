import { useState, memo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import QUERY_KEYS from '@/constants/queryKeys';
import getQuizData from '@/apis/getQuizData';
import ClickToQuizInput from './quizView/ClickToQuizInput';
import QuizIframe from './quizView/QuizIframe';
import Loading from './quizView/Loading';
import Section from '../common/SectionWrapper';
import useInput from '@/hooks/useInput';

function QuizViewSection() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setURL] = useState('');
  const { data, isLoading } = useQuery({ queryKey: [QUERY_KEYS, url], queryFn: () => getQuizData(url), enabled: !!url });
  const { inputValue, onChange } = useInput(url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setURL(inputValue);
  };

  const handleClick = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  if (isLoading) return <Loading />;

  return (
    <Section>
      <div className="flex flex-col w-full h-full gap-4 p-4">
        <form onSubmit={handleSubmit} className="w-full ">
          <input
            ref={inputRef}
            type="text"
            className="w-full p-2 border rounded-lg"
            value={inputValue}
            onChange={onChange}
            placeholder="링크를 입력하세요"
          />
        </form>
        {data && url ? <QuizIframe htmlData={data} /> : <ClickToQuizInput handleClick={handleClick} />}
      </div>
    </Section>
  );
}
export default memo(QuizViewSection);
