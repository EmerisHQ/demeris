<template>
  <div ref="focusWindow">
    <tippy
      ref="tippyInstance"
      :placement="placement"
      :trigger="trigger"
      :delay="delay"
      :interactive="interactive"
      :arrow="arrow"
      :offset="offset"
    >
      <Button :full-width="false" variant="link" class="text-muted hover:text-text w-12" rounded>
        <Icon name="ThreeDotsIcon" :icon-size="1.5" class="mt-2" />
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
  arrow?: boolean;
  offset?: number[];
}
const props = withDefaults(defineProps<Props>(), {
  placement: 'right-start',
  trigger: 'click',
  delay: 0,
  interactive: true,
  arrow: false,
  offset: () => [0, 0],
});
const { placement, trigger, delay, interactive, arrow, offset } = toRefs(props);
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
