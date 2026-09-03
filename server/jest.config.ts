import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  extensionsToTreatAsEsm: ['.ts'],
  transform: { '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.spec.json', useESM: true }] },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/mail/mail\\.service$': '<rootDir>/__mocks__/mail.service',
    '^@/common/utils/save-upload$': '<rootDir>/__mocks__/save-upload',
    '^@/(.*)$': '<rootDir>/$1',
  },
};

export default config;
