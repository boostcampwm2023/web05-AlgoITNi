export type supportLang = 'python' | 'javascript' | 'java';
export function NotSupportLang(lang: string) {
  return !['python', 'javascript', 'java'].includes(lang);
}

export const languageExtName = {
  '.js': 'javascript',
  '.py': 'python',
  '.java': 'java',
};
