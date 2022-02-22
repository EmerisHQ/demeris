const gitVersion = require('./build/git-version');
const pkg = require('./package.json');

process.env.VUE_APP_GIT_VERSION = gitVersion();
process.env.VUE_APP_VERSION = pkg.version;

module.exports = {
  devServer: {
    overlay: false,
  },
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
  transpileDependencies: ['@starport/tendermint-liquidity-js', 'vue-meta'],
};
