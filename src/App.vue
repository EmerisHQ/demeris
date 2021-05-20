<template>
  <div>
    <router-view />
  </div>
</template>
<script lang="ts">
import '@starport/vue/lib/starport-vue.css';

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
