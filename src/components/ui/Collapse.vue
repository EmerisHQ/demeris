<script setup lang="ts">
import { nextTick, reactive, watch } from 'vue';

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
  <div class="collapse" :class="`collapse--${state.isOpen ? 'open' : 'closed'}`">
    <button class="collapse__button" @click="toggle">
      <span v-if="showLabel" class="collapse__button__label">{{ state.isOpen ? labelHide : labelOpen }}</span>
      <Icon :name="'CaretUpIcon'" :icon-size="1.5" class="collapse__button__icon" />
    </button>

    <Transition name="collapse__transition" mode="out-in" @enter="enter" @afterEnter="afterEnter" @leave="leave">
      <div v-show="state.isOpen" class="collapse__content" :style="{ height: state.height }">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.collapse {
  display: flex;
  flex-direction: column;

  &__content {
    transition-property: height;
    transition-duration: 300ms;
    transition-timing-function: cubic-bezier(0.25, 0.8, 0.5, 1);
    width: 100%;
  }

  &__transition-enter-active,
  &__transition-leave-active {
    overflow: hidden;
  }

  &__transition-enter,
  &__transition-leave-to {
    height: 0;
  }

  &--closed &__button {
    &__icon {
      transform: rotate(180deg);
    }
  }

  &__button {
    display: flex;
    align-items: center;
    font-weight: 600;
    padding: 1.6rem;

    &__icon {
      margin-left: 0.4rem;
    }
  }
}
</style>
