<template>
  <router-link :to="{ name: 'Pool', params: { id: pool.id } }" class="pool" :style="cardStyle">
    <div class="pool__main">
      <div class="pool__main__token-pair">
        <CircleSymbol :denoms="denoms[0]" class="pool__main__token-pair__token token-a" />
        <CircleSymbol :denoms="denoms[1]" class="pool__main__token-pair__token token-b" />
      </div>
      <div class="pool__main__info">
        <p class="pool__main__info__name">{{ pairName }}</p>
        <span class="pool__main__info__total">$130.04m</span>
      </div>
    </div>

    <div class="pool__footer">
      <p class="pool__footer__label">Equity</p>
      <span class="pool__footer__value">$1,544.05</span>
    </div>
  </router-link>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref } from 'vue';

import CircleSymbol from '@/components/common/CircleSymbol.vue';
import usePools from '@/composables/usePools';
import symbolsData from '@/data/symbols';
import { Pool } from '@/types/actions';

const defaultColors = {
  primary: '#E1E1E1',
  secondary: '#F4F4F4',
  tertiary: '#F9F9F9',
};

const findSymbolColors = (symbol: string) => {
  return symbolsData[symbol]?.colors || defaultColors;
};

export default defineComponent({
  name: 'Pool',

  components: { CircleSymbol },

  props: {
    pool: {
      type: Object as PropType<Pool>,
      required: true,
    },
  },

  setup(props) {
    const pairName = ref('-/-');
    const denoms = ref((props.pool as Pool).reserve_coin_denoms);

    const { formatPoolName } = usePools();

    onMounted(async () => {
      pairName.value = await formatPoolName(props.pool as Pool);
    });

    const cardStyle = computed(() => {
      const colorA = findSymbolColors(denoms.value[0]).primary;
      const colorB = findSymbolColors(denoms.value[1]).primary;

      const background = `
				linear-gradient(165.72deg, rgba(247, 248, 248, 0.9) 0%, #F8F8F7 39.71%),
      	linear-gradient(67.04deg, ${colorA} 44.06%, ${colorB} 74.33%)`;

      return {
        background,
      };
    });

    return { cardStyle, denoms, pairName };
  },
});
</script>

<style lang="scss" scoped>
.pool {
  display: flex;
  flex-direction: column;
  border-radius: 1.6rem;
  padding: 2.4rem;
  font-size: 1.6rem;

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    &__token-pair {
      display: inline-flex;
      align-items: center;

      &__token {
        width: 3.2rem;
        height: 3.2rem;
        border-radius: 9999px;

        &.token-a {
          background-color: #f7f7f7;
          z-index: 1;
          box-shadow: inset 0px 0px 4px rgba(255, 255, 255, 0.62);
        }

        &.token-b {
          margin-left: -0.8rem;
          background-color: #e5e5e5;
        }
      }
    }

    &__info {
      margin-top: 1.6rem;
      &__name {
        font-weight: 600;
      }
      &__total {
        color: var(--muted);
        font-size: 1.2rem;
      }
    }
  }

  &__footer {
    display: flex;
    flex-direction: column;

    &__label {
      color: var(--muted);
      margin-bottom: 0.2rem;
      font-weight: 400;
    }
    &__value {
      font-weight: 600;
      text-transform: uppercase;
    }
  }
}
</style>
