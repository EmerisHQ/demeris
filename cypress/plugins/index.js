import extensionLoader from 'cypress-browser-extension-plugin';
import * as path from 'path';
import puppeteer from 'puppeteer';

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
    // supply the absolute path to an unpacked extension's folder
    launchOptions.extensions.push(path.join(config.fixturesFolder, 'Keplr'));

    return launchOptions;
  });
};
/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars

// export default (on) => {
//   // `on` is used to hook into various events Cypress emits
//   // `config` is the resolved Cypress config
//   // on('before:browser:launch', extensionLoader.load('cypress/plugins/extensions/Keplr/'));
// };
