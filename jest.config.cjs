module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/server'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  moduleNameMapper: {
    '^@server/(.*)$': '<rootDir>/server/$1',
  },
  collectCoverageFrom: [
    'server/**/*.ts',
    '!server/**/*.test.ts',
    '!server/**/*.spec.ts',
    '!server/**/__tests__/**',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
};
