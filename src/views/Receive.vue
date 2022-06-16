<template>
  <div class="receive relative flex flex-col w-full min-h-screen items-center">
    <header class="absolute w-full max-w-7xl mx-auto flex items-center justify-between py-6 px-8 h-24">
      <Button v-if="state.selectedAsset" variant="link" :full-width="false" :click-function="goBack">
        <Icon name="ArrowLeftIcon" :icon-size="1.5" />
      </Button>

      <router-link to="/" class="ml-auto">
        <Button variant="link" :full-width="false">
          <Icon name="CloseIcon" :icon-size="1.5" />
        </Button>
      </router-link>
    </header>

    <main class="w-full max-w-7xl mx-auto md:pt-8 px-8 pb-0 flex-1 flex flex-col items-center overflow-hidden">
      <template v-if="!state.selectedAsset">
        <div class="-mt-9 h-full w-full max-w-md mx-auto">
          <DenomSelectModal
            :title="$t('pages.receive.select')"
            class="denom-select-modal h-full"
            type="receive"
            :assets="balances"
            :show-balance="true"
            :show-back-button="false"
            @select="assetSelectHandler"
          />
        </div>
      </template>

      <template v-else-if="state.selectedAsset && recipientAddress">
        <div class="md:flex items-center justify-end flex-1 w-full">
          <div
            class="self-stretch h-80 md:h-auto w-full md:w-1/2 flex items-center justify-center md:justify-end md:order-last mb-8 md:mb-0"
          >
            <div
              class="receive__portal relative h-full w-full max-w-md mx-auto md:px-16 flex items-center justify-center"
            >
              <div
                class="receive__portal__glow absolute inset-0 -left-1/2 z-0 bg-fg origin-right opacity-20 filter blur-md"
                :style="gradientStyle"
              ></div>
              <div class="receive__portal__bg absolute inset-0 z-0 bg-fg origin-right" :style="gradientStyle"></div>
              <QrCode class="relative z-10" :value="recipientAddress" width="160" :color="gradientStyle.color" />
            </div>
          </div>
          <div v-if="state.selectedAsset" class="relative z-20 max-w-md w-full mx-auto">
            <h2 class="text-3 font-bold mb-1">
              {{ $t('pages.receive.receive') }} <Denom :name="state.selectedAsset.base_denom" />
            </h2>
            <p class="text-muted">{{ $t('pages.receive.on') }} <ChainName :name="state.selectedAsset.on_chain" /></p>
            <fieldset class="mt-16">
              <div class="mb-3 font-bold">{{ $t('pages.receive.yourAddress') }}</div>
              <Address :address="recipientAddress" :chain-name="state.selectedAsset.on_chain" readonly class="bg-fg" />
            </fieldset>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { EmerisAPI } from '@emeris/types';
import orderBy from 'lodash.orderby';
import { reactive, toRefs } from 'vue';
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'vue-meta';

import ChainName from '@/components/common/ChainName.vue';
import Denom from '@/components/common/Denom.vue';
import DenomSelectModal from '@/components/common/DenomSelectModal.vue';
import QrCode from '@/components/common/QrCode.vue';
import Address from '@/components/ui/Address.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import symbolsData from '@/data/symbols';
import { pageview } from '@/utils/analytics';
import { getOwnAddress, hexToRGB } from '@/utils/basic';

const defaultColors = {
  primary: '#fffd38',
  secondary: '#30ffdf',
  tertiary: '#64dafb',
};

const { t } = useI18n({ useScope: 'global' });
pageview({ page_title: 'Receive assets', page_path: '/receive' });
useMeta(
  computed(() => ({
    title: t('navbar.receive'),
  })),
);

const { nativeBalances } = useAccount();

const balances = computed(() => {
  return orderBy(nativeBalances.value, (item) => (item.base_denom.startsWith('pool') ? 1 : -1));
});

const state = reactive({
  selectedAsset: undefined,
  recipientAddress: undefined,
});

const generateBackground = (colors: Record<string, string>) => {
  const hexArray = Object.values(colors).reverse();
  const positions = hexArray.length > 2 ? ['0%', '49%', '82%'] : ['0%', '82%'];
  const colorStops = [];

  for (const [index, hex] of Object.entries(hexArray)) {
    colorStops.push(`rgb(${hexToRGB(hex)}) ${positions[index]}`);
  }

  return `radial-gradient(
      ellipse farthest-corner at 16.67% 16.67%,
      ${colorStops.join(',')}
    )`;
};

const gradientStyle = computed(() => {
  const colors = symbolsData[state.selectedAsset?.base_denom]?.colors;
  return {
    background: generateBackground(colors || defaultColors),
    color: colors ? '#ffffff' : '#000000',
  };
});

const goBack = () => {
  state.selectedAsset = undefined;
};

const assetSelectHandler = (asset: EmerisAPI.Balance) => {
  state.selectedAsset = asset;
};

const { selectedAsset, recipientAddress } = toRefs(state);
watch(selectedAsset, async (value) => {
  if (value) {
    state.recipientAddress = await getOwnAddress({ chain_name: state.selectedAsset.on_chain });
  } else {
    state.recipientAddress = undefined;
  }
});
</script>

<style lang="scss">
.denom-select-modal:deep(.coin-list-fade) {
  display: none;
}

.receive__portal {
  max-height: 60rem;
  perspective: 400px;

  &__bg {
    transform: rotateY(-16deg) translateX(-8%);
  }
  &__glow {
    transform: rotateY(4deg) translateX(-6%) skew(0deg, -19deg);
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(257deg, var(--transparent), var(--bg));
      opacity: 1;
    }
  }
}
</style>
