// npx jest -- src/components/ui/Notifications.spec.js
import { mount } from '@vue/test-utils';

import Notifications from './Notifications.vue';

describe('Notifications', () => {
  // it('Mounts Successfully and Initial state has no notifications', () => {
  //   const wrapper = mount(Toast);
  //   expect(wrapper.exists()).toBe(true);
  //   expect(wrapper.find('[data-test=messages-container]').exists()).toBe(false);
  //   expect(wrapper.findAll('.toast-message')).toHaveLength(0);
  // });

  // it('Should display 7 notifications loaded from props', async () => {
  //   const testData = [];
  //   const totalNotifications = 7;
  //   // const additionalNotifications = 2;
  //   for (let i = 0; i < totalNotifications; i++) {
  //     testData.push({ message: `Transaction item ${i}`, action: '', date: '', id: i });
  //   }
  //   const wrapper = mount(Toast, {
  //     propsData: { messages: testData },
  //   });
  //   expect(wrapper.find('[data-test=messages-container]').exists()).toBeTruthy();
  //   expect(wrapper.findAll('[data-test=toast-message]')).toHaveLength(totalNotifications);

  //   // await wrapper.find('[data-test=dismiss-toast-1]').trigger('click');
  //   // expect(wrapper.findAll('.toast-message')).toHaveLength(totalNotifications - 1);

  //   // for (let i = totalNotifications; i < totalNotifications + additionalNotifications; i++) {
  //   //   testData.push({ message: `Transaction item ${i}`, action: '', date: '', id: i });
  //   // }
  //   // await wrapper.setProps({ messages: testData });
  //   // expect(wrapper.findAll('.toast-message')).toHaveLength(totalNotifications + 2);
  // });

  it.only('Updates to props update HTML', async () => {
    // create test messages for notifications
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

    // :messages="testData"
    //       button1-label="Undo"
    //       :dismiss-interval="5000"
    //       button2-label="Details"
    //       show-less-label="Show Less"
    //       clear-all-label="Clear All"
    //       @onButton1Click="($event) => undo($event)"
    //       @onButton2Click="($event) => details($event)"
    //       @on-update="($event) => updateTestData($event)"

    console.log('messages1:', wrapper.props().messages.length);

    expect(wrapper.findAll('[data-test="single-notification-message"]')).toHaveLength(totalNotifications);

    testData.pop();

    await wrapper.setProps({ messages: testData });

    // hack to try to make jest update dom... does not work.
    // await wrapper.vm.$parent.$forceUpdate();
    // await wrapper.vm.$nextTick();

    // debugger

    console.log('messages2:', wrapper.props().messages.length);

    expect(wrapper.findAll('[data-test="single-notification-message"]')).toHaveLength(totalNotifications - 1);
  });

  // it('Should load 6 notifications and add 1, leaving 7', async () => {})

  // it('Should open messages, then collapse', async () => {})

  // it('Should clear all messages', async () => {})
});
