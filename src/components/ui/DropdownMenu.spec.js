// npx jest -- src/components/ui/DropdownMenu.spec.js
import { mount, shallowMount } from '@vue/test-utils';

import DropdownMenu from './DropdownMenu.vue';
import DropdownMenuItem from './DropdownMenuItem.vue';

describe('Notifications', () => {
  it('Mounts with button and only icon', async () => {
    const wrapper = shallowMount(DropdownMenu, {
      props: {
        icon: 'ThreeDotsIcon',
        placement: 'right-star',
      },
    });
    expect(wrapper.find('[data-test=openMenuButton]').exists()).toBe(true);
    expect(wrapper.find('[data-test=openMenuButtonIcon]').exists()).toBe(true);
    expect(wrapper.find('[data-test=openMenuButtonLabel]').exists()).toBe(false);
  });

  it('Mounts with button and only text', async () => {
    const wrapper = shallowMount(DropdownMenu, {
      props: {
        label: 'buttonLabel',
        placement: 'right-star',
      },
    });
    expect(wrapper.find('[data-test=openMenuButton]').exists()).toBe(true);
    expect(wrapper.find('[data-test=openMenuButtonIcon]').exists()).toBe(false);
    expect(wrapper.find('[data-test=openMenuButtonLabel]').exists()).toBe(true);
    expect(wrapper.find('[data-test=openMenuButtonLabel]').html()).toContain('buttonLabel');
  });

  it('Mounts with content in slot', async () => {
    const DropdownMenuItem1 = mount(DropdownMenuItem, {
      slots: {
        default: 'Main Content',
      },
    });
    const wrapper = mount(DropdownMenu, {
      props: {
        label: 'buttonLabel',
        placement: 'right-star',
      },
      slots: {
        default: DropdownMenuItem1,
      },
    });
    expect(DropdownMenuItem1.find('[data-test=menuItemButton]').html()).toContain('Main Content');
    await wrapper.find('[data-test="openMenuButton"]').trigger('click');
    setTimeout(() => {
      const menu = wrapper.get('[data-test=mainComponent]');
      expect(menu.html()).toContain('Main Content');
    }, 100);
  });

  it('Mounts with 3 links in slot', async () => {
    const DropdownMenuItem1 = mount(DropdownMenuItem, {
      slots: {
        default: 'Main Content 1',
      },
    });
    const DropdownMenuItem2 = mount(DropdownMenuItem, {
      slots: {
        default: 'Main Content 2',
      },
    });
    const DropdownMenuItem3 = mount(DropdownMenuItem, {
      slots: {
        default: 'Main Content 3',
      },
    });
    const wrapper = mount(DropdownMenu, {
      props: {
        label: 'buttonLabel',
        placement: 'right-star',
      },
      slots: {
        default: [DropdownMenuItem1, DropdownMenuItem2, DropdownMenuItem3],
      },
    });
    expect(DropdownMenuItem1.find('[data-test=menuItemButton]').html()).toContain('Main Content');
    await wrapper.find('[data-test="openMenuButton"]').trigger('click');
    setTimeout(() => {
      const menu = wrapper.get('[data-test=mainComponent]');
      expect(menu.html()).toContain('Main Content 1');
      expect(menu.html()).toContain('Main Content 2');
      expect(menu.html()).toContain('Main Content 3');
    }, 100);
  });
});
