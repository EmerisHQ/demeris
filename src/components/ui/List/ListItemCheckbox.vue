<template>
  <div class="flex w-full items-center justify-start">
    <img class="list-item-icon ml-6 h-3 w-3" :src="iconUrl" />
    <span class="pl-4"> {{ text }} </span>
    <Checkbox
      :model-value="isChecked"
      class="checkbox mr-6 ml-auto"
      :is-gradient-only-theme="false"
      @update:modelValue="onUpdate"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import Checkbox from '@/components/ui/Checkbox.vue'

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
    },
    text: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const listItemRef = ref({ iconUrl: props.iconUrl, isChecked: props.isChecked, text: props.text })

    const onUpdate = (e) => {
      listItemRef.value = { ...listItemRef.value, isChecked: e }
      emit('update:modelValue', listItemRef.value)
    }

    return { onUpdate }
  },
})
</script>

<style lang="scss" scoped>
::v-deep(.checkbox) {
  padding: 0;
}
</style>
