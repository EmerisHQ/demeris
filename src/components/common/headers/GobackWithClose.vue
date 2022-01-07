<template>
  <div class="flex items-center justify-between py-7 px-4">
    <div class="w-10 flex items-center justify-evenly cursor-pointer" @click="clickIcon('goback')">
      <Icon :name="'ArrowLeftIcon'" :icon-size="1.5" />
    </div>
    <div class="w-6"></div>
    <div class="w-10 flex items-center justify-evenly cursor-pointer" @click="clickIcon('close')">
      <Icon :name="'CloseIcon'" :icon-size="1.5" />
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
<style lang="scss" scoped></style>
