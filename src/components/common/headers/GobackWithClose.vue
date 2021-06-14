<template>
  <div class="goback-with-close">
    <div class="icon-wrapper" @click="clickIcon('goback')">
      <Icon :name="'ArrowLeftIcon'" class="icon" :icon-size="2.1" />
    </div>
    <div class="space"></div>
    <div class="icon-wrapper" @click="clickIcon('close')">
      <Icon :name="'CloseIcon'" class="icon" :icon-size="1.6" />
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
  padding: 2.8rem 1.6rem;

  .space {
    width: 2.4rem;
  }

  .icon-wrapper {
    width: 4rem;
    height: 4rem;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
}
</style>
