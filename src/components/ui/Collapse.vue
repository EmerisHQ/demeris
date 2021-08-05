<script setup lang="ts">
import { nextTick, reactive, watch } from 'vue';

import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  labelOpen: {
    type: String,
    default: 'Show',
  },
  labelHide: {
    type: String,
    default: 'Hide',
  },
  showLabel: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['update:isOpen']);

const state = reactive({
  height: '0',
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

watch(props, () => {
  state.isOpen = props.isOpen;
});
</script>

<template>
  <div class="collapse flex flex-col items-stretch gap-y-4">
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
