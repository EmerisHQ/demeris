<template>
  <div>
    <div v-if="isSignedIn">
      {{ keplrAccountName }}
    </div>
    <button v-else @click="signIn()">Sign IN</button>
  </div>
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
      console.log(store);
      return store.getters['demeris/isSignedIn'];
    });
    const keplrAccountName = computed(() => {
      return store.getters['demeris/getKeplrAccountName'];
    });
    const keplrAddress = computed(() => {
      return store.getters['demeris/getKeplrAddress'];
    });
    const signIn = () => {
      store.dispatch(GlobalDemerisActionTypes.SIGN_IN);
    };
    return {
      isSignedIn,
      keplrAccountName,
      keplrAddress,
      signIn,
    };
  },
});
</script>
