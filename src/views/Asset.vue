<template>
  <AppLayout>
    <div class="asset">
      <div class="asset__main">
        <!-- Info -->

        <section class="asset__main__info">
          <p class="asset__main__info__denom">
            <CircleSymbol :denom="denom" class="asset__main__info__denom__symbol" />
            <span class="asset__main__info__denom__name title-2-bold"> <Denom :name="denom" /></span>
            <span class="asset__main__info__denom__ticker title-0-normal"> <Ticker :name="denom" /></span>
          </p>
          <h1 class="asset__main__info__price title-2-bold">
            <Price :amount="{ amount: 0, denom }" />
          </h1>
        </section>

        <!-- Balance -->

        <MoonpayBanner v-if="!assets.length && denom === 'uatom'" class="asset__main__buy-banner" variant="banner" />

        <section v-else class="asset__main__balance">
          <p class="asset__main__balance__label title-0-normal">Balance</p>
          <h2 class="asset__main__balance__value title-3-bold">
            <Price :amount="{ amount: totalAmount, denom }" />
          </h2>
          <span class="asset__main__balance__price title-0-normal">
            <AmountDisplay :amount="{ amount: totalAmount, denom }" />
          </span>

          <dl class="asset__main__balance__card">
            <div class="asset__main__balance__card__item">
              <dt class="asset__main__balance__card__label title-0-normal">Available</dt>
              <dd class="asset__main__balance__card__value title-0-medium">
                <AmountDisplay :amount="{ amount: availableAmount, denom }" />
              </dd>
            </div>

            <div v-if="assetConfig?.stakable" class="asset__main__balance__card__item">
              <dt class="asset__main__balance__card__label title-0-normal">Staked</dt>
              <dd class="asset__main__balance__card__value title-0-medium">
                <AmountDisplay :amount="{ amount: stakedAmount, denom }" />
              </dd>
            </div>

            <div class="asset__main__balance__card__item">
              <dt class="asset__main__balance__card__label title-0-normal">Pooled</dt>
              <dd class="asset__main__balance__card__value title-0-medium">
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
        <MoonpayBanner v-if="assets.length && denom == 'uatom'" variant="widget" class="asset__aside__buy" />
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
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
import usePools from '@/composables/usePools';
import usePool from '@/composables/usePool';
import AppLayout from '@/layouts/AppLayout.vue';
import { VerifiedDenoms } from '@/types/api';
import { parseCoins } from '@/utils/basic';
import { getBaseDenom } from '@/utils/actionHandler';

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
    const { pools, poolsByDenom } = usePools();

    const assetConfig = computed(() => {
      const verifiedDenoms: VerifiedDenoms = store.getters['demeris/getVerifiedDenoms'] || [];
      return verifiedDenoms.find((item) => item.name === denom.value);
    });

    const assets = computed(() => balancesByDenom(denom.value));
    const poolsWithAsset = computed(() => poolsByDenom(denom.value));

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
      return poolsCopy.filter(item => balancesCopy.find(item2 => item.pool_coin_denom == item2.base_denom));
    });

    const poolsNotInvestedWithAsset = computed(() => {
      const poolsCopy = JSON.parse(JSON.stringify(poolsWithAsset.value));
      const balancesCopy = JSON.parse(JSON.stringify(balances.value));
      console.log("found", balancesCopy.find(item2 => item2.base_denom = "pool6AD4AA525D55410C606AE5A3EAD7D281153E4AF0B3C8D08EF46C4976904CA52E"));
      for (const pool of poolsWithAsset.value) {
        console.log("pooLcoin", pool.pool_coin_denom);
      }
      for (const balance of balancesCopy) {
        console.log("balance", balance);
      }
      
      return poolsCopy.filter(item => !balancesCopy.find(item2 => item.pool_coin_denom = item2.base_denom));
    });
    

    const poolsDisplay = computed(() => {
      console.log("poolsNotInvest", poolsNotInvestedWithAsset.value);

      /*
      const fillBy = 3 - poolsInvestedWithAsset.value.length;
      console.log("fillBy", fillBy);
      console.log("poolsInvested", poolsInvestedWithAsset.value);
      if (fillBy > 0) {
        return poolsInvestedWithAsset.value.concat(poolsNotInvestedWithAsset.value.slice(0,fillBy));
      }
      */
      return poolsInvestedWithAsset.value;
    });
    

    const pooledAmount = computed(() => {;
      let assetPooledAmount = 0;

      /*

      for (const pool of poolsInvestedWithAsset.value) {
        const poolCoinBalances = balancesByDenom(pool.pool_coin_denom);
        const {calculateWithdrawBalances} = usePool(computed(() => pool.id));
        const withdrawBalances = calculateWithdrawBalances(poolCoinBalances.reduce((acc, item) => acc + +parseCoins(item.amount)[0].amount, 0));

        const assetBalanceInPool = withdrawBalances.find((x) => x.denom == denom.value);
        assetPooledAmount += assetBalanceInPool.amount;
      }

      */

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
  margin-bottom: 2rem;
  font-size: 1.6rem;
  padding-bottom: 4rem;
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

        &__symbol {
          margin-right: 1.2rem;
          position: relative;
        }
        &__name {
          margin-right: 1.2rem;
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
      margin-top: 6.4rem;
    }
    &__balance {
      margin-top: 6.4rem;
      &__label {
        color: var(--muted);
      }
      &__price {
        color: var(--muted);
      }
      &__card {
        margin-top: 2.6rem;
        border: 1px solid var(--border-trans);
        border-radius: 1.2rem;
        padding: 1.6rem;
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
      margin-top: 6.4rem;
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
            margin-left: 1.6rem;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        &__amount {
          margin-left: 1.6rem;
          width: 33.33%;
          text-align: right;
          color: var(--muted);
        }

        &__balance {
          margin-left: 1.6rem;
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
          margin-left: 1.6rem;
          width: 3.2rem;
          height: 3.2rem;
          border-radius: 2.6rem;
          background-color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.8rem;
          box-shadow: 0px 8px 24px rgba(0, 3, 66, 0.08);
        }
      }
    }

    &__staking {
      &__rewards {
        margin-top: 3rem;
        padding: 1.6rem 2.4rem;
        border-radius: 1.2rem;
        background: var(--fg-trans);
        display: flex;
        align-items: center;

        &__label {
          flex: 1;
          font-weight: 600;
        }

        &__amount {
          margin-left: 1.6rem;
          color: var(--muted);
        }

        &__balance {
          margin-left: 1.6rem;
          font-weight: 600;
          text-align: right;
        }

        &__button {
          margin-left: 1.6rem;
          padding: 1.2rem 2.4rem;
          background-color: black;
          color: white;
          font-weight: 600;
          border-radius: 2rem;
        }
      }

      &__item {
        &__validator {
          flex: 1 1 0%;
          display: flex;
          align-items: center;

          &__avatar {
            border-radius: 0.8rem;
            width: 4rem;
            height: 4rem;
            background-color: rgba(0, 0, 0, 0.1);
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          &__name {
            margin-left: 1.6rem;
            flex: 1 1 0%;
            font-weight: bold;
          }
        }

        &__amount {
          margin-left: 1.6rem;
          width: 33.33%;
          text-align: right;
          color: var(--muted);
        }

        &__balance {
          margin-left: 1.6rem;
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
          margin-left: 1.6rem;
          padding: 0.4rem;
        }
      }
    }

    &__pools {
      &__wrapper {
        margin-top: 2.4rem;
      }
    }
  }

  &__aside {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-left: 6.4rem;
    width: 32rem;

    &__buy {
      margin-top: 2.6rem;
    }
  }

  &__list {
    margin-top: 6.4rem;
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
        font-size: 2.8rem;
        font-weight: 700;
      }
    }

    &__wrapper {
      margin-top: 3.2rem;
      margin-bottom: 1rem;
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
      margin-top: 3.2rem;
    }
  }
}
</style>
