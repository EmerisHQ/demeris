<template>
  <label
    ref="containerElementRef"
    class="flexible-input relative flex items-center justify-center mx-auto w-full cursor-text"
    :class="{ 'text-inactive hover:text-muted': !model }"
  >
    <div
      class="flex-1 relative flex justify-center"
      :class="{ 'focus-within:text-inactive': !model }"
      :style="innerStyle"
    >
      <div class="flex items-baseline">
        <span
          ref="prefixElementRef"
          class="flexible-input__prefix self-start whitespace-nowrap leading-copy mt-1 mr-1"
          >{{ prefix }}</span
        >
        <slot :model="model" v-bind="inputProps" @update:modelValue="model = $event">
          <AmountInput
            ref="inputComponentRef"
            v-model="model"
            :placeholder="inputProps.placeholder"
            :style="inputProps.style"
            :class="inputProps.class"
            :width="inputProps.width"
            type="text"
            v-bind="$attrs"
          />
        </slot>
        <span ref="suffixElementRef" class="flexible-input__suffix whitespace-nowrap" :class="{ '!m-0': compact }">
          <slot name="suffix">
            {{ suffix }}
          </slot>
        </span>
        <span ref="sizeElementRef" class="invisible absolute right-0 bottom-0">{{ model }}</span>
      </div>
    </div>
  </label>
</template>
<script lang="ts">
/* eslint-disable max-lines-per-function */
import { computed, defineComponent, nextTick, PropType, reactive, ref, watch } from 'vue';

import AmountInput from './AmountInput.vue';

export default defineComponent({
  name: 'FlexibleAmountInput',
  components: {
    AmountInput,
  },
  props: {
    modelValue: {
      type: String as PropType<string>,
      default: '',
    },
    // maxWidth: {
    //   type: Number,
    //   required: false
    // },
    minWidth: {
      type: Number as PropType<number>,
      default: 30,
    },
    prefix: {
      type: String as PropType<string>,
      default: undefined,
    },
    suffix: {
      type: String as PropType<string>,
      default: undefined,
    },
    compact: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String as PropType<string>,
      default: undefined,
    },
  },
  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const containerElementRef = ref(null);
    const sizeElementRef = ref(null);
    const prefixElementRef = ref(null);
    const suffixElementRef = ref(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const inputComponentRef = ref(null);

    const model = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
    });

    const state = reactive({
      width: 0,
      maxWidth: '100%',
      scale: 1,
    });

    watch(
      [containerElementRef, sizeElementRef, prefixElementRef, suffixElementRef, model, props],
      ([containerEl, sizeEl, prefixEl, suffixEl]) => {
        if (!sizeEl) {
          return;
        }

        nextTick(() => {
          const extraWidth = (prefixEl?.offsetWidth || 0) + (suffixEl?.offsetWidth || 0);
          const width = Math.max(props.minWidth, sizeEl.offsetWidth + 1);
          const fullWidth = width + extraWidth;
          const maxWidth = Math.max(props.minWidth, containerEl?.offsetWidth);

          const scale = fullWidth >= maxWidth ? maxWidth / fullWidth : 1;

          state.width = width;
          state.maxWidth = `${maxWidth}px`;
          state.scale = scale;
        });
      },
      { immediate: true },
    );

    const innerStyle = computed(() => {
      return {
        transform: `scale(${state.scale})`,
        maxWidth: state.maxWidth,
      };
    });

    const inputProps = computed(() => {
      return {
        style: { width: `${state.width}px` },
        width: state.width,
        placeholder: props.placeholder,
        class: `flexible-input__input appearance-none placeholder-inactive overflow-hidden p-0 m-0 w-auto text-left border-none outline-none bg-transparent transition-colors`,
      };
    });
    return {
      model,
      state,
      innerStyle,
      inputProps,
      containerElementRef,
      sizeElementRef,
      prefixElementRef,
      suffixElementRef,
    };
  },
});
</script>

<style lang="scss">
.flexible-input {
  &__prefix {
    font-size: 0.56em;
  }

  &__suffix {
    margin-left: 0.15em;
  }

  &:hover &__input:not(:focus)::placeholder {
    color: var(--muted);
  }

  &__input {
    min-width: 0.66em;
    font: inherit;
    letter-spacing: inherit;
    outline: none;
  }
}
</style>
