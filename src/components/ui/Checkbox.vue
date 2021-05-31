<template>
  <label class="checkbox">
    <input v-model="model" class="checkbox__control" type="checkbox" />
    <span v-if="label" class="checkbox__label s-minus">{{ label }}</span>
  </label>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'Checkbox',

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const model = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
    });

    return { model };
  },
});
</script>

<style lang="scss" scoped>
.checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  &__label {
    margin-left: 1.6rem;
  }

  &__control {
    appearance: none;
    user-select: none;
    width: 2rem;
    height: 2rem;
    border-radius: 4px;
    border: 2px solid transparent;
    cursor: pointer;
    transition-property: background, border-color;
    transition-timing-function: linear;
    transition-duration: 100ms;

    &:checked {
      background: var(--text);
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E");
    }

    &:not(:checked) {
      background: var(--fg);
      border-color: var(--inactive);
    }
  }
}
</style>
