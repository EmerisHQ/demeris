<template>
  <button @click="signIn()">Sign IN</button>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import { useStore } from '@/store';
import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';
export default defineComponent({
  name: 'Wallet',
  setup() {
    const store = useStore();
    const isSignedIn = computed(() => {
      return store.getters.isSignedIn;
    });
    const keplrAccountName = computed(() => {
      return store.getters.getKeplrAccountName;
    });
    const signIn = () => {
      store.dispatch(GlobalDemerisActionTypes.SIGN_IN);
    };
    return {
      isSignedIn,
      keplrAccountName,
      signIn,
    };
  },
});
</script>
