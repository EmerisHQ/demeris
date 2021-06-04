<template>
  <div class="denom-select-modal-wrapper elevation-panel">
    <GobackWithClose @goback="emitHandler('goback')" @close="emitHandler('close')" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import GobackWithClose from '@/components/common/headers/GobackWithClose.vue';

export default defineComponent({
  name: 'DenomSelectModal',
  components: {
    GobackWithClose,
  },
  emits: ['goback', 'close'],
  setup(props, { emit }) {
    function emitHandler(event) {
      emit(event);
    }
    return {
      emitHandler,
    };
  },
});
</script>

<style lang="scss" scoped>
.denom-select-modal-wrapper {
  position: absolute;
  width: 100%;
  height: 55.8rem;
  top: 0;
  left: 0;

  overflow: hidden;

  background-color: var(--surface);
  z-index: 10;

  .search-bar {
    padding: 0 2.4rem 2.4rem;
  }

  .coin-list {
    padding: 0 1.6rem 0 2.4rem;
    height: 37.8rem;

    overflow-y: scroll;

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
  }
}
</style>
