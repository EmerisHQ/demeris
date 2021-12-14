/* eslint-disable */
const { config } = require('@vue/test-utils');
const { createTestingPinia } = require('@pinia/testing');
const router = require('../../src/router');

const pinia = createTestingPinia();

global.scrollTo = jest.fn();
config.global.plugins = [pinia, router.default];
config.global.stubs = { tippy: true };
config.renderStubDefaultSlot = true;
