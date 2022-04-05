/**
 * @vitest-environment jsdom
 */

import 'regenerator-runtime/runtime';

import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import VueTippy from 'vue-tippy';

import TransactionsCenterActionButton from './TransactionsCenterActionButton.vue';

test('should render', async () => {
  const wrapper = mount(TransactionsCenterActionButton, {
    global: {
      plugins: [VueTippy, createTestingPinia({ createSpy: () => ({ foo: 'bar' }) })],
      stubs: {
        Pinia: {},
        Icon: true,
      },
    },
  });
  expect(wrapper.html()).toBeTruthy();
});
