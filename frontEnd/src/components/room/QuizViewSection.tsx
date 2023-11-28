import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useModal from '@/hooks/useModal';
import LinkInputModal from './modal/LinkInputModal';
import clickSrc from '@/assets/click.svg';
import QUERY_KEYS from '@/constants/queryKeys';
import getQuizData from '@/apis/getQuizData';
import Button from '../common/Button';

const overFlowXHidden = (document: Document) => {
  document.body.style.overflowX = 'hidden';
};
const clickDisable = (document: Document) => {
  document.body.addEventListener(
    'click',
    (e) => {
      e.preventDefault();
    },
    true,
  );
};

function ClickToQuizInput() {
  return (
    <div className="flex gap-2">
      <img src={clickSrc} width="20px" alt="clickIcon" />
      <div>클릭해서 링크 입력하기</div>
    </div>
  );
}

function QuizView({ htmlData }: { htmlData?: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const iframe = iframeRef.current;
    const handleLoad = () => {
      const innerDocument = iframe?.contentDocument;
      if (innerDocument) {
        overFlowXHidden(innerDocument);
        clickDisable(innerDocument);
      }
    };
    if (iframe && htmlData) {
      iframe.srcdoc = htmlData;
      iframe.onload = handleLoad;
    }
  }, [htmlData]);

  return (
    <div className="w-full h-[90%]">
      <iframe ref={iframeRef} title="quiz" className="flex items-center justify-center w-full h-full overflow-hidden text-white" />
    </div>
  );
}

export default function QuizViewSection() {
  const [url, setURL] = useState('');
  const { show: showLinkInputModal } = useModal(LinkInputModal);
  const { data } = useQuery({ queryKey: [QUERY_KEYS, url], queryFn: () => getQuizData(url), enabled: !!url });
  return url === '' && !data ? (
    <button
      type="button"
      className="flex items-center justify-center w-full h-full text-white rounded-lg bg-primary "
      onClick={() => showLinkInputModal({ setURL })}
    >
      <ClickToQuizInput />
    </button>
  ) : (
    <div className="flex flex-col w-full h-full gap-2 p-4 rounded-lg ovelrflow-hidden bg-primary">
      <div className="flex justify-end w-full">
        <Button.Dark fontSize="0.8rem" onClick={() => showLinkInputModal({ setURL })}>
          변경하기
        </Button.Dark>
      </div>
      <QuizView htmlData={data} />
    </div>
  );
}
