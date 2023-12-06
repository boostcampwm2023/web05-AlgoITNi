import { LanguageInfo } from '@/types/editor';

export const EDITOR_TAB_SIZE = 4;
export const EDITOR_LANGUAGE_TYPES: Record<string, LanguageInfo> = {
  python: {
    name: 'python',
    optionText: 'Python',
    extension: 'py',
  },
  javascript: {
    name: 'javascript',
    optionText: 'JavaScript',
    extension: 'js',
  },
  java: {
    name: 'java',
    optionText: 'Java',
    extension: 'java',
  },
  c: {
    name: 'c',
    optionText: 'C',
    extension: 'c',
  },
  kotlin: {
    name: 'kotlin',
    optionText: 'Kotlin',
    extension: 'kt',
  },
  swift: {
    name: 'swift',
    optionText: 'Swift',
    extension: 'swift',
  },
};

export const EDITOR_DEFAULT_LANGUAGE = 'python';
