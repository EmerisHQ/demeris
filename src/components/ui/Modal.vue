<template>
  <div v-if="open" class="modal" :class="[`modal--${variant}`]">
    <div class="modal__overlay" @click="onOverlayClick" />
    <div class="modal__body elevation-card" :class="bodyClass" :style="bodyStyle">
      <div class="modal__header">
        <slot name="header">
          <span />
        </slot>

        <button v-if="showCloseButton" class="modal__close" @click="emitClose">
          <Icon name="CloseIcon" :icon-size="1.4" />
        </button>
      </div>

      <div class="modal__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, CSSProperties, defineComponent, PropType } from 'vue';

import Icon from './Icon.vue';

type ModalVariant = 'dialog' | 'full' | 'fullscreen' | 'bottom';

export default defineComponent({
  name: 'Modal',

  components: { Icon },

  props: {
    variant: {
      type: String as PropType<ModalVariant>,
      default: 'dialog',
    },
    open: {
      type: Boolean,
      default: true,
    },
    showCloseButton: {
      type: Boolean,
      default: true,
    },
    height: {
      type: [String, Number],
      default: undefined,
    },
    width: {
      type: [String, Number],
      default: undefined,
    },
    bodyClass: {
      type: String,
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
      const styles: CSSProperties = {};

      if (props.height !== undefined) {
        styles.height = props.height as string;
      }

      if (props.width !== undefined) {
        styles.width = props.width as string;
      }

      return styles;
    });

    const emitClose = () => {
      emit('close');
    };

    const onOverlayClick = () => {
      if (props.closeOnOverlayClick) {
        emitClose();
      }
    };

    return { bodyStyle, emitClose, onOverlayClick };
  },
});
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: 40;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  margin: 0 !important;

  &__overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
  }

  &__header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.6rem;
  }

  &__content {
    min-height: inherit;
  }

  &__body {
    background: var(--bg);
    border-radius: 1.6rem;
    padding: 2.4rem;
    width: 100%;
    z-index: 40;
  }

  &--full {
    position: absolute;
  }

  &--full &__overlay {
    display: none;
  }

  &--full &__body {
    width: 100%;
    height: 100%;
  }

  &--bottom {
    position: absolute;
    align-items: flex-end;
  }

  &--bottom &__overlay {
    position: absolute;
  }

  &--bottom &__body {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  &--dialog &__body {
    max-width: 80%;
    width: auto;
  }

  &--fullscreen &__body {
    border-radius: 0;
    min-width: 100%;
    min-height: 100%;
  }
}
</style>
