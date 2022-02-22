// npx jest -- src/components/ui/Toast/Toast.spec.js
import { mount } from '@vue/test-utils';
import Vue from 'vue';

import Toast from './Toast.vue';

describe('Toast', () => {
  it('Mounts Successfully and Initial state has no notifications', () => {
    const wrapper = mount(Toast);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[data-test=messages-container]').exists()).toBe(false);
    expect(wrapper.findAll('.toast-message')).toHaveLength(0);
  });

  it('Should display 7 notifications loaded from props', async () => {
    const testData = [];
    const totalNotifications = 7;
    // const additionalNotifications = 2;
    for (let i = 0; i < totalNotifications; i++) {
      testData.push({ message: `Transaction item ${i}`, action: '', date: '', id: i });
    }
    const wrapper = mount(Toast, {
      propsData: { messages: testData },
    });
    expect(wrapper.find('[data-test=messages-container]').exists()).toBeTruthy();
    expect(wrapper.findAll('[data-test=toast-message]')).toHaveLength(totalNotifications);

    // await wrapper.find('[data-test=dismiss-toast-1]').trigger('click');
    // expect(wrapper.findAll('.toast-message')).toHaveLength(totalNotifications - 1);

    // for (let i = totalNotifications; i < totalNotifications + additionalNotifications; i++) {
    //   testData.push({ message: `Transaction item ${i}`, action: '', date: '', id: i });
    // }
    // await wrapper.setProps({ messages: testData });
    // expect(wrapper.findAll('.toast-message')).toHaveLength(totalNotifications + 2);
  });

  it('Should load 6 notifications and remove 1, leaving 5', async () => {
    const testData = [];
    const totalNotifications = 6;
    for (let i = 0; i < totalNotifications; i++) {
      testData.push({ message: `Transaction item ${i}`, action: '', date: '', id: i });
    }
    const wrapper = mount(Toast, {
      propsData: { messages: testData },
    });
    console.log('messages1:', wrapper.props().messages);

    await wrapper.find('[data-test=dismiss-toast-1]').trigger('click');

    console.log('messages2:', wrapper.props().messages.length);

    // expect(wrapper.findAll('.toast-message')).toHaveLength(totalNotifications - 1);
  });

  // it('Should load 6 notifications and add 1, leaving 7', async () => {})

  // it('Should open messages, then collapse', async () => {})

  // it('Should clear all messages', async () => {})
});
