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
    @click="$emit('select', coin)"
  >
    <div class="flex items-center" :class="coin.isFullAmountUnavailable ? 'opacity-50' : ''">
      <tippy class="tippy-info mr-4">
        <CircleSymbol
          :variant="type === 'chain' ? 'chain' : 'asset'"
          :denom="coin.base_denom"
          :chain-name="coin.on_chain"
        />

        <template #content>
          <i18n-t keypath="components.coinList.tooltip">
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
        <div
          v-if="type === 'pay'"
          class="-text-1 font-normal text-muted"
          :class="coin.isFullAmountUnavailable ? 'text-negative' : ''"
        >
          <div v-if="type === 'pay'">
            <AmountDisplay :amount="{ amount: coin.amount, denom: coin.base_denom }" />
            <!-- <span
              v-for="word in coin.display_name"
              :key="word + 'small'"
              :class="setWordColorByKeyword(keyword, word)"
            >
              {{ word }}
            </span> -->
            <span v-if="!coin.unavailableChains.length || !coin.isFullAmountUnavailable">{{
              $t('components.coinList.available')
            }}</span>
            <span v-else-if="coin.unavailableChains.length">{{ $t('components.coinList.unavailable') }}</span>
          </div>
          <span v-else>{{ coin.on_chain }}</span>
        </div>
        <div v-else class="-text-1 font-normal text-muted">
          <span v-if="type === 'pay' || type === 'chain'">
            <AmountDisplay :amount="{ amount: coin.amount, denom: coin.base_denom }" />
            {{ $t('components.coinList.available') }}
          </span>
          <ChainName v-else :name="coin.on_chain" />
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
      <AmountDisplay :amount="{ amount: coin.amount, denom: coin.base_denom }" />
    </div>
  </div>
</template>
<script lang="ts">
import orderBy from 'lodash.orderby';
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';

import AssetChainsIndicator from '@/components/assets/AssetChainsIndicator/AssetChainsIndicator.vue';
import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainDownWarning from '@/components/common/ChainDownWarning.vue';
import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Denom from '@/components/common/Denom.vue';
import Icon from '@/components/ui/Icon.vue';
import getPrice from '@/utils/getPrice';

export default defineComponent({
  name: 'CoinList',
  components: {
    AssetChainsIndicator,
    ChainDownWarning,
    ChainName,
    AmountDisplay,
    Icon,
    Denom,
    CircleSymbol,
  },
  props: {
    data: { type: Object, required: true },
    type: { type: String, required: false, default: 'chain' },
    keyword: { type: String, required: false, default: '' },
    showBalance: { type: Boolean, default: false },
  },
  emits: ['select'],
  setup(props) {
    const store = useStore();
    const modifiedData = computed(() => getUniqueCoinList(props.data));

    function setWordColorByKeyword(keyword, word) {
      return keyword.toLowerCase().includes(word.toLowerCase()) ? 'text-text' : 'text-inactive';
    }

    function getUniqueCoinList(data) {
      if (props.type !== 'pay') {
        return data;
      }

      const newData = JSON.parse(JSON.stringify(data));
      let denomNameObejct = {};
      let modifiedData = [];

      newData.forEach((denom) => {
        if (denomNameObejct[denom.base_denom]) {
          // Remove from available amount if chain is down
          if (denomNameObejct[denom.base_denom].unavailableChains.some((item) => item.chain === denom.on_chain)) {
            return;
          }

          denomNameObejct[denom.base_denom].amount =
            parseInt(denomNameObejct[denom.base_denom].amount) + parseInt(denom.amount);
        } else {
          denomNameObejct[denom.base_denom] = denom;
          const unavailableChains = getChainsStatus(denom.base_denom);
          const isFullAmountUnavailable = unavailableChains[0]?.unavailable === 'full';
          denomNameObejct[denom.base_denom] = {
            ...denom,
            unavailableChains,
            isFullAmountUnavailable,
          };
        }
      });

      for (let denom in denomNameObejct) {
        modifiedData.push(denomNameObejct[denom]);
      }

      return modifiedData;
    }

    const getAmount = (amount: number | string, denom: string) => {
      const value = amount.toString().replace(denom, '');
      const result = parseInt(value.replace('undefined', ''));
      return result;
    };

    const getChainsStatus = (denom: string) => {
      const chainList = props.data.filter((item) => item.base_denom === denom).map((item) => item.on_chain);
      const uniqueChainList = [...new Set(chainList)];
      const result = [];
      for (const chain of uniqueChainList) {
        const status = store.getters['demeris/getChainStatus']({ chain_name: chain });
        if (status) {
          result.push({
            chain,
            denom,
            unavailable: uniqueChainList.length > 1 ? 'part' : 'full',
          });
        }
      }
      return result;
    };

    const sortLocale = (a, b) => {
      if (a && b) {
        return a.localeCompare(b, 0, { numeric: true, sensitivity: 'base' });
      }
      return;
    };

    const coinsWithValue = computed(() => {
      let coins = modifiedData.value;
      coins.map((b) => {
        let denom = b.base_denom;
        if (b.amount) {
          let amount = getAmount(b.amount, b.base_denom).toString();
          if (parseInt(amount) > 0) {
            let value = getPrice({ denom, amount });
            b.value = value;
          }
        }
        return b;
      });
      return coins;
    });

    const orderCoins = (coins) => {
      let tokens = [];
      let zeroTokens = [];
      let zeroLpTokens = [];
      coins.map((c) => {
        if (c.amount && getAmount(c.amount, c.base_denom)) {
          tokens.push(c);
        } else if (c.display_name?.includes('Gravity')) {
          zeroLpTokens.push(c);
        } else {
          zeroTokens.push(c);
        }
      });
      tokens = orderBy(tokens, [(c) => c.value], ['desc']);
      zeroTokens = zeroTokens.sort((a, b) => sortLocale(a.display_name, b.display_name));
      zeroLpTokens = zeroLpTokens.sort((a, b) => sortLocale(a.display_name, b.display_name));
      tokens = tokens.concat(zeroTokens).concat(zeroLpTokens);
      return tokens;
    };

    const coinsByType = computed(() => {
      return orderBy(modifiedData.value, [(c) => c.value], ['desc']);
    });

    return { setWordColorByKeyword, coinsByType };
  },
});
</script>
<style lang="scss" scoped></style>
