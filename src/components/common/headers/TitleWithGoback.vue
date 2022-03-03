<template>
  <div class="flex items-center h-24 py-8 pl-6" :class="showBackButton ? 'pr-12' : 'pr-6'">
    <Button
      v-if="showBackButton"
      variant="link"
      :click-function="
        () => {
          func()
        }
      "
    >
      <Icon :name="'ArrowLeftIcon'" size="1.5" />
    </Button>
    <div class="flex-grow text-center text-2 font-bold">{{ title }}</div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

import Button from '@/components/ui/Button.vue'
import Icon from '@/components/ui/Icon.vue'

export default defineComponent({
  name: 'TitleWithGoback',
  components: { Button, Icon },
  props: {
    title: {
      type: String,
      required: false,
      default: null,
    },
    showBackButton: {
      type: Boolean,
      required: false,
      default: true,
    },
    func: {
      type: Function,
      required: false,
      default() {
        return () => {
          return ''
        }
      },
    },
  },
})
</script>
<style lang="scss" scoped></style>
