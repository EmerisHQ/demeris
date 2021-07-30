<template>
  <div class="flex items-center h-20 py-6 pl-6 pr-12">
    <Button
      :v-if="showBackButton"
      variant="link"
      :click-function="
        () => {
          func();
        }
      "
    >
      <Icon :name="'ArrowLeftIcon'" size="1.5" />
    </Button>
    <div class="flex-grow text-center text-2 font-bold">{{ title }}</div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';

export default defineComponent({
  name: 'TitleWithGoback',
  components: { Button, Icon },
  props: {
    title: String,
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
          return '';
        };
      },
    },
  },
});
</script>
<style lang="scss" scoped></style>
