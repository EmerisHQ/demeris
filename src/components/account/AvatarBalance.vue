<template>
  <div class="flex items-center" :class="{ 'py-3 px-6': walletName }">
    <div class="avatar relative w-8 h-8">
      <!-- eslint-disable vue/no-v-html -->
      <div
        class="absolute rounded-full overflow-hidden w-full h-full opacity-50 filter blur-md top-1"
        v-html="getAvatar(accountName)"
      />
      <div
        v-if="accountName != 'Demo Account'"
        class="avatar__gradient relative rounded-full overflow-hidden w-full h-full"
        v-html="getAvatar(accountName)"
      ></div>
      <div v-else class="avatar__demo relative rounded-full overflow-hidden w-full h-full"></div>
    </div>

    <div
      v-tippy
      class="ml-3 grow"
      :class="{ 'hidden sm:block': !walletName, 'mr-3': accountName == 'Demo Account' }"
      :content="isPriceApiAvailable ? '' : $t('components.avatar.priceApiDown')"
    >
      <div class="-text-1 slashed-zero" :class="[walletName ? 'font-bold mb-0.5' : 'leading-none mb-1']">
        {{ accountName }}
      </div>
      <div :class="[walletName ? '-text-1 text-muted' : 'text-0 font-medium leading-none']">
        <TotalPrice v-if="isPriceApiAvailable && initialLoadComplete" class="inline" />
        <SkeletonLoader v-else width="100%">
          <span v-if="walletName" class="ml-1">&middot; {{ walletName }}</span>
        </SkeletonLoader>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MD5 from 'crypto-js/md5';
import avatar from 'gradient-avatar';
import { computed } from 'vue';
import { useStore } from 'vuex';

import SkeletonLoader from '@/components/common/loaders/SkeletonLoader.vue';
import TotalPrice from '@/components/common/TotalPrice.vue';
import { GlobalGetterTypes } from '@/store';

interface Props {
  walletName?: string;
}

withDefaults(defineProps<Props>(), { walletName: '' });

const store = useStore();

const accountName = computed(() => {
  return store.getters[GlobalGetterTypes.USER.getAccount]?.name;
});
const isPriceApiAvailable = computed(() => {
  return store.getters[GlobalGetterTypes.API.getPrices].Fiats.length > 0 ? true : false;
});

const initialLoadComplete = computed(() => {
  return !store.getters[GlobalGetterTypes.USER.getFirstLoad];
});

const getAvatar = function (name: string): string {
  if (name == 'Demo Account') {
    return '<svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.5" filter="url(#filter0_f)"> <circle cx="29" cy="29" r="16" fill="#D5BC83"/> <circle cx="29" cy="29" r="16" fill="url(#paint0_angular)"/> </g> <circle cx="29" cy="25" r="16" fill="#D5BC83"/> <circle cx="29" cy="25" r="16" fill="url(#paint1_angular)"/> <defs> <filter id="filter0_f" x="0.2" y="0.2" width="57.6" height="57.6" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"> <feFlood flood-opacity="0" result="BackgroundImageFix"/> <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/> <feGaussianBlur stdDeviation="6.4" result="effect1_foregroundBlur"/> </filter> <radialGradient id="paint0_angular" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(29 29) rotate(90) scale(16)"> <stop offset="0.00013659" stop-color="#FFF1C3"/> <stop offset="0.2068" stop-color="#9B7C3A"/> <stop offset="0.321793" stop-color="#FFF0CA"/> <stop offset="0.399828" stop-color="#D3AD5F"/> <stop offset="0.490214" stop-color="#FFECC4"/> <stop offset="0.646492" stop-color="#997736"/> <stop offset="0.791185" stop-color="#FFF2C0"/> <stop offset="0.885516" stop-color="#CEA851"/> </radialGradient> <radialGradient id="paint1_angular" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(29 25) rotate(90) scale(16)"> <stop offset="0.00013659" stop-color="#FFF1C3"/> <stop offset="0.2068" stop-color="#9B7C3A"/> <stop offset="0.321793" stop-color="#FFF0CA"/> <stop offset="0.399828" stop-color="#D3AD5F"/> <stop offset="0.490214" stop-color="#FFECC4"/> <stop offset="0.646492" stop-color="#997736"/> <stop offset="0.791185" stop-color="#FFF2C0"/> <stop offset="0.885516" stop-color="#CEA851"/> </radialGradient> </defs> </svg> ';
  } else {
    return avatar(MD5(name) + '', 64);
  }
};
</script>

<style lang="scss" scoped>
:deep(.skeleton-loader) {
  margin-top: 0;
}
.avatar {
  &__gradient {
    &:before {
      content: '';
      display: block;
      background: url('../../assets/images/rectangle-avatar.png');
      background-size: 1.25rem;
      background-repeat: no-repeat;
      width: 1.25rem;
      height: 1.25rem;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -0.6125rem;
      margin-left: -0.6125rem;
    }
  }
  &__demo {
    background: conic-gradient(
        from 180deg at 50% 50%,
        #cea851 -41.21deg,
        #fff1c3 0.05deg,
        #9b7c3a 74.45deg,
        #fff0ca 115.85deg,
        #d3ad5f 143.94deg,
        #ffecc4 176.48deg,
        #997736 232.74deg,
        #fff2c0 284.83deg,
        #cea851 318.79deg,
        #fff1c3 360.05deg
      ),
      #d5bc83;
    width: 100%;
    height: 100%;
  }
  svg {
    width: 100%;
    height: 100%;
  }
}
</style>
