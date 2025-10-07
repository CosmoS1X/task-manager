module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.*\\.(spec|e2e-spec)\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    'server/**/*.(t|j)s',
  ],
  coveragePathIgnorePatterns: [
    'server/main.ts',
    '.dto.ts$',
    '/types/',
    '/migrations/',
    '/database/',
    'constructor.*private.*readonly',
  ],
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'lcov', 'html', 'text-summary'],
  moduleNameMapper: {
    '^@server/(.*)$': '<rootDir>/server/$1',
    '^@client/(.*)$': '<rootDir>/client/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  modulePaths: ['<rootDir>'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],
};
