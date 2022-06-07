<template>
  <button
    class="buy-crypto-banner text-left w-full flex flex-col justify-between shadow-card rounded-2xl p-6 transition transform overflow-hidden hover:-translate-y-px focus:-translate-y-px active:transform-none active:opacity-70"
    :class="[
      `buy-crypto-banner--${size}`,
      size === 'small' ? 'theme-inverse dark:theme-inverse bg-app' : 'bg-surface dark:bg-fg',
    ]"
    @click="openModal"
  >
    <p class="text-text text-1 font-bold">{{ bannerTitle }}</p>
    <p class="text-muted -text-1 mt-14">{{ bannerSubtitle }}</p>
  </button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

import useCountry from '@/composables/useCountry';
import useEmitter from '@/composables/useEmitter';
import { GlobalGetterTypes } from '@/store';
import { event } from '@/utils/analytics';
import { featureRunning } from '@/utils/FeatureManager';

interface Props {
  asset?: string;
  size?: string;
}

const props = withDefaults(defineProps<Props>(), {
  asset: 'ATOM',
  size: 'large',
});

const store = useStore();
const emitter = useEmitter();
const userCountry = useCountry();
const route = useRoute();
//remove query check. just for testing
const bannerType = ref(
  route.query?.buyType
    ? route.query?.buyType
    : userCountry.includes('America') && featureRunning('SIMPLEX')
    ? 'simplex'
    : 'moonpay',
);
const { t } = useI18n({ useScope: 'global' });
const bannerTitle = computed(() => {
  return bannerType.value === 'simplex'
    ? t('components.simplexBanner.title', { asset: props.asset })
    : t('components.moonpayBanner.title', { asset: props.asset });
});
const bannerSubtitle = computed(() => {
  return bannerType.value === 'simplex'
    ? t('components.simplexBanner.poweredBy')
    : t('components.moonpayBanner.poweredBy');
});
const isSignedIn = computed(() => {
  return store.getters[GlobalGetterTypes.USER.isSignedIn];
});
const isDemoAccount = computed(() => {
  return store.getters[GlobalGetterTypes.USER.isDemoAccount];
});
const openModal = () => {
  if (isSignedIn.value && !isDemoAccount.value) {
    emitter.emit(bannerType.value);
    if (bannerType.value === 'simplex') {
      event('simplex_transaction', {
        event_label: 'Transaction with Simplex initiated',
        event_category: 'Fiat Onramp',
      });
    }
  } else {
    emitter.emit('toggle-settings-modal');
  }
};
</script>

<style lang="scss" scoped>
.buy-crypto-banner {
  min-height: 5rem;
  background-image: url('../../assets/images/buy-atom-card-big.png');
  background-repeat: no-repeat;
  background-position: top 30% left 120%;
  background-size: 70% auto;
  &--small {
    background-position: left 6rem top 0%;
    background-size: 95% auto;
    border: none;
  }
}
</style>
