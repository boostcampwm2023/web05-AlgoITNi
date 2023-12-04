import { useEffect, useRef } from 'react';

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

export default function QuizIframe({ htmlData }: { htmlData?: string }) {
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
      <iframe ref={iframeRef} title="quiz" className="flex items-center justify-center w-full h-full overflow-hidden" />
    </div>
  );
}
