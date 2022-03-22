/**
 * @vitest-environment jsdom
 */
// npx vitest src/components/ui/DropdownMenu.spec.ts
import { mount } from '@vue/test-utils';
import { config } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import { Tippy } from 'vue-tippy';

import DropdownMenu from './DropdownMenu.vue';
import DropdownMenuItem from './DropdownMenuItem.vue';

config.global.components = {
  tippy: Tippy,
};
describe('Notifications', () => {
  test('Mounts with button and only icon', async () => {
    const wrapper = mount(DropdownMenu, {
      props: {
        icon: 'ThreeDotsIcon',
        placement: 'right-start',
      },
    });
    expect(wrapper.find('[data-test=openMenuButton]').exists()).toBe(true);
    expect(wrapper.find('[data-test=openMenuButtonIcon]').exists()).toBe(true);
    expect(wrapper.find('[data-test=openMenuButtonLabel]').exists()).toBe(false);
  });

  test('Mounts with button and only text', async () => {
    const wrapper = mount(DropdownMenu, {
      props: {
        label: 'buttonLabel2',
        placement: 'right-start',
      },
    });
    expect(wrapper.find('[data-test=openMenuButton]').exists()).toBe(true);
    expect(wrapper.find('[data-test=openMenuButtonIcon]').exists()).toBe(false);
    expect(wrapper.find('[data-test=openMenuButtonLabel]').exists()).toBe(true);
    expect(wrapper.find('[data-test=openMenuButtonLabel]').html()).toContain('buttonLabel2');
  });

  test('Mounts with content in slot', async () => {
    const DropdownMenuItem1 = mount(DropdownMenuItem, {
      slots: {
        default: 'Main Content xxx',
      },
    });
    const wrapper = mount(DropdownMenu, {
      props: {
        label: 'buttonLabel',
        placement: 'right-start',
      },
      slots: {
        default: DropdownMenuItem1,
      },
    });
    expect(DropdownMenuItem1.find('[data-test=menuItemButton]').html()).toContain('Main Content xxx');
    await wrapper.find('[data-test="openMenuButton"]').trigger('click');
    window.requestAnimationFrame(async () => {
      window.requestAnimationFrame(async () => {
        const menu = await wrapper.get('[data-test=mainComponent]');
        expect(menu.html()).toContain('Main Content xxx');
      });
    });
  });

  test('Mounts with 3 links in slot', async () => {
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
        placement: 'right-start',
      },
      slots: {
        default: [DropdownMenuItem1, DropdownMenuItem2, DropdownMenuItem3],
      },
    });
    expect(DropdownMenuItem1.find('[data-test=menuItemButton]').html()).toContain('Main Content 1');
    await wrapper.find('[data-test="openMenuButton"]').trigger('click');
    window.requestAnimationFrame(async () => {
      window.requestAnimationFrame(async () => {
        const menu = await wrapper.get('[data-test=mainComponent]');
        expect(menu.html()).toContain('Main Content 1');
        expect(menu.html()).toContain('Main Content 2');
        expect(menu.html()).toContain('Main Content 3');
      });
    });
  });
});
