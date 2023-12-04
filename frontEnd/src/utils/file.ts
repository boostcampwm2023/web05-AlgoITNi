import { EDITOR_LANGUAGE_TYPES } from '@/constants/editor';

export const uploadLocalFile = (onLoadCallback: (fileName: string, code: string, languageName: string) => void) => {
  const input = document.createElement('input');
  const extensions = Object.values(EDITOR_LANGUAGE_TYPES)
    .map((languageData) => `.${languageData.extension}`)
    .join(', ');

  input.type = 'file';
  input.accept = extensions;
  input.onchange = (changeFileEvent) => {
    const file = (changeFileEvent.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (fileLoadEvent) => {
        const [name, extension] = file.name.split('.');
        const languageName = Object.keys(EDITOR_LANGUAGE_TYPES).find((key) => EDITOR_LANGUAGE_TYPES[key].extension === extension) || '';

        onLoadCallback(name, (fileLoadEvent.target?.result as string) || '', languageName);
        input.remove();
      };

      reader.readAsText(file);
    }
  };

  input.click();
};

export const downloadLocalFile = (contents: string, fileName: string, extension: string) => {
  const element = document.createElement('a');
  const file = new Blob([contents], { type: 'text/plain' });
  const fileURL = URL.createObjectURL(file);

  element.href = fileURL;
  element.download = `${fileName || 'solution'}.${extension}`;
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
  URL.revokeObjectURL(fileURL);
};
