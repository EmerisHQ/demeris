const gitVersion = require('./build/git-version');
const pkg = require('./package.json');

process.env.VUE_APP_GIT_VERSION = gitVersion();
process.env.VUE_APP_VERSION = pkg.version;

module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
      ],
    },
  },
  chainWebpack: (config) => {
    config.plugins.delete('progress');
    config.plugin('simple-progress-webpack-plugin').use(require.resolve('simple-progress-webpack-plugin'), [
      {
        format: 'simple', // options are minimal, compact, expanded, verbose
      },
    ]);
  },
  transpileDependencies: ['@starport/tendermint-liquidity-js', 'vue-meta'],
};
