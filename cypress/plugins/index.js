require('fs-extra');
// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
module.exports = (on, config) => {
  on('before:browser:launch', (browser, launchOptions) => {
    // NOTE: extensions cannot be loaded in headless Chrome
    launchOptions.extensions.push('Keplr');

    return launchOptions;
  });
};
const {
  addMatchImageSnapshotPlugin,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('cypress-image-snapshot/plugin');

module.exports = (on, config) => {
  addMatchImageSnapshotPlugin(on, config);
};
/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
export default (on) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  // on('before:browser:launch', extensionLoader.load('cypress/plugins/extensions/Keplr/'));
};
