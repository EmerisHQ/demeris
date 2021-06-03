<template>
  <div v-for="coin in data" :key="coin.base_denom" class="coin-list" @click="$emit('select', coin)">
    <div class="coin-list__info">
      <img
        class="coin-list__info-image"
        :src="require(`@/assets/coins/${coin.base_denom.substr(1)}.png`)"
        :alt="`${coin.base_denom} coin`"
      />
      <div class="coin-list__info-details">
        <div v-if="keyword" class="coin-list__info-details-denom s-0 w-medium">
          <span
            v-for="word in $filters.getCoinName(coin.base_denom)"
            :key="word"
            :class="keyword.includes(word.toLowerCase()) == '' ? 'search-not-included' : 'search-included'"
          >
            {{ word }}
          </span>
        </div>
        <div v-else class="coin-list__info-details-denom s-0 w-medium">
          {{$filters.getCoinName(coin.base_denom)}}
        </div>
        <div v-if="keyword" class="coin-list__info-details-data s-minus w-normal">
          <div v-if="type === 'amount'">
            {{coin.amount}}
            <span
            v-for="word in $filters.getCoinName(coin.base_denom)"
            :key="word + 'small'"
            :class="keyword.includes(word.toLowerCase()) == '' ? 'search-not-included' : 'search-included'"
          >
            {{ word }}
          </span>
            available
          </div>
          <span v-else>{{coin.on_chain}}</span>
        </div>
        <div v-else class="coin-list__info-details-data s-minus w-normal">
          {{ type === 'amount' ? `${coin.amount} ${$filters.getCoinName(coin.base_denom)} available` : coin.on_chain }}
        </div>
      </div>
    </div>
    <div v-if="type === 'amount'" class="coin-list__select">
      <AssetChainsIndicator :balances="data" :denom="coin.base_denom" :max-chains-count="4" />
      <Icon name="CaretRightIcon" :icon-size="1.6" :color="iconColor" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import AssetChainsIndicator from '@/components/assets/AssetChainsIndicator/AssetChainsIndicator.vue';
import Icon from '@/components/ui/Icon.vue';
export default defineComponent({
  name: 'Button',
  components: {
    AssetChainsIndicator,
    Icon,
  },
  props: {
    data: { type: Object, required: true },
    type: { type: String, required: false, default: 'chain' },
    keyword: { type: String, required: false, default: '' },
  },
  emits: ['select'],
  setup(props) {
    //TODO: handling current test data
    const iconColor = getComputedStyle(document.body).getPropertyValue('--inactive');
    function setSearchResult(denom) {
      if (props.keyword) {
        return '<div>test</div>';
      } else {
        return denom;
      }
    }
    return { iconColor, setSearchResult };
  },
});
</script>
<style lang="scss" scoped>
.coin-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 6.3rem;
  padding: 1.2rem 0;

  cursor: pointer;

  &__info {
    display: flex;
    align-items: center;

    &-image {
      width: 3.2rem;
      height: 3.2rem;
      margin-right: 1.6rem;
    }

    &-details {
      &-denom {
        color: var(--text);
      }

      &-data {
        color: var(--muted);
      }
    }
  }

  &__select {
    display: flex;
    justify-content: space-between;

    .icon {
      margin-left: 10px;
    }
  }

  .search-not-included {
    color: var(--inactive)
  }

  .search-included {
    color: var(--text)
  }
}
</style>
