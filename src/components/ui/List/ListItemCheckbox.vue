<template>
  <div class="flex w-full items-center justify-start">
    <img class="list-item-icon ml-6 h-3 w-3" :src="require(`@/assets/${iconUrl}`)" />
    <span class="pl-4"> {{ text }} </span>
    <Checkbox :model-value="isChecked" class="checkbox mr-6 ml-auto" @update:modelValue="onUpdate" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

import Checkbox from '@/components/ui/Checkbox.vue';
import useTheme from '@/composables/useTheme';

export default defineComponent({
  name: 'ListItemCheckbox',
  components: {
    Checkbox,
  },
  props: {
    isChecked: {
      type: Boolean,
      default: false,
    },
    iconUrl: {
      type: String,
      required: true,
      //example - svg/portal.svg
    },
    text: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const listItemRef = ref({ iconUrl: props.iconUrl, isChecked: props.isChecked, text: props.text });

    const onUpdate = (e) => {
      listItemRef.value = { ...listItemRef.value, isChecked: e };
      emit('update:modelValue', listItemRef.value);
    };
    const checkboxBackground = {
      lightTheme: `center / contain no-repeat url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E") #000`,
      darkTheme: `center / contain no-repeat url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='black' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E") #fff`,
    };
    const theme = useTheme();

    const checkboxStyle = computed(() => {
      return theme.value === 'dark'
        ? checkboxBackground.darkTheme
        : theme.value === 'light'
        ? checkboxBackground.lightTheme
        : '';
    });

    return { checkboxStyle, onUpdate };
  },
});
</script>

<style lang="scss" scoped>
::v-deep(.checkbox) {
  padding: 0;
}
::v-deep(.checkbox__control:checked) {
  background: v-bind('checkboxStyle');
}
</style>
