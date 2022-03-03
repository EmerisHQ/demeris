<template>
  <div
    :class="{ 'inline-flex': !fullWidth }"
    @mouseenter="toggleToolTip('show')"
    @mouseleave="toggleToolTip('hide')"
    @click="void 0"
  >
    <!-- Basic button implementation. At minimum primary/secondary/link types, loading and disabled states, can be a link,router_link or trigger a custom clickHandler //-->
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
        { 'rounded-full': rounded },
        {
          'bg-surface shadow-button transform hover:-translate-y-px focus:-translate-y-px focus-visible:ring-2 focus:ring-tertiary focus:ring-opacity-50':
            variant !== 'link',
        },
        { 'theme-inverse dark:theme-inverse text-text': variant === 'primary' },
        { 'relative inline': variant === 'link' },
        { 'bg-brand-to-r': status === 'loading' && variant === 'primary' },
        { 'loading pointer-events-none cursor-default': status === 'loading' },
        disabled ? 'text-inactive pointer-events-none cursor-default' : 'text-current cursor-pointer',
      ]"
      :disabled="disabled"
      class="button relative font-medium border-none focus:outline-none active:opacity-70 active:transform-none transition cursor-pointer select-none overflow-ellipsis whitespace-nowrap"
      @click="clickFunction?.($event), emit('click', $event)"
    >
      <div v-show="status === 'loading'" class="spinner absolute inset-0 flex items-center justify-center">
        <Spinner :size="1" :variant="variant === 'link' ? 'solid' : 'gold'" />
      </div>

      <span
        v-if="name"
        class="inline-flex gap-x-2 items-center"
        :class="[{ invisible: status === 'loading' }, { relative: variant === 'link' }]"
        ><slot /><span>{{ name }}</span
        ><slot name="right"
      /></span>

      <span v-else :class="[{ invisible: status === 'loading' }, { relative: variant === 'link' }]"><slot /></span>
    </button>
    <tippy ref="buttonTooltipRef" class="h-0 block" placement="bottom" :max-width="240">
      <template #content>{{ tooltipText }} </template>
    </tippy>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

import Spinner from '@/components/ui/Spinner.vue'
export default defineComponent({
  name: 'Button',
  components: {
    Spinner,
  },
  props: {
    name: { type: String, required: false, default: null },
    variant: { type: String, required: false, default: 'primary' }, // 'secondary' | 'link'
    size: { type: String, required: false, default: 'md' }, // 'sm'
    fullWidth: { type: Boolean, required: false, default: true },
    rounded: { type: Boolean, required: false },
    status: { type: String, required: false, default: 'active' }, // 'loading'
    clickFunction: { type: Function, required: false, default: null },
    tooltipText: { type: String, required: false, default: '' },
    isOutline: { type: Boolean, required: false, default: false },
    disabled: { type: Boolean, default: false },
  },
  emits: ['click'],
  setup(props, { emit }) {
    const buttonTooltipRef = ref(null)
    function toggleToolTip(type) {
      if (props.tooltipText) {
        if (type === 'show') {
          buttonTooltipRef.value.show()
        } else {
          buttonTooltipRef.value.hide()
        }
      }
    }

    return { buttonTooltipRef, toggleToolTip, emit }
  },
})
</script>
<style lang="scss" scoped>
.button-primary,
.button-secondary {
  &:hover:not(:active),
  &:focus:not(:active) {
    --tw-shadow: 4px 11px 35px -4px rgba(0, 0, 0, 0.12);
  }
}

.button {
  min-width: 3rem;
  &.button-link {
    min-width: 1rem;
  }
}
.button-sm {
  min-width: 2.25rem;
  &.button-link {
    min-width: 0.75rem;
  }
}

.button:active {
  transition-duration: 0s;
}

.button-link {
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
  &.w-full:before {
    left: 0;
    right: 0;
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
</style>
