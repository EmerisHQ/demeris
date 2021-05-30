<template>
  <div v-for="coin in data" :key="coin.base_denom" class="coin-list">
    <img
      class="coin-list__image"
      :src="require(`@/assets/coins/${coin.base_denom.substr(1)}.png`)"
      :alt="`${coin.base_denom} coin`"
    />
    <div class="coin-list__info">
      <div class="coin-list__info-denom s-0 w-medium">{{ $filters.getCoinName(coin.base_denom) }}</div>
      <div class="coin-list__info-detail s-minus w-normal">
        {{ type === 'amount' ? `${coin.amount} ${$filters.getCoinName(coin.base_denom)} available` : 'TODO' }}
      </div>
    </div>
    <AssetChainsIndicator :balances="data" :denom="coin.base_denom" :max-chains-count="4" />
    <Icon name="CaretRightIcon" :icon-size="1.6" :color="iconColor" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import AssetChainsIndicator from '@/components/common/AssetChainsIndicator';
import Icon from '@/components/ui/Icon.vue';
export default defineComponent({
  name: 'Button',
  components: {
    AssetChainsIndicator,
    Icon,
  },
  props: {
    data: { type: Object, required: true },
    type: { type: String, required: true },
  },
  setup() {
    //TODO: handling current test data
    const iconColor = getComputedStyle(document.body).getPropertyValue('--inactive');
    return { iconColor };
  },
});
</script>
<style lang="scss" scoped>
.coin-list {
  display: flex;
  align-items: center;
  margin-bottom: 2.4rem;
  &__image {
    width: 3.2rem;
    height: 3.2rem;
    margin-right: 1.6rem;
  }

  &__info {
    &-denom {
      color: var(--text);
    }

    &-detail {
      color: var(--muted);
    }
  }
}
</style>