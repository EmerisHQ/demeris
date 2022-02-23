// npx jest -- src/components/ui/Notifications.spec.js
import { shallowMount } from '@vue/test-utils';

import Notifications from './Notifications.vue';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('Notifications', () => {
  it('Mounts with no messages displayed', async () => {
    const wrapper = shallowMount(Notifications, {
      props: {
        button1Label: 'Undo',
        button2Label: 'Details',
        showLessLabel: 'Show Less',
        clearAllLabel: 'Clear All',
      },
    });
    expect(wrapper.find('[data-test=messages-container]').exists()).toBe(false);
  });

  it('Mounts with 6 messages pre-displayed', async () => {
    const totalNotifications = 6;
    const testData = [...Array(totalNotifications)].map((_, i) => ({ message: `Transaction item ${i}`, id: i }));
    const wrapper = shallowMount(Notifications, {
      props: {
        messages: testData,
      },
    });
    expect(wrapper.findAll('[data-test="single-notification-message"]')).toHaveLength(totalNotifications);
  });

  it('Mounts with 6 notifications and displays 5 after updating props', async () => {
    const totalNotifications = 6;
    const testData = [...Array(totalNotifications)].map((_, i) => ({ message: `Transaction item ${i}`, id: i }));
    const wrapper = shallowMount(Notifications, {
      props: {
        messages: testData,
        button1Label: 'Undo',
        button2Label: 'Details',
        showLessLabel: 'Show Less',
        clearAllLabel: 'Clear All',
      },
    });
    expect(wrapper.findAll('[data-test="single-notification-message"]')).toHaveLength(totalNotifications);
    await wrapper.setProps({ messages: [...testData.slice(1)] });
    expect(wrapper.findAll('[data-test="single-notification-message"]')).toHaveLength(totalNotifications - 1);
  });

  it('Mounts with 6 notifications and displays 5 after updating props', async () => {
    const totalNotifications = 1;
    const testData = [...Array(totalNotifications)].map((_, i) => ({ message: `Transaction item ${i}`, id: i }));
    const wrapper = shallowMount(Notifications, {
      props: {
        messages: testData,
        button1Label: 'Undo',
        button2Label: 'Details',
        showLessLabel: 'Show Less',
        clearAllLabel: 'Clear All',
      },
    });
    expect(wrapper.findAll('[data-test="single-notification-message"]')).toHaveLength(totalNotifications);
    await wrapper.setProps({ messages: [...testData.slice(1)] });
    expect(wrapper.findAll('[data-test="single-notification-message"]')).toHaveLength(totalNotifications - 1);
  });

  it('Updates label props', async () => {
    const totalNotifications = 1;
    const testData = [...Array(totalNotifications)].map((_, i) => ({ message: `Transaction item ${i}`, id: i }));
    const wrapper = shallowMount(Notifications, {
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
    await wrapper.setProps({ button1Label: 'Undo2', button2Label: 'Details2' });
    expect(wrapper.html()).toContain('Undo2');
    expect(wrapper.html()).toContain('Details2');
  });

  it.only('Opens with 0 notifications, loads 6 then dismisses all.', async () => {
    const totalNotifications = 6;
    const testData = [...Array(totalNotifications)].map((_, i) => ({ message: `Transaction item ${i}`, id: i }));
    const wrapper = shallowMount(Notifications, {
      props: {
        messages: [],
        button1Label: 'Undo',
        button2Label: 'Details',
        showLessLabel: 'Show Less',
        clearAllLabel: 'Clear All',
      },
    });

    expect(wrapper.findAll('[data-test="single-notification-message"]')).toHaveLength(0);
    expect(wrapper.find('[data-test="clear-all-notifications-footer"]').exists()).toBe(false);

    await wrapper.setProps({ messages: testData });

    expect(wrapper.findAll('[data-test="single-notification-message"]')).toHaveLength(totalNotifications);

    await wrapper.find('[data-test="notification-0"]').trigger('click');

    expect(wrapper.find('[data-test="clear-all-notifications-footer"]').exists()).toBe(true);

    await wrapper.find('[data-test="clear-all-notifications-footer"]').trigger('click');

    // failing test
    expect(wrapper.findAll('[data-test="single-notification-message"]').exists()).toBe(false);
  });

  // check mouse over button
  // expect(wrapper.find('[data-test="clear-all-notifications-button-0"]').exists()).toBe(false)
  //   await wrapper.find('[data-test="notification-0"]').trigger('mouseover')
  //   expect(wrapper.find('[data-test="clear-all-notifications-button-0"]').exists()).toBe(true)
});
