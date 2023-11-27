export const uploadLocalFile = (onLoadCallback: (result: string) => void) => {
  const input = document.createElement('input');

  input.type = 'file';
  input.accept = '.py';
  input.onchange = (changeFileEvent) => {
    const file = (changeFileEvent.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (fileLoadEvent) => {
        onLoadCallback((fileLoadEvent.target?.result as string) || '');
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
  element.download = `${fileName}.${extension}`;
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
  URL.revokeObjectURL(fileURL);
};
