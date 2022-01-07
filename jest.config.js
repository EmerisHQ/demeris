module.exports = {
  moduleFileExtensions: ['js', 'vue', 'ts'],
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  testMatch: ['**/src/**/*.spec.[jt]s?(x)'],
  transform: {
    '^.+\\.(ts|js)$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest',
  },
  setupFiles: ['<rootDir>/tests/unit/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
