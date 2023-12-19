export type supportLang =
  | 'python'
  | 'javascript'
  | 'java'
  | 'c'
  | 'swift'
  | 'kotlin';

export const languageExtName = {
  javascript: '.js',
  python: '.py',
  java: '.java',
  c: '.c',
  swift: '.swift',
  kotlin: '.kt',
};

export const distExtName = {
  kotlin: '.jar',
};

export function languageCommand(language, filePaths): string[] {
  const [filepath, compile_dist] = filePaths;
  switch (language) {
    case 'python':
      return [`python3 ${filepath}`];
    case 'javascript':
      return [`node ${filepath}`];
    case 'java':
      return [`java -Dfile.encoding=UTF-8 ${filepath}`];
    case 'c':
      return [`gcc -o ${compile_dist} ${filepath}`, compile_dist];
    case 'swift':
      return [`swiftc -o ${compile_dist} ${filepath}`, compile_dist];
    case 'kotlin':
      return [
        `kotlinc ${filepath} -include-runtime -d ${compile_dist}`,
        `java -jar -Dfile.encoding=UTF-8 ${compile_dist}`,
      ];
  }
}
export const needCompile = ['c', 'swift', 'kotlin'];
