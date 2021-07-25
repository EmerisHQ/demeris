<template>
  <div class="logo">
    <img src="@/assets/images/emeris-brandmark.png" />
    <div class="version">Beta</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Logo',
});
</script>

<style scoped lang="scss">
.logo {
  height: 80px;
  width: 120px;
  display: flex;
  align-items: center;
}
img {
  display: block;
  width: 81px;
  height: 85px;
  margin-top: -5px;
}
.version {
  background: rgba(0, 0, 0, 0.03);
  color: var(--muted);
  border-radius: 0.625rem;
  font-size: 0.625rem;
  text-align: center;
  width: 39px;
  line-height: 23px;
}
</style>
