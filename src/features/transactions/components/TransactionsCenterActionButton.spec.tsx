/**
 * @vitest-environment jsdom
 */

import 'regenerator-runtime/runtime';

import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';

import TransactionsCenterActionButton from './TransactionsCenterActionButton.vue';

test('should render', async () => {
  const wrapper = mount(TransactionsCenterActionButton, {
    global: {
      plugins: [createTestingPinia({ createSpy: () => ({ foo: 'bar' }) })],
      stubs: {
        Pinia: {},
        Icon: true,
        tippy: {
          name: 'CustomTippy',
          template: '<p><slot name="content" /></p>',
        },
      },
    },
  });
  expect(wrapper.html()).toBeTruthy();
});
