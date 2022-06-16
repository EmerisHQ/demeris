<template>
  <div v-if="coinsByType.length === 0" class="mt-12 text-center">
    <Icon name="MagnifyingGlassIcon" :icon-size="2" class="text-inactive mb-8" />
    <div class="text-1 text-text font-medium">{{ $t('generic_cta.filterNoResults', { keyword }) }}</div>
    <div class="text-0 text-muted mt-1">{{ $t('generic_cta.filterRetry') }}</div>
  </div>
  <div
    v-for="coin in coinsByType"
    :key="coin.base_denom"
    class="flex items-center justify-between py-4 px-3 mx-3 hover:bg-fg rounded-xl"
    :class="coin.isFullAmountUnavailable ? 'cursor-not-allowed' : 'cursor-pointer'"
    :disabled="coin.isFullAmountUnavailable"
    :data-chain="coin.on_chain"
    @click="!coin.isFullAmountUnavailable && emit('select', coin)"
  >
    <div class="flex items-center" :class="coin.isFullAmountUnavailable ? 'opacity-50' : ''">
      <tippy class="tippy-info mr-4">
        <CircleSymbol
          :variant="type === 'chain' ? 'chain' : 'asset'"
          :denom="coin.base_denom"
          :chain-name="coin.on_chain"
        />

        <template #content>
          <i18n-t scope="global" keypath="components.coinList.tooltip">
            <template #asset>
              <Denom :name="coin.base_denom" />
            </template>
            <template #chain>
              <ChainName :name="coin.on_chain" />
            </template>
          </i18n-t>
        </template>
      </tippy>
      <div class="flex-1">
        <div v-if="keyword" class="text-0 font-medium">
          <span v-for="word in coin.display_name" :key="word" :class="setWordColorByKeyword(keyword, word)">
            {{ word }}
          </span>
        </div>
        <div v-else-if="type === 'chain'" class="text-0 font-medium">
          <ChainName :name="coin.on_chain" />
        </div>
        <div v-else class="text-0 font-medium">
          <Denom :name="coin.base_denom" />
        </div>
        <div class="-text-1 font-normal text-muted" :class="coin.isFullAmountUnavailable ? 'text-negative' : ''">
          <ChainName v-if="type === 'receive'" :name="coin.on_chain" />
          <template v-else>
            <AmountDisplay :amount="{ denom: coin.base_denom, amount: `${parseCoins(coin.amount)[0].amount}` }" />
            <span v-if="!coin.unavailableChains.length || !coin.isFullAmountUnavailable">
              {{ $t('components.coinList.available') }}
            </span>
            <span v-else-if="coin.unavailableChains.length">{{ $t('components.coinList.unavailable') }}</span>
          </template>
        </div>
      </div>
    </div>
    <div v-if="type === 'pay'" class="flex justify-between">
      <ChainDownWarning v-if="coin.unavailableChains.length" v-bind="coin.unavailableChains[0]" />
      <template v-else>
        <AssetChainsIndicator
          :balances="data"
          :denom="coin.base_denom"
          :max-chains-count="4"
          :show-description="false"
        />
        <Icon name="CaretRightIcon" :icon-size="1" class="text-inactive ml-1.5" />
      </template>
    </div>
    <div v-else-if="showBalance" class="text-muted text-right">
      <AmountDisplay :amount="{ amount: parseCoins(coin.amount)[0].amount, denom: coin.base_denom }" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { EmerisAPI } from '@emeris/types';
import BigNumber from 'bignumber.js';
import orderBy from 'lodash.orderby';
import { computed, toRefs } from 'vue';
import { useStore } from 'vuex';

import AssetChainsIndicator from '@/components/assets/AssetChainsIndicator/AssetChainsIndicator.vue';
import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainDownWarning from '@/components/common/ChainDownWarning.vue';
import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Denom from '@/components/common/Denom.vue';
import Icon from '@/components/ui/Icon.vue';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { parseCoins } from '@/utils/basic';

BigNumber.config({ EXPONENTIAL_AT: [-20, 24] });

interface Props {
  data: EmerisAPI.Balances;
  type?: string;
  keyword?: string;
  showBalance?: boolean;
}

const props = withDefaults(defineProps<Props>(), { type: 'chain', keyword: '' });

const emit = defineEmits<{
  (e: 'select', coin: any): void;
}>();

const typedstore = useStore() as RootStoreTyped;
const modifiedData = computed(() => getUniqueCoinList(propsRef.data.value));

const propsRef = toRefs(props);
function setWordColorByKeyword(keyword, word) {
  return keyword.toLowerCase().includes(word.toLowerCase()) ? 'text-text' : 'text-inactive';
}

function getUniqueCoinList(data) {
  if (props.type !== 'pay') {
    return data.map((item) => {
      const unavailableChains = props.type === 'receive' ? [] : getUnavailableChains({ on_chain: item.on_chain });
      return {
        ...item,
        amount: item.amount ? item.amount : '0' + item.base_denom,
        unavailableChains,
        isFullAmountUnavailable: !!unavailableChains.length,
      };
    });
  }

  const newData = JSON.parse(JSON.stringify(data));
  const denomNameObject = {};
  const modifiedData = [];

  newData.forEach((denom) => {
    if (denomNameObject[denom.base_denom]) {
      // Remove from available amount if chain is down
      if (denomNameObject[denom.base_denom].unavailableChains.some((item) => item.chain === denom.on_chain)) {
        return;
      }
      const denomAmount = new BigNumber(denom.amount ? parseCoins(denom.amount)[0].amount : 0);
      const baseDenomAmount = new BigNumber(parseCoins(denomNameObject[denom.base_denom].amount)[0].amount);
      denomNameObject[denom.base_denom].amount = `${baseDenomAmount.plus(denomAmount).toString()}${denom.base_denom}`;
    } else {
      denomNameObject[denom.base_denom] = denom;
      const unavailableChains = getUnavailableChains(denom);
      const isFullAmountUnavailable = unavailableChains[0]?.unavailable === 'full';
      let amount = new BigNumber(denom.amount ? parseCoins(denom.amount)[0].amount : 0).toString();

      // Remove from available amount if chain is down
      if (unavailableChains.some((item) => item.chain === denom.on_chain)) {
        amount = '0';
      }
      amount = amount + denom.base_denom;
      denomNameObject[denom.base_denom] = {
        ...denom,
        amount,
        unavailableChains,
        isFullAmountUnavailable,
      };
    }
  });

  for (const denom in denomNameObject) {
    modifiedData.push(denomNameObject[denom]);
  }
  return modifiedData;
}

const getUnavailableChains = ({ base_denom, on_chain }: Partial<EmerisAPI.Balance>) => {
  const result = [];
  let uniqueChainsList: string[] = [on_chain];

  if (props.type === 'pay') {
    const chainList: string[] = props.data
      .filter((item) => item.base_denom === base_denom)
      .map((item) => item.on_chain);
    uniqueChainsList = [...new Set(chainList)];
  }

  for (const chain of uniqueChainsList) {
    const status = typedstore.getters[GlobalGetterTypes.API.getChainStatus]({ chain_name: chain });
    if (!status) {
      result.push({
        chain,
        denom: base_denom,
        unavailable: uniqueChainsList.length > 1 ? 'part' : 'full',
      });
    }
  }

  return result;
};

const coinsByType = computed(() => {
  return orderBy(modifiedData.value, [(c) => c.value], ['desc']);
});
</script>
<style lang="scss" scoped></style>
