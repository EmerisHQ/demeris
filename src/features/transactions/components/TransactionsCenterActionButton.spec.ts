import { mount } from '@vue/test-utils';

import TransactionsCenterActionButton from './TransactionsCenterActionButton.vue';

test('should render', () => {
  const wrapper = mount(TransactionsCenterActionButton, {
    global: {
      stubs: {
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
