<template>
  <div class="title-with-goback">
    <Icon :name="'ArrowLeftIcon'" class="icon" @click="func" />
    <div class="s-2 w-bold">{{ title }}</div>
    <div class="space"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import Icon from '@/components/ui/Icon.vue';
export default defineComponent({
  name: 'TitleWithGoback',
  components: { Icon },
  props: {
    title: String,
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
<style lang="scss" scoped>
.title-with-goback {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3rem 2.4rem;

  .space {
    width: 2.4rem;
  }

  .icon {
    cursor: pointer;
  }
}
</style>
