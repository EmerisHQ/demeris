<template>
  <div ref="focusWindow" data-test="mainComponent">
    <tippy
      ref="tippyInstance"
      :placement="placement"
      :trigger="trigger"
      :delay="delay"
      :interactive="interactive"
      :arrow="arrow"
      :offset="offset"
    >
      <Button
        :full-width="false"
        variant="link"
        class="text-muted hover:text-text w-12 px-2"
        rounded
        data-test="openMenuButton"
      >
        <Icon v-if="icon" data-test="openMenuButtonIcon" :name="icon" :icon-size="iconSize" class="mt-2" />
        <span v-if="label" data-test="openMenuButtonLabel">{{ label }}</span>
      </Button>
      <template #content>
        <slot></slot>
      </template>
    </tippy>
  </div>
</template>

<script setup lang="ts">
import { useFocusWithin } from '@vueuse/core';
import { ref, toRefs, watch } from 'vue';

import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
interface Props {
  placement?: 'right-start' | 'left-start';
  trigger?: string;
  delay?: number;
  interactive?: boolean;
  icon?: string;
  iconSize?: number;
  label?: string;
  arrow?: boolean;
  offset?: number[];
}
const props = withDefaults(defineProps<Props>(), {
  placement: 'right-start',
  trigger: 'click',
  delay: 0,
  icon: '',
  iconSize: 1.5,
  label: '',
  interactive: true,
  arrow: false,
  offset: () => [0, 0],
});
const { placement, trigger, delay, icon, iconSize, interactive, label, arrow, offset } = toRefs(props);
const tippyInstance = ref();
const focusWindow = ref();
const { focused } = useFocusWithin(focusWindow);
watch(focused, (focused) => {
  window.requestAnimationFrame(() => {
    const isFocusedElementInside = focusWindow.value.contains(document.activeElement);
    if (!focused && !isFocusedElementInside) {
      tippyInstance.value.tippy.hide();
    }
  });
});
</script>
