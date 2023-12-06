export type Language = 'python' | 'javascript' | 'java' | 'c' | 'swift' | 'kotlin' | 'swift';

export interface LanguageInfo {
  name: Language;
  optionText: string;
  extension: string;
}
