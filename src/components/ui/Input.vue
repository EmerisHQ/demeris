<template>
  <div class="input">
    <div class="input__wrapper">
      <span v-if="hasStartSlot" class="input__start">
        <slot name="start" />
      </span>

      <input v-model="model" class="input__field" v-bind="$attrs" />

      <span v-if="hasEndSlot" class="input__end">
        <slot name="end" />
      </span>
    </div>

    <tippy v-if="hint" class="input__hint">
      <span class="input__hint__icon"><HintIcon /></span>

      <template #content>
        {{ hint }}
      </template>
    </tippy>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import HintIcon from '@/components/common/Icons/HintIcon.vue';

export default defineComponent({
  name: 'Input',

  components: {
    HintIcon,
  },

  inheritAttrs: false,

  props: {
    modelValue: {
      type: String,
      default: '',
    },
    hint: {
      type: String,
      default: undefined,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit, slots }) {
    const model = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
    });

    const hasStartSlot = computed(() => !!slots.start);
    const hasEndSlot = computed(() => !!slots.end);

    return { model, hasStartSlot, hasEndSlot };
  },
});
</script>

<style lang="scss" scoped>
.input {
  display: flex;
  align-items: center;
  font-size: 1.6rem;
  position: relative;

  &__wrapper {
    flex: 1 1 0%;
    width: 100%;
    border-radius: 1rem;
    padding: 1.2rem 1.4rem;
    background-color: rgba(0, 0, 0, 0.03);
    display: flex;
    align-items: center;
    color: rgba(0, 0, 0, 0.33);
    line-height: 2.1rem;
    position: relative;
  }

  &__start {
    padding-right: 1.2rem;
  }

  &__end {
    padding-left: 1.2rem;
  }

  &__field {
    width: 100%;
    appearance: none;
    border: none;
    background: transparent;
    color: rgba(0, 0, 0, 0.66);
    flex: 1 1 0%;

    &::placeholder {
      color: rgba(0, 0, 0, 0.33);
    }

    &:focus {
      border: 0;
      outline: none;
    }
  }

  &__hint {
    margin-left: 1.2rem;

    &__icon {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
}
</style>
