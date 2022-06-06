<template>
  <div class="collapse flex flex-col items-stretch gap-y-4">
    <slot name="handler" :is-open="state.isOpen" :on-click="toggle">
      <Button variant="link" :name="showLabel ? (state.isOpen ? labelHide : labelOpen) : null" :click-function="toggle">
        <template #right>
          <Icon
            :name="'CaretDownIcon'"
            :icon-size="1"
            class="transform transition-transform -ml-2"
            :class="{ 'rotate-180': state.isOpen }"
          />
        </template>
      </Button>
    </slot>

    <Transition name="collapse__transition" mode="out-in" @enter="enter" @afterEnter="afterEnter" @leave="leave">
      <div
        v-show="state.isOpen"
        class="collapse__content w-full duration-300 ease-in-out"
        :style="{ height: state.height }"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import { nextTick, reactive } from 'vue';

import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';

interface Props {
  isOpen?: boolean;
  labelOpen?: string;
  labelHide?: string;
  showLabel?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  labelOpen: 'Show',
  labelHide: 'Hide',
  showLabel: true,
});

const emit = defineEmits<{
  (e: 'update:isOpen', isOpen: boolean): void;
}>();

const state = reactive({
  height: 'auto',
  isOpen: props.isOpen,
});

const toggle = () => {
  state.isOpen = !state.isOpen;
  emit('update:isOpen', state.isOpen);
};

const enter = (el: Element) => {
  const scrollHeight = `${el.scrollHeight}px`;
  state.height = '0';
  nextTick(() => (state.height = scrollHeight || 'auto'));
};

const afterEnter = () => {
  setTimeout(() => (state.height = 'auto'), 5);
};

const leave = (el: Element) => {
  state.height = getComputedStyle(el).height;
  setTimeout(() => (state.height = '0'), 100);
};
</script>
<style lang="scss" scoped>
.collapse {
  &__content {
    transition-property: height;
  }

  &__transition-enter-active,
  &__transition-leave-active {
    overflow: hidden;
  }

  &__transition-enter,
  &__transition-leave-to {
    height: 0;
  }
}
</style>
