/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  rootDir: 'server',
  collectCoverageFrom: ['*/**.ts'],
  coverageDirectory: '../coverage',
  globals: {
    'ts-jest': {
      tsconfig: './server/tsconfig.json',
    },
  },
  coverageReporters: ['json', 'lcov', 'text', 'html'],
}
