<template>
  <div class="input w-full max-w-md flex items-center">
    <div
      class="input__wrapper relative flex-1 w-full h-12 text-inactive hover:text-muted focus-within:text-muted transition-colors"
    >
      <div
        v-if="hasStartSlot"
        class="input__icon absolute z-20 top-0 left-0 p-4"
        :class="{ 'pointer-events-none': !startSlotClickable }"
      >
        <slot name="start" />
      </div>
      <input
        v-model="model"
        class="relative z-10 h-12 w-full py-2 text-0 font-normal text-text placeholder-inactive hover:placeholder-muted focus:placeholder-inactive bg-fg focus:bg-surface rounded-xl focus:rounded-lg border-none appearance-none"
        :class="[hasStartSlot ? 'pl-10' : 'pl-4', hasEndSlot ? 'pr-10' : 'pr-4']"
        v-bind="$attrs"
        @focus="$emit('focus:value', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur:value', ($event.target as HTMLInputElement).value)"
      />
      <div
        v-if="hasEndSlot"
        class="input__icon absolute z-20 top-0 right-0 p-4"
        :class="{ 'pointer-events-none': !endSlotClickable }"
      >
        <slot name="end" />
      </div>

      <div
        class="focus-border absolute z-0 -inset-0.5 rounded-xl"
        :class="[borderColour ? borderColour : 'bg-gold-circular', forceBorderVisible ? 'visible' : 'invisible']"
      />
    </div>

    <tippy v-if="hint" class="p-3 text-inactive hover:text-muted transition-colors" tabindex="0">
      <span class="input__hint h-6 w-6"><HintIcon /></span>

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
      type: [String, Number],
      default: '',
    },
    hint: {
      type: String,
      default: undefined,
    },
    borderColour: { type: String, default: null },
    forceBorderVisible: { type: Boolean, default: false },
    valueFormatter: { type: Function, default: null },
    endSlotClickable: { type: Boolean, default: false },
    startSlotClickable: { type: Boolean, default: false },
  },

  emits: ['update:modelValue', 'focus:value', 'blur:value'],

  setup(props, { emit, slots }) {
    const model = computed({
      get: () => props.modelValue,
      set: (value) => {
        let currentValue = value;
        if (props.valueFormatter) {
          currentValue = props.valueFormatter(currentValue);
        }
        emit('update:modelValue', currentValue);
      },
    });

    const hasStartSlot = computed(() => !!slots.start);
    const hasEndSlot = computed(() => !!slots.end);

    return { model, hasStartSlot, hasEndSlot };
  },
});
</script>

<style lang="scss" scoped>
input {
  outline: none;
}

input::placeholder {
  transition: color 150ms ease-out;
}

input:focus ~ .focus-border {
  visibility: visible;
}

.input__hint {
  font-size: 1.5rem;
}
</style>
