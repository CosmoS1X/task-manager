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
    '!server/main.ts',
    '!server/**/*.module.ts',
    '!server/**/*.dto.ts',
    '!server/**/*.entity.ts',
    '!server/types/**',
    '!server/migrations/**',
    '!server/database/**',
  ],
  coverageDirectory: './coverage',
    coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
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
