export type supportLang =
  | 'python'
  | 'javascript'
  | 'java'
  | 'c'
  | 'swift'
  | 'kotlin';
export function NotSupportLang(lang: string) {
  return !['python', 'javascript', 'java', 'c', 'swift', 'kotlin'].includes(
    lang,
  );
}

export const languageExtName = {
  '.js': 'javascript',
  '.py': 'python',
  '.java': 'java',
  '.c': 'c',
  '.swift': 'swift',
  '.kt': 'kotlin',
};
