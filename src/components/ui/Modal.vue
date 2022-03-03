<template>
  <div
    v-if="open"
    class="inset-0 z-40 overflow-y-auto flex justify-center text-0"
    :class="[
      {
        'items-end': variant === 'bottom',
        'items-center': variant === 'center' || variant === 'dialog',
        'items-stretch': variant === 'full',
      },
      fullscreen ? 'fixed' : 'absolute',
    ]"
  >
    <div
      v-show="variant !== 'takeover'"
      class="inset-0 bg-inactive dark:theme-inverse dark:bg-muted"
      :class="fullscreen ? 'fixed' : 'absolute'"
      @click="onOverlayClick"
    />
    <div
      class="relative z-40 bg-surface"
      :class="[
        bodyClass,
        variant === 'center' && maxWidthClass,
        {
          'w-full': variant !== 'dialog',
          'min-w-full min-h-full': variant === 'full',
          'mx-auto overflow-hidden sm:mx-6 sm:my-6 min-h-full sm:min-h-0 sm:rounded-2xl shadow-card':
            variant === 'center',
          'max-w-xs mx-5 rounded-2xl shadow-card': variant === 'dialog',
          'rounded-t-2xl shadow-dropdown': variant === 'bottom',
        },
      ]"
      :style="bodyStyle"
    >
      <header v-if="$slots.header || showCloseButton" class="relative z-10 flex items-center justify-between p-8">
        <slot name="header"></slot>

        <Button v-if="showCloseButton" class="modal__close ml-auto" rounded variant="secondary" @click="emitClose">
          <Icon name="CloseIcon" :icon-size="1.5" />
        </Button>
      </header>

      <section
        class="modal__content"
        :class="[
          contentClass,
          {
            'pt-6 px-5 sm:pt-8 sm:px-8': variant === 'dialog',
            'pb-6 sm:pb-8': variant === 'dialog' && !$slots.buttons,
          },
        ]"
      >
        <slot />
      </section>

      <footer
        v-if="$slots.buttons"
        class="modal__footer relative mt-6 border-t border-border divide-x divide-border flex justify-center"
        :class="footerClass"
      >
        <slot name="buttons"></slot>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, CSSProperties, defineComponent, PropType } from 'vue'

import Button from './Button.vue'
import Icon from './Icon.vue'

type ModalVariant = 'dialog' | 'center' | 'takeover' | 'bottom'

export default defineComponent({
  name: 'Modal',

  components: { Button, Icon },

  props: {
    variant: {
      type: String as PropType<ModalVariant>,
      default: 'dialog',
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
    open: {
      type: Boolean,
      default: true,
    },
    showCloseButton: {
      type: Boolean,
      default: false,
    },
    height: {
      type: [String, Number],
      default: undefined,
    },
    maxWidthClass: {
      type: String,
      default: 'max-w-4xl',
    },
    bodyClass: {
      type: [String, Array, Object],
      default: undefined,
    },
    contentClass: {
      type: [String, Array, Object],
      default: undefined,
    },
    footerClass: {
      type: [String, Array, Object],
      default: undefined,
    },
    closeOnOverlayClick: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['close'],

  setup(props, { emit }) {
    const bodyStyle = computed(() => {
      const styles: CSSProperties = {}

      if (props.height !== undefined) {
        styles.height = props.height as string
      }

      return styles
    })

    const emitClose = () => {
      emit('close')
    }

    const onOverlayClick = () => {
      if (props.closeOnOverlayClick) {
        emitClose()
      }
    }

    return { bodyStyle, emitClose, onOverlayClick }
  },
})
</script>

<style lang="scss" scoped>
.modal {
  &__close {
    --tw-shadow: none;
    --tw-translate-y: 0;
  }

  &__content {
    min-height: inherit;
  }

  &__footer > div {
    flex: 1;
  }
}
</style>
