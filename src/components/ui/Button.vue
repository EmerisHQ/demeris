<template>
  <div>
    <!-- Basic button implementation. At minimum primary/secondary types, busy and disabled states, can be a link,router_link or trigger a custom clickHandler //-->
    <button class="button s-0">Swap</button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Button'
})
</script>
<style lang="scss" scoped>
.button {
  width: 100%;
  padding: 1.6rem 0;
  background-color: var(--text);
  color:var(--bg);

  border-radius: 8px;
  border: none;
  outline:none;
  cursor: pointer;
}
</style>