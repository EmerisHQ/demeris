module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: ['@babel/plugin-proposal-nullish-coalescing-operator', '@babel/plugin-proposal-optional-chaining'],
  env: {
    test: {
      presets: [
        '@babel/preset-typescript',
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current',
            },
          },
        ],
      ],
      plugins: ['@babel/plugin-transform-runtime'],
    },
  },
};
