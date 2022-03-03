module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|js)$': 'babel-jest',
    '^.+\\.vue$': '@vue/vue3-jest',
  },
  moduleFileExtensions: ['json', 'js', 'jsx', 'ts', 'tsx', 'vue'],
  modulePathIgnorePatterns: ['cypress'],
  setupFiles: ['<rootDir>/tests/unit/jest.setup.js'],
  transformIgnorePatterns: ['node_modules/(?!(@starport))'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/__mocks__/file-mock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}
