<template>
  <Modal
    :open="open"
    variant="dialog"
    width="32rem"
    class="confirmation"
    :class="{ 'confirmation--single': !showNoButton }"
    @close="emitClose"
  >
    <div class="confirmation__wrapper">
      <h2 class="confirmation__title s-2">{{ title }}</h2>

      <div class="confirmation__description">
        <slot>
          <p>{{ description }}</p>
        </slot>
      </div>

      <div class="confirmation__controls">
        <button v-if="showNoButton" class="confirmation__controls__button no-button" @click="emitNo">
          {{ noText }}
        </button>

        <button class="confirmation__controls__button yes-button" @click="emitYes">
          {{ yesText }}
        </button>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Modal from '@/components/ui/Modal.vue';

export default defineComponent({
  name: 'Confirmation',

  components: {
    Modal,
  },

  props: {
    open: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    noText: {
      type: String,
      default: 'No',
    },
    yesText: {
      type: String,
      default: 'Yes',
    },
    showNoButton: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['no', 'yes', 'close'],

  setup(_, { emit }) {
    const emitNo = () => emit('no');
    const emitYes = () => emit('yes');
    const emitClose = () => emit('close');

    return { emitNo, emitYes, emitClose };
  },
});
</script>

<style lang="scss" scoped>
.confirmation {
  &--single {
    .yes-button {
      border: transparent;
      background: var(--text);
      color: var(--bg);
    }
  }

  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  &__description {
    text-align: center;
    margin-top: 2.4rem;
    line-height: 1.5;
  }

  &__controls {
    display: flex;
    align-items: stretch;
    margin-top: 6rem;
    width: 100%;

    &__button {
      flex: 1 1 0%;
      border-radius: 0.8rem;
      padding: 1.6rem 2rem;
      border: 1px solid #e6e6e6;

      & + & {
        margin-left: 2.4rem;
      }
    }
  }
}
</style>
