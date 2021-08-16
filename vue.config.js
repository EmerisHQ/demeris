const gitVersion = require('./build/git-version');

process.env.VUE_APP_GIT_VERSION = gitVersion();

module.exports = {
  transpileDependencies: ['@starport/tendermint-liquidity-js'],
};
