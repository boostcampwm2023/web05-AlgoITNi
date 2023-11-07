export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^.+\\.svg$': 'jest-svg-transformer',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '@apis(.*)$': '<rootDir>/src/apis$1',
    '@components(.*)$': '<rootDir>/src/components$1',
    '@constants(.*)$': '<rootDir>/src/constants$1',
    '@hooks(.*)$': '<rootDir>/src/hooks$1',
    '@pages(.*)$': '<rootDir>/src/pages$1',
    '@styles(.*)$': '<rootDir>/src/styles$1',
    '@utils(.*)$': '<rootDir>/src/utils$1',
    '@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
