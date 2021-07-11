module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'vue', 'ts'],
  testMatch: ['**/src/**/*.spec.[jt]s?(x)'],
  transform: {
    '^.+\\.(ts|js)$': 'ts-jest',
    '.*\\.(vue)$': 'vue-jest',
  },
  setupFiles: ['<rootDir>/tests/unit/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
