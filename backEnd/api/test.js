function javascriptCheck(code) {
  // 모듈 제한
  const blockedModules = [
    'child_process',
    'process',
    'fs',
    'os',
    'path',
    'readline',
  ];
  const blockModulesPattern = [
    new RegExp(
      `(?!["'])require\\s*\\(\\s*["'](${blockedModules.join('|')})`,
      'g',
    ),
  ];

  const blockExpression = [
    new RegExp(`(?!["'])process\\.(.*)`, 'y'),
    new RegExp(`(?!["'])\\s*__dirname\\s*(?!["'])`, 'y'),
  ];

  // check
  for (const pattern of [...blockModulesPattern, ...blockExpression]) {
    if (pattern.test(code)) {
      console.log(pattern);
      console.log(`⚠️Invalid Code Requested⚠️\n${code}`);
      return 'vulnerable';
    }
  }
  return 'safe';
}
console.log(javascriptCheck("const fs = require('fs/promise')"));
