<template>
  <div class="header__logo">
    <div class="header__logo_icon">💎</div>
    <div class="header__logo_text">
      <div class="header__logo_text-title">Demeris</div>
      <div class="header__logo_text-status">Beta</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Logo',
});
</script>
<style lang="scss" scoped>
.header__logo {
  display: flex;

  &_icon {
    display: flex;
    align-items: center;
    margin-right: 12px;
  }

  &_text {
    display: flex;
    align-items: center;

    &-title {
      margin-right: 8px;

      font-size: 2.4rem;
      font-weight: bold;
    }

    &-status {
      padding: 0.5rem 1.8rem;
      font-size: 1.6rem;

      color: #fff;
      background-color: lightgrey;
      border-radius: 20px;
    }
  }
}
</style>
