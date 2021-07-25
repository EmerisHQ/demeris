<template>
  <AppLayout>
    <div class="asset">
      <div class="asset__main">
        <!-- Info -->

        <section class="asset__main__info">
          <p class="asset__main__info__denom">
            <CircleSymbol :denom="denom" class="asset__main__info__denom__symbol mr-3 relative" />
            <span class="asset__main__info__denom__name text-2 font-bold"> <Denom :name="denom" /></span>
            <span class="asset__main__info__denom__ticker text-0"> <Ticker :name="denom" /></span>
          </p>
          <h1 class="asset__main__info__price text-2 font-bold">
            <Price :amount="{ amount: 0, denom }" />
          </h1>
        </section>

        <!-- Balance -->

        <MoonpayBanner v-if="!assets.length && denom === 'uatom'" class="asset__main__buy-banner" size="large" />

        <section v-else class="asset__main__balance">
          <p class="asset__main__balance__label text-0">Balance</p>
          <h2 class="asset__main__balance__value text-3 font-bold">
            <Price :amount="{ amount: totalAmount, denom }" />
          </h2>
          <span class="asset__main__balance__price text-0">
            <AmountDisplay :amount="{ amount: totalAmount, denom }" />
          </span>

          <dl class="asset__main__balance__card">
            <div class="asset__main__balance__card__item">
              <dt class="asset__main__balance__card__label text-0">Available</dt>
              <dd class="asset__main__balance__card__value text-0 font-medium">
                <AmountDisplay :amount="{ amount: availableAmount, denom }" />
              </dd>
            </div>

            <div v-if="assetConfig?.stakable" class="asset__main__balance__card__item">
              <dt class="asset__main__balance__card__label text-0">Staked</dt>
              <dd class="asset__main__balance__card__value text-0 font-medium">
                <AmountDisplay :amount="{ amount: stakedAmount, denom }" />
              </dd>
            </div>

            <div class="asset__main__balance__card__item">
              <dt class="asset__main__balance__card__label text-0">Pooled</dt>
              <dd class="asset__main__balance__card__value text-0 font-medium">
                <AmountDisplay :amount="{ amount: pooledAmount, denom }" />
              </dd>
            </div>
          </dl>
        </section>

        <!-- Chains -->

        <section v-if="assets.length" class="asset__main__chains asset__list">
          <div class="asset__list__header">
            <h2 class="asset__list__header__title">Chains</h2>
          </div>

          <ul class="asset__list__wrapper">
            <li v-for="asset of assets" :key="asset.address" class="asset__list__item asset__main__chains__item">
              <div class="asset__main__chains__item__asset">
                <CircleSymbol
                  :denom="denom"
                  :chain-name="asset.on_chain"
                  class="asset__main__chains__item__asset__avatar"
                  :glow="false"
                  variant="chain"
                />
                <span class="asset__main__chains__item__asset__denom"><ChainName :name="asset.on_chain" /></span>
              </div>
              <span class="asset__main__chains__item__amount">
                <AmountDisplay
                  v-if="assetConfig && asset.on_chain === assetConfig.chain_name"
                  :amount="{ amount: parseInt(asset.amount.slice(0, -4)) + stakedAmount + 'uatom', denom }"
                />
                <AmountDisplay v-else :amount="{ amount: asset.amount, denom }" />
              </span>
              <div class="asset__main__chains__item__balance">
                <span class="asset__main__chains__item__balance__value">
                  <Price
                    v-if="assetConfig && asset.on_chain === assetConfig.chain_name"
                    :amount="{ amount: parseInt(asset.amount.slice(0, -4)) + stakedAmount + 'uatom', denom }"
                  />
                  <Price v-else :amount="{ amount: asset.amount, denom }" />
                </span>
              </div>
            </li>
          </ul>
        </section>

        <!-- Pools -->

        <section v-if="poolsDisplay.length" class="asset__main__pools asset__list">
          <div class="asset__list__header">
            <p class="asset__list__header__title">Pools</p>
            <router-link :to="{ name: 'Pools' }" class="asset__list__header__button">
              See all
              <Icon name="ArrowRightIcon" :icon-size="1.6" />
            </router-link>
          </div>

          <div class="asset__main__pools__wrapper">
            <Pools :pools="poolsDisplay" />
          </div>
        </section>

        <!-- Staking -->

        <section v-if="assetConfig?.stakable" class="asset__main__staking asset__list">
          <div class="asset__list__header">
            <h2 class="asset__list__header__title">Staking</h2>
          </div>

          <StakeTable class="asset__list__wrapper" :denom="denom" />
        </section>
      </div>

      <!-- Swap -->

      <div class="asset__aside">
        <LiquiditySwap class="asset__aside__swap" />
        <PoolBanner :name="denom" />
        <MoonpayBanner v-if="assets.length && denom == 'uatom'" size="small" class="asset__aside__buy" />
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

import PoolBanner from '@/components/assets/AssetsTable/PoolBanner.vue';
import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Denom from '@/components/common/Denom.vue';
import MoonpayBanner from '@/components/common/MoonpayBanner.vue';
import Price from '@/components/common/Price.vue';
import StakeTable from '@/components/common/StakeTable.vue';
import Ticker from '@/components/common/Ticker.vue';
import Pools from '@/components/liquidity/Pools.vue';
import LiquiditySwap from '@/components/liquidity/Swap.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import usePool from '@/composables/usePool';
import usePools from '@/composables/usePools';
import AppLayout from '@/layouts/AppLayout.vue';
import { VerifiedDenoms } from '@/types/api';
import { getBaseDenom } from '@/utils/actionHandler';
import { generateDenomHash, parseCoins } from '@/utils/basic';

export default defineComponent({
  name: 'Asset',

  components: {
    AmountDisplay,
    ChainName,
    Denom,
    Ticker,
    CircleSymbol,
    StakeTable,
    AppLayout,
    Price,
    Icon,
    LiquiditySwap,
    Pools,
    PoolBanner,
    MoonpayBanner,
  },

  setup() {
    const store = useStore();
    const route = useRoute();
    const denom = computed(() => route.params.denom as string);

    const { balances, balancesByDenom, stakingBalancesByChain } = useAccount();
    const { pools, poolsByDenom, withdrawBalancesById } = usePools();

    const assetConfig = computed(() => {
      const verifiedDenoms: VerifiedDenoms = store.getters['demeris/getVerifiedDenoms'] || [];
      return verifiedDenoms.find((item) => item.name === denom.value);
    });

    const assets = computed(() => balancesByDenom(denom.value));

    const poolDenom = ref(denom.value);

    watch(
      denom,
      async () => {
        const dexChain = store.getters['demeris/getDexChain'];

        if (assetConfig.value.chain_name != dexChain) {
          const invPrimaryChannel =
            store.getters['demeris/getPrimaryChannel']({
              chain_name: dexChain,
              destination_chain_name: assetConfig.value.chain_name,
            }) ??
            (await store.dispatch(
              'demeris/GET_PRIMARY_CHANNEL',
              {
                subscribe: true,
                params: { chain_name: dexChain, destination_chain_name: assetConfig.value.chain_name },
              },
              { root: true },
            ));

          poolDenom.value = generateDenomHash(invPrimaryChannel, denom.value);
          console.log('poolDenom', poolDenom.value);
        }
      },
      { immediate: true },
    );

    const poolsWithAsset = computed(() => poolsByDenom(poolDenom.value));

    const availableAmount = computed(() => {
      return assets.value.reduce((acc, item) => acc + parseInt(parseCoins(item.amount)[0].amount), 0);
    });

    const stakingBalance = computed(() => {
      if (assetConfig.value && assetConfig.value.chain_name) {
        return stakingBalancesByChain(assetConfig.value.chain_name);
      }
      return 0;
    });

    const stakedAmount = computed(() => {
      let staked = stakingBalance.value;
      if (staked && Array.isArray(staked) && staked.length > 0 && staked[0].amount) {
        return parseFloat(staked[0].amount);
      }
      return 0;
    });

    const poolsInvestedWithAsset = computed(() => {
      const poolsCopy = JSON.parse(JSON.stringify(poolsWithAsset.value));
      const balancesCopy = JSON.parse(JSON.stringify(balances.value));

      return poolsCopy.filter((item) =>
        balancesCopy.some(
          (item2) => item.pool_coin_denom == item2.base_denom && +parseCoins(item2.amount)[0].amount > 0,
        ),
      );
    });

    const poolsNotInvestedWithAsset = computed(() => {
      const poolsCopy = JSON.parse(JSON.stringify(poolsWithAsset.value));
      const balancesCopy = JSON.parse(JSON.stringify(balances.value));

      return poolsCopy.filter(
        (item) =>
          !balancesCopy.some((item2) => item.pool_coin_denom == item2.base_denom) ||
          balancesCopy.some(
            (item2) => item.pool_coin_denom == item2.base_denom && +parseCoins(item2.amount)[0].amount == 0,
          ),
      );
    });

    const poolsDisplay = computed(() => {
      const fillBy = 3 - poolsInvestedWithAsset.value.length;

      if (fillBy > 0) {
        return poolsInvestedWithAsset.value.concat(poolsNotInvestedWithAsset.value.slice(0, fillBy));
      }

      return poolsInvestedWithAsset.value;
    });

    const pooledAmount = computed(() => {
      let assetPooledAmount = 0;

      for (const pool of poolsInvestedWithAsset.value) {
        const poolCoinBalances = balancesByDenom(pool.pool_coin_denom);
        const withdrawBalances = withdrawBalancesById(
          pool.id,
          poolCoinBalances.reduce((acc, item) => acc + +parseCoins(item.amount)[0].amount, 0),
        );

        const assetBalanceInPool = withdrawBalances.find((x) => x.denom == poolDenom.value);
        assetPooledAmount += assetBalanceInPool.amount;
      }

      return assetPooledAmount;
    });

    const totalAmount = computed(() => {
      return availableAmount.value + stakedAmount.value + pooledAmount.value;
    });

    return { assetConfig, denom, assets, poolsDisplay, availableAmount, stakedAmount, pooledAmount, totalAmount };
  },
});
</script>

<style lang="scss" scoped>
.asset {
  display: flex;
  margin-bottom: 1.25rem;
  font-size: 1rem;
  padding-bottom: 2.5rem;
  justify-content: space-between;

  &__main {
    display: flex;
    flex-direction: column;
    width: 60%;

    &__info {
      display: flex;
      &__denom,
      &__price {
        flex: 1;
      }
      &__denom {
        display: inline-flex;
        align-items: center;

        &__name {
          margin-right: 0.75rem;
        }
        &__ticker {
          color: var(--muted);
        }
      }
      &__price {
        text-align: right;
      }
    }

    &__buy-banner {
      margin-top: 4rem;
    }
    &__balance {
      margin-top: 4rem;
      &__label {
        color: var(--muted);
      }
      &__price {
        color: var(--muted);
      }
      &__card {
        margin-top: 1.5rem;
        border: 1px solid var(--border);
        border-radius: 0.75rem;
        padding: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;

        &__item {
          flex: 1;
        }
        &__label {
          color: var(--muted);
        }
      }
    }

    &__chains {
      margin-top: 4rem;
      &__item {
        &__asset {
          flex: 1 1 0%;
          display: flex;
          align-items: center;

          &__avatar {
            position: relative;
            &:before {
              display: block;
              content: '';
              width: 2.6rem;
              height: 2.6rem;
              position: absolute;
              top: 0.3rem;
              left: 0.3rem;
              border-radius: 1.3rem;
              background: var(--bg);
              z-index: 5;
            }
          }
          &__denom {
            margin-left: 1rem;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        &__amount {
          margin-left: 1rem;
          width: 33.33%;
          text-align: right;
          color: var(--muted);
        }

        &__balance {
          margin-left: 1rem;
          width: 33.33%;
          display: flex;
          align-items: center;

          &__value {
            flex: 1 1 0%;
            text-align: right;
            font-weight: 600;
          }
        }

        &__more {
          margin-left: 1rem;
          width: 2rem;
          height: 2rem;
          border-radius: 1.5rem;
          background-color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          box-shadow: 0px 8px 24px rgba(0, 3, 66, 0.08);
        }
      }
    }

    &__staking {
      &__rewards {
        margin-top: 2rem;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        background: var(--fg);
        display: flex;
        align-items: center;

        &__label {
          flex: 1;
          font-weight: 600;
        }

        &__amount {
          margin-left: 1rem;
          color: var(--muted);
        }

        &__balance {
          margin-left: 1rem;
          font-weight: 600;
          text-align: right;
        }

        &__button {
          margin-left: 1rem;
          padding: 0.75rem 1.5rem;
          background-color: black;
          color: white;
          font-weight: 600;
          border-radius: 1.25rem;
        }
      }

      &__item {
        &__validator {
          flex: 1 1 0%;
          display: flex;
          align-items: center;

          &__avatar {
            border-radius: 0.5rem;
            width: 2.5rem;
            height: 2.5rem;
            background-color: rgba(0, 0, 0, 0.1);
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          &__name {
            margin-left: 1rem;
            flex: 1 1 0%;
            font-weight: bold;
          }
        }

        &__amount {
          margin-left: 1rem;
          width: 33.33%;
          text-align: right;
          color: var(--muted);
        }

        &__balance {
          margin-left: 1rem;
          width: 33.33%;
          display: flex;
          align-items: center;

          &__value {
            flex: 1 1 0%;
            text-align: right;
            font-weight: 600;
          }
        }

        &__more {
          margin-left: 1rem;
          padding: 0.25rem;
        }
      }
    }

    &__pools {
      &__wrapper {
        margin-top: 1.5rem;
      }
    }
  }

  &__aside {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-left: 4rem;
    width: 20rem;

    &__buy {
      margin-top: 1.5rem;
    }
  }

  &__list {
    margin-top: 4rem;
    display: flex;
    flex-direction: column;

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

      &__title {
        font-size: 1.75rem;
        font-weight: 700;
      }
    }

    &__wrapper {
      margin-top: 2rem;
      margin-bottom: 0.75rem;
      width: 100%;
      display: flex;
      flex-direction: column;
    }

    &__item {
      width: 100%;
      display: flex;
      align-items: center;
    }

    &__item + &__item {
      margin-top: 2rem;
    }
  }
}
</style>
