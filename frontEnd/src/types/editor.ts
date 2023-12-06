export type Language = 'python' | 'javascript' | 'java' | 'c';

export interface LanguageInfo {
  name: Language;
  optionText: string;
  extension: string;
}
