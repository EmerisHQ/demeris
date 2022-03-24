<template>
  <label class="checkbox inline-flex items-start p-4 rounded-xl border border-solid border-border cursor-pointer">
    <input
      v-model="model"
      :class="checkboxStyle"
      class="checkbox__control appearance-none border-2 border-solid border-inactive flex-shrink-0 w-6 h-6 rounded-md transition select-none"
      type="checkbox"
    />
    <span v-if="label" class="checkbox__label ml-4 text-0 leading-copy">{{ label }}</span>
  </label>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import useTheme from '@/composables/useTheme';

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
    isGradientOnlyTheme: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const model = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
    });

    const theme = useTheme();

    const checkboxStyle = computed(() => {
      if (props.isGradientOnlyTheme) {
        return 'gradient-theme';
      }
      if (theme.value === 'dark') {
        return 'dark-theme';
      } else if (theme.value === 'light') {
        return 'light-theme';
      }
      return 'gradient-theme';
    });

    return { checkboxStyle, model };
  },
});
</script>

<style lang="scss" scoped>
.checkbox__control {
  border: none;
  background: center / contain no-repeat url('@/assets/svg/checkMarkDark.svg') #000;
}
.checkbox__control:checked {
  border: none;
  background-color: #ff4400;

  // background: var(--primary);
  .light-theme {
    background-color: #ff4400;
    // background: center / contain no-repeat url('@/assets/svg/checkMarkDark.svg') #000;
  }
  .dark-theme {
    background-color: #2b00ff;
    // background: center / contain no-repeat url('@/assets/svg/checkMarkDark.svg') #fff;
  }
  .gradient-theme {
    background-color: #00ff00;
    // center / cover no-repeat url('@/assets/images/gradient-primary.jpg')
  }
}
</style>
