<template>
  <label class="checkbox inline-flex items-start p-4 rounded-xl border border-solid border-border cursor-pointer">
    <input
      v-model="model"
      class="
        checkbox__control
        appearance-none
        border-2 border-solid border-inactive
        flex-shrink-0
        w-6
        h-6
        rounded-md
        transition
        select-none
      "
      type="checkbox"
    />
    <span v-if="label" class="checkbox__label ml-4 text-0 leading-copy">{{ label }}</span>
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
.checkbox__control:checked {
  border: none;
  background: var(--primary);
  background: center / contain no-repeat
      url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='black' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E"),
    center / cover no-repeat url('/assets/images/gradient-primary.jpg');
}
</style>
