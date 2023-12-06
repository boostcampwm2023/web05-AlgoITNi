export type supportLang = 'python' | 'javascript' | 'java' | 'c';
export function NotSupportLang(lang: string) {
  return !['python', 'javascript', 'java', 'c'].includes(lang);
}

export const languageExtName = {
  '.js': 'javascript',
  '.py': 'python',
  '.java': 'java',
  '.c': 'c',
};
