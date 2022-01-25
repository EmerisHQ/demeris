<template>
  <input
    ref="inputRef"
    v-model="model"
    :placeholder="placeholder"
    type="text"
    inputmode="decimal"
    pattern="^[0-9]*[.,]?[0-9]*$"
    autocomplete="off"
    minlength="1"
    spellcheck="false"
    class="search-input bg-transparent pt-3 pr-5 pb-3 pl-5"
  />
</template>
<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';

export default defineComponent({
  name: 'SearchBox',
  props: {
    searchValue: {
      type: [String],
      default: '',
    },
    placeholder: {
      type: String as PropType<string>,
      default: 'Search',
    },
  },
  emits: ['searchValue'],

  setup(props, { emit }) {
    const inputRef = ref(null);

    const model = computed({
      get: () => (props.searchValue || '').toString(),
      set: (value) => {
        if (!inputRef.value) {
          return;
        }

        let currentValue = value;

        while (parseFloat(currentValue) > Number.MAX_SAFE_INTEGER) {
          currentValue = currentValue.slice(0, -1);
        }

        emit('searchValue', currentValue);
        inputRef.value.value = currentValue;
      },
    });
    return { inputRef, model };
  },
});
</script>
<style lang="scss" scoped>
.search-input {
  width: 100%;
  background: url('~@/assets/svg/icon-search.svg') no-repeat 14px;
  background-size: 20px;
  padding-left: 35px;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 10px;
  height: 40px;
  font-size: 16px;
}
</style>
