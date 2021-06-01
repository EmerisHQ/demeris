<template>
  <div class="s-0">
    <router-view />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import { GlobalDemerisActionTypes } from './store/demeris/action-types';
export default defineComponent({
  name: 'App',
  data() {
    return {
      initialized: false,
    };
  },
  computed: {
    hasWallet() {
      return this.$store.hasModule(['common', 'wallet']);
    },
  },
  async created() {
    /*
        set dark/light mode according to user Preference
        later, there will be a toggle button and save user's preference to localStorage
        for overriding default os/browser setting
          // if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          //   document.documentElement.setAttribute('color-theme', 'dark');
          // } else {
          //   document.documentElement.setAttribute('color-theme', 'light');
          // }
      */
    document.documentElement.setAttribute('color-theme', 'light');

    await this.$store.dispatch(GlobalDemerisActionTypes.INIT, {
      endpoint: 'http://localhost:8000/v1',
      refreshTime: 5000,
    });
    this.initialized = true;
  },
  errorCaptured(err) {
    console.log(err);
    return false;
  },
});
</script>

<style lang="scss"></style>
