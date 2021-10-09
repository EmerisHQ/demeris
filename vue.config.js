const gitVersion = require('./build/git-version');
const pkg = require('./package.json');

process.env.VUE_APP_GIT_VERSION = gitVersion();
process.env.VUE_APP_VERSION = pkg.version;

module.exports = {
  transpileDependencies: ['@starport/tendermint-liquidity-js', 'vue-meta'],
  publicPath: process.env.VUE_APP_ELECTRON === 'true' ? './' : '/',
};
