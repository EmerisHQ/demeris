<template>
  <div @mouseenter="toggleToolTip('show')" @mouseleave="toggleToolTip('hide')" @click="void 0">
    <!-- Basic button implementation. At minimum primary/secondary types, busy and disabled states, can be a link,router_link or trigger a custom clickHandler //-->
    <button
      :class="[
        `button-${variant}`,
        { 'text-0 leading-5 rounded-xl': size === 'md' },
        { 'button-sm -text-1 leading-4 rounded-lg': size === 'sm' },
        { 'flex items-center justify-center': !name },
        { 'h-12': variant !== 'link' && size === 'md' },
        { 'h-9': variant !== 'link' && size === 'sm' },
        { 'w-12': !name && variant !== 'link' && size === 'md' },
        { 'w-9': !name && variant !== 'link' && size === 'sm' },
        { 'py-3.5 px-8': name && variant !== 'link' && size === 'md' },
        { 'py-2.5 px-5': name && variant !== 'link' && size === 'sm' },
        { 'w-full': fullWidth },
        {
          'bg-surface shadow-button focus-visible:ring-2 focus:ring-tertiary focus:ring-opacity-50': variant !== 'link',
        },
        { 'theme-inverse dark:theme-inverse': variant === 'primary' },
        { inline: variant === 'link' },
        { 'bg-brand-to-r': status === 'loading' && variant === 'primary' },
        { 'loading flex justify-center items-center pointer-events-none cursor-default': status === 'loading' },
        disabled ? 'text-inactive pointer-events-none cursor-default' : 'text-text cursor-pointer',
      ]"
      :disabled="disabled"
      class="button font-medium border-none focus:outline-none transition cursor-pointer select-none"
      @click="clickFunction?.($event), emit('click', $event)"
    >
      <div v-if="status === 'loading'" class="spinner">
        <Spinner :size="1" :color="'black'" :variant="'circle'" />
      </div>

      <span v-else-if="name" class="inline-flex gap-x-3 items-center"
        ><slot /><span>{{ name }}</span></span
      >

      <span v-else><slot /></span>
    </button>
    <tippy ref="buttonTooltipRef" class="button-tooltip" placement="bottom" :max-width="240">
      <template #content>{{ tooltipText }} </template>
    </tippy>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

import Spinner from '@/components/ui/Spinner.vue';
export default defineComponent({
  name: 'Button',
  components: {
    Spinner,
  },
  props: {
    name: { type: String, required: false },
    variant: { type: String, required: false, default: 'primary' }, // 'secondary' | 'link'
    size: { type: String, required: false, default: 'md' }, // 'sm'
    fullWidth: { type: Boolean, required: false, default: true },
    status: { type: String, required: false, default: 'active' }, // 'loading'
    clickFunction: { type: Function, required: false, default: null },
    tooltipText: { type: String, required: false, default: '' },
    isOutline: { type: Boolean, required: false, default: false },
    disabled: { type: Boolean, default: false },
  },
  emits: ['click'],
  setup(props, { emit }) {
    const buttonTooltipRef = ref(null);
    function toggleToolTip(type) {
      if (props.tooltipText) {
        if (type === 'show') {
          buttonTooltipRef.value.show();
        } else {
          buttonTooltipRef.value.hide();
        }
      }
    }

    return { buttonTooltipRef, toggleToolTip, emit };
  },
});
</script>
<style lang="scss" scoped>
.button-primary,
.button-secondary {
  &:hover:not(:active),
  &:focus:not(:active) {
    --tw-shadow: 4px 11px 35px -4px rgba(0, 0, 0, 0.12);
    transform: translateY(-1px);
  }
}

.button:active {
  opacity: 0.7;
  transform: none;
  transition-duration: 0s;
}

.button-link {
  &,
  > span,
  .spinner {
    position: relative;
  }

  &:before {
    content: '';
    position: absolute;
    height: 3rem;
    top: 50%;
    margin-top: -1.5rem;
    left: -1rem;
    right: -1rem;
    z-index: 0;
    border-radius: 0.6125rem;
    background: var(--fg);
    opacity: 0;
  }

  &.button-sm:before {
    height: 2.25rem;
    margin-top: -1.125rem;
    border-radius: 0.5rem;
  }

  &:focus-visible:before {
    opacity: 1;
    @apply ring-2;
    @apply ring-tertiary;
    @apply ring-opacity-50;
  }

  &:disabled:before,
  &.loading:before {
    opacity: 0;
  }
}

.button-tooltip {
  display: block;
  height: 0;
}
</style>
