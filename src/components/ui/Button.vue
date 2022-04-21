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
        { 'button-none': size === 'none' },
        alignTextStyle,
        { 'text-0 leading-5 rounded-xl': size === 'md' },
        { 'button-sm -text-1 leading-4 rounded-lg': size === 'sm' },
        { 'h-12': variant !== 'link' && size === 'md' },
        { 'h-9': variant !== 'link' && size === 'sm' },
        { 'w-12': !name && variant !== 'link' && size === 'md' && !fullWidth },
        { 'w-9': !name && variant !== 'link' && size === 'sm' && !fullWidth },
        { 'py-3.5 px-8': name && variant !== 'link' && size === 'md' },
        { 'py-2.5 px-5': name && variant !== 'link' && size === 'sm' },
        { 'w-full': fullWidth },
        { '!shadow-none': !shadow },
        { '!rounded-full': rounded }, // Was not working at all (sizes were overriding the rounded property)
        {
          'bg-surface shadow-button transform focus-visible:ring-2 focus:ring-tertiary focus:ring-opacity-50':
            variant !== 'link',
        },
        {
          'focus:-translate-y-px hover:-translate-y-px': animate,
        },
        { 'theme-inverse dark:theme-inverse text-text': variant === 'primary' },
        { 'relative inline': variant === 'link' },
        { 'bg-brand-to-r': status === 'loading' && variant === 'primary' },
        { 'loading pointer-events-none cursor-default': status === 'loading' },
        disabled ? 'text-inactive pointer-events-none cursor-default' : 'cursor-pointer',
      ]"
      :disabled="disabled"
      class="button relative font-medium border-none focus:outline-none active:opacity-70 active:transform-none transition cursor-pointer select-none text-ellipsis whitespace-nowrap outline-offset-4"
      @click="clickFunction?.($event), emit('click', $event)"
    >
      <div v-show="status === 'loading'" class="spinner absolute inset-0 flex items-center justify-center">
        <Spinner :size="2.5" :variant="variant === 'link' ? 'solid' : 'gold'" style="transform: scale(0.6)" />
      </div>

      <span v-if="name" class="inline-flex gap-x-2 items-center" :class="textClasses">
        <slot />
        {{ name }}
        <slot name="right" />
      </span>

      <span v-else :class="textClasses"><slot /></span>
    </button>
    <tippy ref="buttonTooltipRef" class="h-0 block" placement="bottom" :max-width="240">
      <template #content>{{ tooltipText }} </template>
    </tippy>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

import Spinner from '@/components/ui/Spinner.vue';
export default defineComponent({
  name: 'Button',
  components: {
    Spinner,
  },
  props: {
    name: { type: String, required: false, default: null },
    alignText: { type: String, required: false, default: 'center' },
    variant: { type: String, required: false, default: 'primary' }, // 'secondary' | 'link'
    size: { type: String, required: false, default: 'md' }, // 'sm'
    fullWidth: { type: Boolean, required: false, default: true },
    rounded: { type: Boolean, required: false },
    capitalize: { type: Boolean, required: false },
    shadow: { type: Boolean, required: false, default: true },
    status: { type: String, required: false, default: 'active' }, // 'loading'
    clickFunction: { type: Function, required: false, default: null },
    tooltipText: { type: String, required: false, default: '' },
    isOutline: { type: Boolean, required: false, default: false },
    disabled: { type: Boolean, default: false },
    animate: { type: Boolean, default: true },
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

    const alignTextStyle = computed(() => {
      if (!props.name && !props.alignText) return 'flex items-center justify-center';
      if (props.alignText === 'center') return 'flex items-center justify-center';
      if (props.alignText === 'left') return 'flex items-center justify-start';
      if (props.alignText === 'right') return 'flex items-center justify-end';
      return '';
    });

    const textClasses = computed(() => {
      return [
        { invisible: props.status === 'loading' },
        { relative: props.variant === 'link' },
        { capitalize: props.capitalize },
      ];
    });

    return { alignTextStyle, textClasses, buttonTooltipRef, toggleToolTip, emit };
  },
});
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
  &:not(.button-none) {
    min-width: 3rem;
  }

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

.light .button:not(.loading):disabled {
  background: rgba(0, 0, 0, 0.33);
  @apply text-text shadow-none;
}

.dark .button:not(.loading):disabled {
  background: rgba(255, 255, 255, 0.44);
  @apply text-text shadow-none;
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
