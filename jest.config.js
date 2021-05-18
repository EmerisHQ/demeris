module.exports = {
	moduleFileExtensions: ['js', 'vue', 'ts'],
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
	testMatch: ['**/src/**/*.spec.[jt]s?(x)'],
  transform: {
    '.*\\.(vue)$': 'vue-jest',
  },
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1'
	}
}
