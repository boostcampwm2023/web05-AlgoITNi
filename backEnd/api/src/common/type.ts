export type supportLang = 'python' | 'javascript' | 'java';
export function NotSupportLang(lang: string) {
  return !['python', 'javascript', 'java'].includes(lang);
}
