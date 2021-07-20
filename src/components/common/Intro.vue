<template>
  <div class="intro elevation-panel">
    <a href="https://medium.com/emeris-blog" target="_blank" rel="noopener noreferrer">
      <div class="label">
        <p>Introductory guide</p>
        <p class="muted">10 min</p>
      </div>
      <img src="@/assets/images/intro-panel.png" />
    </a>
  </div>
  {{ displayDenom }}
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Intro',
});
</script>
<style lang="scss" scoped>
.intro {
  margin-bottom: 2.6rem;
  position: relative;
}
.label {
  position: absolute;
  bottom: 2.4rem;
  left: 2.4rem;
  font-size: 1.4rem;
}
.muted {
  color: var(--muted);
}
img {
  width: auto;
  display: block;
}
</style>
