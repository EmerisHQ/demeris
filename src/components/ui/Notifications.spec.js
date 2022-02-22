// npx jest -- src/components/ui/Notifications.spec.js
import { mount } from '@vue/test-utils';

import Notifications from './Notifications.vue';

describe('Notifications', () => {
  it.only('Updates to props update HTML', async () => {
    const testData = [];
    const totalNotifications = 6;
    for (let i = 0; i < totalNotifications; i++) {
      testData.push({ message: `Transaction item ${i}`, id: i });
    }

    const wrapper = mount(Notifications, {
      sync: true,
      props: {
        messages: testData,
        button1Label: 'Undo',
        button2Label: 'Details',
        showLessLabel: 'Show Less',
        clearAllLabel: 'Clear All',
      },
    });

    expect(wrapper.html()).toContain('Undo');
    expect(wrapper.html()).toContain('Details');

    await wrapper.setProps({ button1Label: 'Undo2' });
    await wrapper.setProps({ button2Label: 'Details2' });

    expect(wrapper.html()).toContain('Undo2');
    expect(wrapper.html()).toContain('Details2');
    expect(wrapper.findAll('[data-test="single-notification-message"]')).toHaveLength(totalNotifications);
    testData.pop();
    await wrapper.setProps({ messages: testData });
    expect(wrapper.findAll('[data-test="single-notification-message"]')).toHaveLength(totalNotifications - 1);
  });

  // it('Should load 6 notifications and add 1, leaving 7', async () => {})

  // it('Should open messages, then collapse', async () => {})

  // it('Should clear all messages', async () => {})
});
