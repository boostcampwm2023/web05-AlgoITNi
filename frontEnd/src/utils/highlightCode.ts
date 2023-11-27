import hljs from 'highlight.js';

const highlightCode = (language: string, code: string) => {
  return hljs.highlight(code, { language }).value.replace(/" "/g, '&nbsp; ');
};

export default highlightCode;
