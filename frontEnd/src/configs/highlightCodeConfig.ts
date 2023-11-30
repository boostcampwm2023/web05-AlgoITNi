import codeHighlighter from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import javascript from 'highlight.js/lib/languages/javascript';

codeHighlighter.registerLanguage('python', python);
codeHighlighter.registerLanguage('javascript', javascript);

export default codeHighlighter;
