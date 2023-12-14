export type Language = 'python' | 'javascript' | 'java' | 'c' | 'swift' | 'kotlin';

export interface LanguageInfo {
  name: Language;
  optionText: string;
  extension: string;
}
