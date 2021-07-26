<template>
  <AppLayout>
    <div class="pool">
      <div class="pool__main">
        <section class="pool__main__stats">
          <span class="pool__main__stats__subtitle">Gravity DEX Pool</span>
          <div class="pool__main__stats__header">
            <div class="pool__main__stats__pair">
              <CircleSymbol :denom="pool.reserve_coin_denoms[0]" class="pool__main__stats__pair__token token-a" />
              <CircleSymbol :denom="pool.reserve_coin_denoms[1]" class="pool__main__stats__pair__token token-b" />
            </div>
            <h2 class="pool__main__stats__name s-2">{{ pairName }}</h2>
          </div>
          <h1 v-if="hasPrices" class="pool__main__stats__supply">{{ toUSD(totalLiquidityPrice) }}</h1>
        </section>

        <section v-if="reserveBalances" class="pool__main__assets">
          <h2 class="pool__main__assets__title s-2">Underlying assets</h2>

          <table class="pool__main__assets__table assets-table">
            <thead>
              <tr>
                <th class="text-left">Asset</th>
                <th class="text-right">Quantity</th>
                <th class="text-right">Price</th>
                <th v-if="hasPrices" class="text-right">Allocation</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="balance of reserveBalances"
                :key="balance.denom"
                class="assets-table__row"
                @click="openAssetPage(balance)"
              >
                <td class="assets-table__row__denom">
                  <CircleSymbol :denom="balance.denom" class="assets-table__row__denom__avatar" />
                  <span class="w-bold"><Denom :name="balance.denom" /></span>
                </td>
                <td class="text-right"><AmountDisplay :amount="balance" /></td>
                <td class="text-right"><Price :amount="{ denom: balance.denom, amount: 0 }" /></td>
                <td v-if="hasPrices" class="text-right w-bold"><Price :amount="balance" /></td>
              </tr>
            </tbody>
          </table>
        </section>

        <section v-if="reserveBalances" class="pool__main__assets">
          <h2 class="pool__main__assets__title s-2">Liquidity pool token</h2>

          <table class="pool__main__assets__table assets-table">
            <thead>
              <tr>
                <th class="text-left">Asset</th>
                <th class="text-right">Ticker</th>
                <th class="text-right">Price</th>
                <th v-if="hasPrices" class="text-right">Allocation</th>
              </tr>
            </thead>

            <tbody>
              <tr class="assets-table__row" @click="openAssetPage(walletBalances.poolCoin)">
                <td class="assets-table__row__denom">
                  <CircleSymbol :denom="walletBalances.poolCoin.denom" class="assets-table__row__denom__avatar" />
                  <span class="w-bold"><Denom :name="walletBalances.poolCoin.denom" /></span>
                </td>
                <td class="text-right">
                  <Ticker :name="walletBalances.poolCoin.denom" />
                </td>
                <td class="text-right"><Price :amount="{ denom: walletBalances.poolCoin.denom, amount: 0 }" /></td>
                <td v-if="hasPrices" class="text-right w-bold">{{ toUSD(totalLiquidityPrice) }}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section v-if="relatedPools.length" class="pool__main__pools">
          <div class="pool__main__pools__header">
            <h2 class="s-2">More pools</h2>
            <router-link :to="{ name: 'Pools' }" class="pool__main__pools__header__button">
              See all
              <Icon name="ArrowRightIcon" :icon-size="1.6" />
            </router-link>
          </div>

          <div class="pool__main__pools__wrapper">
            <Pools :pools="relatedPools" />
          </div>
        </section>
      </div>

      <div class="pool__aside">
        <div class="pool__aside__widget">
          <div class="pool-equity elevation-panel" :style="equityGradientStyle">
            <div class="pool-equity__header">
              <h2 class="s-2 w-bold">Equity</h2>
              <Icon name="ThreeDotsIcon" />
            </div>

            <div class="pool-equity__stats">
              <CircleSymbol :denom="walletBalances.poolCoin.denom" class="pool-equity__stats__avatar" />
              <div class="pool-equity__stats__wrapper">
                <p class="pool-equity__stats__amount w-bold">
                  <AmountDisplay :amount="walletBalances.poolCoin" />
                </p>
                <p v-if="hasPrices" class="pool-equity__stats__balance s-2 w-bold">
                  {{ toUSD(ownSharePrice) }}
                </p>
                <span class="pool-equity__stats__share s-minus"> {{ ownShare }}% of pool </span>
              </div>
            </div>

            <div class="pool-equity__supply">
              <Button name="Add liquidity" @click="addLiquidityHandler" />
            </div>

            <div v-if="walletBalances.poolCoin?.amount > 0" class="pool-equity__assets">
              <span class="pool-equity__assets__label s-minus">Assets provided</span>
              <ul class="pool-equity__assets__list">
                <li class="pool-equity__assets__list__item">
                  <CircleSymbol :denom="walletBalances.coinA.denom" class="pool-equity__assets__list__item__avatar" />
                  <span class="pool-equity__assets__list__item__denom w-bold">
                    <AmountDisplay :amount="walletBalances.coinA" />
                  </span>
                  <span v-if="hasPrices"><Price :amount="walletBalances.coinA" /></span>
                  <span v-else>-</span>
                </li>
                <li class="pool-equity__assets__list__item">
                  <CircleSymbol
                    :denom="walletBalances.coinB.denom"
                    size="sm"
                    class="pool-equity__assets__list__item__avatar"
                  />
                  <span class="pool-equity__assets__list__item__denom w-bold">
                    <AmountDisplay :amount="walletBalances.coinB" />
                  </span>
                  <span><Price :amount="walletBalances.coinB" /></span>
                </li>
              </ul>
            </div>

            <div v-if="walletBalances.poolCoin?.amount > 0" class="pool-equity__withdraw">
              <Button name="Withdraw" status="secondary" @click="withdrawLiquidityHandler" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import BigNumber from 'bignumber.js';
import { computed, defineComponent, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Denom from '@/components/common/Denom.vue';
import Price from '@/components/common/Price.vue';
import Ticker from '@/components/common/Ticker.vue';
import Pools from '@/components/liquidity/Pools.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import usePool from '@/composables/usePool';
import usePools from '@/composables/usePools';
import symbolsData from '@/data/symbols';
import AppLayout from '@/layouts/AppLayout.vue';
import { parseCoins } from '@/utils/basic';
import { hexToRGB, isNative } from '@/utils/basic';

const defaultColors = {
  primary: '#E1E1E1',
  secondary: '#F4F4F4',
  tertiary: '#F9F9F9',
};

export default defineComponent({
  name: 'Pool',

  components: {
    AmountDisplay,
    AppLayout,
    CircleSymbol,
    Denom,
    Icon,
    Button,
    Pools,
    Price,
    Ticker,
  },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const denoms = ref([]);

    const toUSD = (value) => {
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      });
      return formatter.format(Number.isNaN(value) ? 0 : value);
    };
    const { balancesByDenom } = useAccount();
    const { formatPoolName, poolsByDenom, getReserveBaseDenoms } = usePools();

    const hasPrices = computed(() => {
      let baseDenoms = denoms.value;
      if (!baseDenoms.length) {
        baseDenoms = pool.value.reserve_coin_denoms;
      }

      const priceA = store.getters['demeris/getPrice']({ denom: baseDenoms[0] });
      const priceB = store.getters['demeris/getPrice']({ denom: baseDenoms[1] });

      if (!priceA || !priceB) {
        return false;
      }

      return true;
    });

    const { pool, reserveBalances, pairName, calculateWithdrawBalances, totalSupply } = usePool(
      computed(() => route.params.id as string),
    );
    const totalLiquidityPrice = ref(0);

    const walletBalances = computed(() => {
      if (!pool.value || !reserveBalances.value?.length) {
        return;
      }

      const poolCoinBalances = balancesByDenom(pool.value.pool_coin_denom);

      const poolCoin = {
        denom: pool.value.pool_coin_denom,
        amount: poolCoinBalances.reduce((acc, item) => acc + +parseCoins(item.amount)[0].amount, 0),
      };
      const withdrawBalances = calculateWithdrawBalances(poolCoin.amount);

      return {
        coinA: withdrawBalances[0],
        coinB: withdrawBalances[1],
        poolCoin,
      };
    });

    const relatedPools = computed(() => {
      return [
        ...poolsByDenom(pool.value.reserve_coin_denoms[0]),
        ...poolsByDenom(pool.value.reserve_coin_denoms[1]),
      ].filter((item) => item.id !== pool.value.id);
    });

    const generateBackground = (colors: Record<string, string>) => {
      const hexArray = Object.values(colors).reverse();
      const positions = hexArray.length > 2 ? ['0%', '49%', '82%'] : ['0%', '82%'];
      const colorStops = [];

      for (const [index, hex] of Object.entries(hexArray)) {
        colorStops.push(`rgba(${hexToRGB(hex)}, 0.06) ${positions[index]}`);
      }

      return `radial-gradient(
					ellipse farthest-corner at 16.67% 16.67%,
					${colorStops.join(',')}
				)`;
    };

    const equityGradientStyle = computed(() => {
      let colors = defaultColors;

      if (denoms.value.length) {
        colors = {
          primary: symbolsData[denoms.value[0]]?.colors.primary || defaultColors.primary,
          secondary: symbolsData['gdex'].colors.primary,
          tertiary: symbolsData[denoms.value[1]]?.colors.primary || defaultColors.secondary,
        };
      }

      return {
        background: generateBackground(colors),
      };
    });

    const addLiquidityHandler = () => {
      router.push({ name: 'AddLiquidity', params: { id: pool.value.id } });
    };

    const withdrawLiquidityHandler = () => {
      router.push({ name: 'WithdrawLiquidity', params: { id: pool.value.id } });
    };

    const updateTotalLiquidityPrice = async () => {
      if (!pool.value) {
        return;
      }

      const reserveDenoms = await getReserveBaseDenoms(pool.value);
      denoms.value = reserveDenoms;

      let total = 0;

      for (const [index, denom] of reserveDenoms.entries()) {
        const price = store.getters['demeris/getPrice']({ denom });
        const precision = store.getters['demeris/getDenomPrecision']({ name: denom }) || 6;

        total += (reserveBalances.value[index].amount / Math.pow(10, precision)) * price;
      }

      totalLiquidityPrice.value = total;
    };

    const ownShare = computed(() => {
      if (!pool.value || !totalSupply.value || !walletBalances.value.poolCoin.amount) {
        return 0;
      }

      return new BigNumber(walletBalances.value.poolCoin.amount)
        .dividedBy(totalSupply.value)
        .multipliedBy(100)
        .decimalPlaces(2)
        .toNumber();
    });

    const ownSharePrice = computed(() => {
      if (!ownShare.value || !totalLiquidityPrice.value) {
        return '0.00';
      }

      return new BigNumber(ownShare.value).dividedBy(totalLiquidityPrice.value).toFixed(2);
    });

    const openAssetPage = (asset: Record<string, string>) => {
      router.push({ name: 'Asset', params: { denom: asset.denom } });
    };

    watch(reserveBalances, updateTotalLiquidityPrice);

    return {
      hasPrices,
      pool,
      pairName,
      reserveBalances,
      relatedPools,
      walletBalances,
      totalLiquidityPrice,
      equityGradientStyle,
      addLiquidityHandler,
      withdrawLiquidityHandler,
      formatPoolName,
      ownShare,
      ownSharePrice,
      toUSD,
      openAssetPage,
    };
  },
});
</script>

<style lang="scss" scoped>
.pool {
  display: flex;
  margin-bottom: 2rem;
  font-size: 1.6rem;
  padding-bottom: 4rem;

  &__main {
    display: flex;
    flex-direction: column;
    width: 60%;

    &__stats {
      &__header {
        margin-top: 1.2rem;
        display: flex;
        align-items: center;
      }

      &__pair {
        margin-right: 1.2rem;

        &__token {
          &.token-a {
            z-index: 1;
          }
          &.token-b {
            z-index: 0;
            margin-left: -0.6rem;
          }
        }
      }

      &__name {
        line-height: 1.5;
      }

      &__subtitle {
        color: var(--muted);
      }

      &__supply {
        font-size: 5.1rem;
        font-weight: 700;
        line-height: 1.2;
        margin-top: 0.4rem;
      }

      &__pair {
        display: inline-flex;

        &__avatar {
          width: 3.4rem;
          height: 3.4rem;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 2.6rem;

          & + & {
            margin-left: -1rem;
          }
        }
      }
    }

    &__assets {
      margin-top: 6.4rem;

      &__table {
        margin-top: 3.2rem;
      }
    }

    &__pools {
      margin-top: 4rem;

      &__wrapper {
        margin-top: 3rem;
      }

      &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        &__button {
          display: flex;
          align-items: center;
          font-weight: 600;

          .icon {
            margin-left: 0.6rem;
          }
        }
      }
    }
  }

  &__aside {
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    margin-left: 3.2rem;
    flex: 1 1 0%;

    &__widget {
      width: 80%;
    }
  }
}

.assets-table {
  width: calc(100% + 4rem);
  margin-inline: -2rem;
  table-layout: fixed;

  &__wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .text-right {
    text-align: right;
  }

  .text-left {
    text-align: left;
  }

  th {
    color: var(--muted);
    background: var(--bg);
    vertical-align: middle;
    font-size: 1.3rem;
    font-weight: 400;
    padding: 1.5rem 0;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  td,
  th {
    transition: all 100ms ease-in;

    &:first-child {
      padding-left: 2rem;
    }

    &:last-child {
      padding-right: 2rem;
    }
  }

  &__row {
    cursor: pointer;

    &:hover {
      td {
        background: rgba(0, 0, 0, 0.03);
      }

      td:first-child {
        border-top-left-radius: 0.8rem;
        border-bottom-left-radius: 0.8rem;
      }

      td:last-child {
        border-top-right-radius: 0.8rem;
        border-bottom-right-radius: 0.8rem;
      }
    }

    &__denom {
      padding: 2.4rem 0;
      display: flex;
      align-items: center;

      &__avatar {
        width: 3.2rem;
        height: 3.2rem;
        border-radius: 2.6rem;
        background: rgba(0, 0, 0, 0.1);
        margin-right: 1.6rem;
        flex-shrink: 0;
      }
    }
  }
}

.pool-equity {
  width: 100%;
  background: red;
  padding: 2.4rem;
  border-radius: 1.6rem;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__stats {
    display: flex;
    align-items: flex-start;
    margin-top: 3rem;

    &__avatar {
      margin-right: 1.2rem;
    }

    &__wrapper {
      display: flex;
      flex-direction: column;
    }

    &__balance {
      margin: 0.2rem 0;
    }

    &__share {
      color: var(--muted);
    }
  }

  &__supply {
    margin-top: 3.2rem;
  }

  &__withdraw {
    margin-top: 3.2rem;
  }

  &__assets {
    margin-top: 4rem;

    &__label {
      color: var(--muted);
    }

    &__list {
      margin-top: 2.1rem;

      &__item {
        display: flex;
        align-items: center;

        &__avatar {
          width: 2.4rem;
          height: 2.4rem;
          border-radius: 2.6rem;
          background: rgba(0, 0, 0, 0.1);
          margin-right: 1.2rem;
        }

        &__denom {
          flex: 1 1 0%;
        }

        & + & {
          margin-top: 1.6rem;
        }
      }
    }
  }
}
</style>
