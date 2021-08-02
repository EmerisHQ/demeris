<template>
  <div class="connect-banner"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'ConnectBanner',
});
</script>

<style lang="scss" scoped>
.connect-banner {
  position: absolute;
  background-image: url('~@/assets/images/connect-banner.png');
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: cover;
  width: 50%;
  height: 100%;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
}
</style>
