import codeHighlighter from 'highlight.js/lib/core';

import python from 'highlight.js/lib/languages/python';
import javascript from 'highlight.js/lib/languages/javascript';
import java from 'highlight.js/lib/languages/java';
import c from 'highlight.js/lib/languages/c';

codeHighlighter.registerLanguage('python', python);
codeHighlighter.registerLanguage('javascript', javascript);
codeHighlighter.registerLanguage('java', java);
codeHighlighter.registerLanguage('c', c);

export default codeHighlighter;
