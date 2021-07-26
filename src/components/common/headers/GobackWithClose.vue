<template>
  <div class="goback-with-close">
    <div class="icon-wrapper" @click="clickIcon('goback')">
      <Icon :name="'ArrowLeftIcon'" class="icon" :icon-size="1.5" />
    </div>
    <div class="space"></div>
    <div class="icon-wrapper" @click="clickIcon('close')">
      <Icon :name="'CloseIcon'" class="icon" :icon-size="1.5" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import Icon from '@/components/ui/Icon.vue';
export default defineComponent({
  name: 'GobackWithClose',
  components: { Icon },
  emits: ['goback', 'close'],
  setup(props, { emit }) {
    function clickIcon(event) {
      emit(event);
    }
    return { clickIcon };
  },
});
</script>
<style lang="scss" scoped>
.goback-with-close {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.75rem 1rem;

  .space {
    width: 1.5rem;
  }

  .icon-wrapper {
    width: 2.5rem;
    height: 2.5rem;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
}
</style>
