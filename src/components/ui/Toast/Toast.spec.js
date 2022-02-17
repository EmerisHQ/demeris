// npx jest -- src/components/ui/Toast/Toast.spec.js --watch
import { mount } from '@vue/test-utils';
import Vue from 'vue';

import Toast from './Toast.vue';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Toast', () => {
  test('Mounts Successfully and Initial state has no notifications', () => {
    const wrapper = mount(Toast);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[data-test=messages-container]').exists()).toBe(false);
    expect(wrapper.findAll('.toast-message')).toHaveLength(0);
  });

  test('Adding array of initial notifications, Remove 1, Add 2', async () => {
    const testData = [];
    const totalNotifications = 2;
    const additionalNotifications = 2;
    for (let i = 0; i < totalNotifications; i++) {
      testData.push({ message: `Transaction item ${i}`, action: '', date: '', id: i });
    }
    const wrapper = mount(Toast, {
      props: { messages: testData },
    });
    expect(wrapper.find('[data-test=messages-container]').exists()).toBeTruthy();
    await delay(1000);
    expect(wrapper.findAll('.toast-message')).toHaveLength(totalNotifications);

    await wrapper.find('[data-test=dismiss-toast-1]').trigger('click');
    expect(wrapper.findAll('.toast-message')).toHaveLength(totalNotifications - 1);

    for (let i = totalNotifications; i < totalNotifications + additionalNotifications; i++) {
      testData.push({ message: `Transaction item ${i}`, action: '', date: '', id: i });
    }
    await wrapper.setProps({ messages: testData });
    await delay(1000);
    expect(wrapper.findAll('.toast-message')).toHaveLength(totalNotifications + 2);
  });
});
