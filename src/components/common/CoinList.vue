<template>
  <div v-if="modifiedData.length === 0" class="mt-12 text-center">
    <Icon name="MagnifyingGlassIcon" :icon-size="2" class="text-inactive mb-8" />
    <div class="text-1 text-text font-medium">{{ $t('generic_cta.filterNoResults', { keyword }) }}</div>
    <div class="text-0 text-muted mt-1">{{ $t('generic_cta.filterRetry') }}</div>
  </div>
  <div
    v-for="coin in modifiedData"
    :key="coin.base_denom"
    class="flex items-center justify-between py-4 px-3 mx-3 cursor-pointer hover:bg-fg rounded-xl"
    @mouseenter="
      showTooltip(
        `${type}/${coin.on_chain}/${coin.base_denom}`,
        $t('components.coinList.tooltip', { asset: $filters.getCoinName(coin.base_denom), chain: coin.on_chain }),
      )
    "
    @mouseleave="hideTooltip(`${type}/${coin.on_chain}/${coin.base_denom}`)"
    @click="$emit('select', coin)"
  >
    <div class="flex items-center">
      <tippy :id="`${type}/${coin.on_chain}/${coin.base_denom}`" class="tippy-info mr-4">
        <CircleSymbol
          :variant="type === 'chain' ? 'chain' : 'asset'"
          :denom="coin.base_denom"
          :chain-name="coin.on_chain"
        />
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
        <div v-if="type === 'pay'" class="-text-1 font-normal text-muted">
          <div v-if="type === 'pay'">
            <AmountDisplay :amount="{ amount: coin.amount, denom: coin.base_denom }" />
            <!-- <span
              v-for="word in coin.display_name"
              :key="word + 'small'"
              :class="setWordColorByKeyword(keyword, word)"
            >
              {{ word }}
            </span> -->
            {{ $t('components.coinList.available') }}
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
      <AssetChainsIndicator :balances="data" :denom="coin.base_denom" :max-chains-count="4" :show-description="false" />
      <Icon name="CaretRightIcon" :icon-size="1" :color="iconColor" />
    </div>
    <div v-else-if="showBalance" class="text-muted text-right">
      <AmountDisplay :amount="{ amount: coin.amount, denom: coin.base_denom }" />
    </div>
  </div>
</template>
<script lang="ts">
import tippy from 'tippy.js';
import { computed, defineComponent, ref } from 'vue';

import AssetChainsIndicator from '@/components/assets/AssetChainsIndicator/AssetChainsIndicator.vue';
import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Denom from '@/components/common/Denom.vue';
import Icon from '@/components/ui/Icon.vue';
export default defineComponent({
  name: 'CoinList',
  components: {
    AssetChainsIndicator,
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
    const iconColor = getComputedStyle(document.body).getPropertyValue('--inactive');
    const modifiedData = computed(() => getUniqueCoinList(props.data));
    const tooltipInstance = ref(null);
    function setWordColorByKeyword(keyword, word) {
      return keyword.toLowerCase().includes(word.toLowerCase()) ? 'text-text' : 'text-inactive';
    }

    function showTooltip(eleId, text) {
      if (props.type === 'chain') {
        tooltipInstance.value = tippy(document.getElementById(eleId));
        tooltipInstance.value.setContent(text);
        tooltipInstance.value.show();
      }
    }

    function hideTooltip() {
      if (props.type === 'chain') {
        tooltipInstance.value.hide();
      }
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
          denomNameObejct[denom.base_denom].amount =
            parseInt(denomNameObejct[denom.base_denom].amount) + parseInt(denom.amount);
        } else {
          denomNameObejct[denom.base_denom] = denom;
        }
      });

      for (let denom in denomNameObejct) {
        modifiedData.push(denomNameObejct[denom]);
      }

      return modifiedData;
    }

    return { iconColor, setWordColorByKeyword, modifiedData, showTooltip, hideTooltip };
  },
});
</script>
<style lang="scss" scoped></style>
