<template>
  <div v-if="modifiedData.length === 0" class="no-result">
    <div class="no-result__board">
      <div class="title s-1 w-bold">No results for '{{ keyword }}'</div>
      <div class="sub-title s-0">Try again with another search</div>
    </div>
  </div>
  <div
    v-for="coin in modifiedData"
    :key="coin.base_denom"
    class="coin-list"
    @mouseenter="
      showTooltip(
        `${type}/${coin.on_chain}/${coin.base_denom}`,
        `${$filters.getCoinName(coin.base_denom)} on ${coin.on_chain}`,
      )
    "
    @mouseleave="hideTooltip(`${type}/${coin.on_chain}/${coin.base_denom}`)"
    @click="$emit('select', coin)"
  >
    <div class="coin-list__info">
      <tippy :id="`${type}/${coin.on_chain}/${coin.base_denom}`" class="tippy-info">
        <div :class="type === 'chain' ? 'circle-border' : ''" :style="{ borderColor: stringToColor(coin.on_chain) }">
          <img class="coin-list__info-image" :src="getCoinImage(coin.base_denom)" :alt="`${coin.base_denom} coin`" />
        </div>
      </tippy>
      <div class="coin-list__info-details">
        <div v-if="keyword" class="coin-list__info-details-denom s-0 w-medium">
          <span
            v-for="word in $filters.getCoinName(coin.base_denom)"
            :key="word"
            :class="setWordColorByKeyword(keyword, word)"
          >
            {{ word }}
          </span>
        </div>
        <div v-else-if="type === 'chain'" class="coin-list__info-details-denom s-0 w-medium">
          <ChainName :name="coin.on_chain" />
        </div>
        <div v-else class="coin-list__info-details-denom s-0 w-medium">
          <Denom :name="coin.base_denom" />
        </div>
        <div v-if="keyword" class="coin-list__info-details-data s-minus w-normal">
          <div v-if="type === 'pay'">
            <AmountDisplay :amount="{ amount: coin.amount, denom: coin.base_denom }" />
            <span
              v-for="word in $filters.getCoinName(coin.base_denom)"
              :key="word + 'small'"
              :class="setWordColorByKeyword(keyword, word)"
            >
              {{ word }}
            </span>
            available
          </div>
          <span v-else>{{ coin.on_chain }}</span>
        </div>
        <div v-else class="coin-list__info-details-data s-minus w-normal">
          <span v-if="type === 'pay' || type === 'chain'">
            <AmountDisplay :amount="{ amount: coin.amount, denom: coin.base_denom }" />
          </span>
          <ChainName v-else :name="coin.on_chain" />
        </div>
      </div>
    </div>
    <div v-if="type === 'pay'" class="coin-list__select">
      <AssetChainsIndicator :balances="data" :denom="coin.base_denom" :max-chains-count="4" />
      <Icon name="CaretRightIcon" :icon-size="1.6" :color="iconColor" />
    </div>
    <div v-else-if="showBalance" class="coin-list__balance">
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
import Denom from '@/components/common/Denom.vue';
import Icon from '@/components/ui/Icon.vue';

export default defineComponent({
  name: 'Button',
  components: {
    AssetChainsIndicator,
    ChainName,
    AmountDisplay,
    Icon,
    Denom,
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
      return keyword.toLowerCase().includes(word.toLowerCase()) ? 'search-included' : 'search-not-included';
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
          denomNameObejct[denom.base_denom].amount += denom.amount;
        } else {
          denomNameObejct[denom.base_denom] = denom;
        }
      });

      for (let denom in denomNameObejct) {
        modifiedData.push(denomNameObejct[denom]);
      }

      return modifiedData;
    }

    //TEST
    function stringToColor(str) {
      var hash = 0;
      for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      var colour = '#';
      for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xff;
        colour += ('00' + value.toString(16)).substr(-2);
      }
      return colour;
    }

    function getCoinImage(denom) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const image = require(`@/assets/coins/${true ? denom?.substr(1) : 'empty'}.png`);
        return image;
      } catch {
        return require(`@/assets/coins/empty.png`);
      }
    }

    return { iconColor, getCoinImage, setWordColorByKeyword, modifiedData, showTooltip, hideTooltip, stringToColor };
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

  .tippy-info {
    margin-right: 1.2rem;
  }

  &__balance {
    color: var(--muted);
    white-space: nowrap;
  }

  &__info {
    display: flex;
    align-items: center;
    width: 100%;

    &-image {
      width: 2.4rem;
      height: 2.4rem;

      margin: 0.4rem;

      border-radius: 50%;
    }

    .circle-border {
      border: 1px solid transparent;
      border-radius: 50%;
    }

    &-details {
      flex: 1 1 0%;

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
      margin-left: 1rem;
    }
  }

  .search-not-included {
    color: var(--inactive);
  }

  .search-included {
    color: var(--text);
  }
}

.no-result {
  position: relative;
  height: 100%;

  text-align: center;

  &__board {
    position: absolute;
    width: 100%;
    top: 50%;

    transform: translateY(-50%);
    .title {
      color: var(--text);
    }

    .sub-title {
      color: var(--muted);
    }
  }
}
</style>
