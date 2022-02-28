<template>
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="20" fill="black" fill-opacity="0.03" />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M13.75 17.5C18.5825 17.5 22.5 13.5825 22.5 8.75C22.5 13.5825 26.4175 17.5 31.25 17.5C26.4175 17.5 22.5 21.4175 22.5 26.25C22.5 21.4175 18.5825 17.5 13.75 17.5Z"
      fill="black"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M8.75 25C11.5114 25 13.75 22.7614 13.75 20C13.75 22.7614 15.9886 25 18.75 25C15.9886 25 13.75 27.2386 13.75 30C13.75 27.2386 11.5114 25 8.75 25Z"
      fill="black"
    />
  </svg>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'InfoStarIcon',
});
</script>

<style lang="scss" scoped>
svg {
  width: 2.4em;
  height: 2.4em;
}
</style>
