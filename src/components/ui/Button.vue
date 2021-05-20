<template>
  <div>
    <!-- Basic button implementation. At minimum primary/secondary types, busy and disabled states, can be a link,router_link or trigger a custom clickHandler //-->
    <button @click="swap" class="button s-0 w-medium elevation-button">Swap</button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import useButton from '@/setups/Button.vue';
export default defineComponent({
  name: 'Button',

  setup() {
    const { buttonFunction } = useButton();

    function swap() {
      buttonFunction({
        type: 'link-current-page',
        function: function test() {
          alert('test');
        },
      });
    }

    return {
      swap,
    };
  },
});
</script>
<style lang="scss" scoped>
.button {
  width: 100%;
  padding: 1.6rem 0;
  background-color: var(--text);
  color: var(--bg);

  border-radius: 8px;
  border: none;
  outline: none;
  cursor: pointer;
}
</style>