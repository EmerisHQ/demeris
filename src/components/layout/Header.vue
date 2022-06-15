<template>
  <header
    class="relative flex items-center justify-between xl:justify-center px-5 md:px-8 xl:px-32 h-16 sm:h-20"
    role="navigation"
  >
    <router-link to="/" class="xl:absolute xl:left-0 xl:top-0 xl:h-full xl:px-8 hidden sm:flex items-center">
      <NavbarLogo />
    </router-link>

    <Navbar />
    <div class="xl:absolute xl:right-0 xl:top-0 xl:h-full xl:px-8 flex items-center">
      <router-link v-if="redeemableBalances.length > 0" :to="{ name: 'Redeem' }" class="hidden sm:inline">
        <IconButton v-tippy :content="tip" name="RedeemIcon" status="circle" :show-badge="showBadge" />
      </router-link>

      <router-link
        v-if="!isDemoAccount"
        class="text-0 font-medium leading-5 h-12 px-4 ml-3 lg:ml-0 hidden sm:flex bg-fg lg:bg-transparent rounded-full lg:rounded-none items-center justify-center rounded-lg group active:opacity-70 transition"
        to="/receive"
      >
        <ReceiveIcon class="group-hover:text-secondary" />
        <span class="ml-3 hidden lg:inline">{{ $t('navbar.receive') }}</span>
      </router-link>
      <a
        v-else
        href="javascript:void(0)"
        class="text-0 font-medium leading-5 h-12 px-4 ml-3 lg:ml-0 hidden sm:flex bg-fg lg:bg-transparent rounded-full lg:rounded-none items-center justify-center rounded-lg group active:opacity-70 transition"
        @click="settingsRef.toggleWalletModal"
      >
        <ReceiveIcon class="group-hover:text-secondary" />
        <span class="ml-3 hidden lg:inline">{{ $t('navbar.receive') }}</span>
      </a>
      <router-link
        class="text-0 font-medium leading-5 h-12 px-4 ml-3 lg:ml-0 hidden sm:flex bg-fg lg:bg-transparent rounded-full lg:rounded-none items-center justify-center rounded-lg group active:opacity-70 transition"
        to="/send"
      >
        <SendIcon class="group-hover:text-quinary" />
        <span class="ml-3 hidden lg:inline">{{ $t('navbar.send') }}</span>
      </router-link>

      <Settings ref="settingsRef" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

import Settings from '@/components/common/Settings.vue';
import Navbar from '@/components/layout/Navbar.vue';
import useAccount from '@/composables/useAccount';
import { GlobalGetterTypes } from '@/store';

import ReceiveIcon from '../common/Icons/ReceiveIcon.vue';
import SendIcon from '../common/Icons/SendIcon.vue';
import NavbarLogo from '../common/NavbarLogo.vue';
import IconButton from '../ui/IconButton.vue';

const { redeemableBalances } = useAccount();
const store = useStore();
let tip = computed(() => {
  return redeemableBalances.value.length == 1
    ? (tip = 'You have 1 asset to redeem')
    : (tip = 'You have ' + redeemableBalances.value.length + ' assets to redeem');
});
const isDemoAccount = computed(() => {
  return store.getters[GlobalGetterTypes.USER.isDemoAccount];
});
const showBadge = computed(() => {
  return store.getters[GlobalGetterTypes.USER.hasSeenReedem] ? false : true;
});
const settingsRef = ref(null);
</script>
