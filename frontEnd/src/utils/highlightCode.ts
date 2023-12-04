import codeHighlighter from '@/configs/highlightCodeConfig';

const highlightCode = (language: string, code: string) => {
  return codeHighlighter.highlight(code, { language }).value.replace(/" "/g, '&nbsp; ');
};

export default highlightCode;
