import { LanguageInfo } from '@/types/editor';

export const EDITOR_TAB_SIZE = 4;
export const EDITOR_LANGUAGE_TYPES: { [key: string]: LanguageInfo } = {
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
};

export const EDITOR_DEFAULT_LANGUAGE = 'python';
