/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    './server/__test__/'
  ],
  globals: {
    'ts-jest': {
      tsconfig: './server/tsconfig.json',
    },
  },
  coverageReporters: [
    "json",
    "lcov",
    "text",
    "html"
  ]
};
