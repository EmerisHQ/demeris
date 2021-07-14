<template>
  <AppLayout>
    <div class="asset">
      <div class="asset__main">
        <!-- Info -->

        <section class="asset__main__info">
          <p class="asset__main__info__denom">
            <CircleSymbol :denom="denom" class="asset__main__info__denom__symbol" />
            <span class="asset__main__info__denom__name"><Denom :name="denom" /></span>
          </p>
          <h1 class="asset__main__info__price">
            <Price :amount="{ amount: 0, denom }" />
          </h1>
        </section>

        <!-- Balance -->

        <MoonpayBanner v-if="!assets.length" class="asset__main__buy-banner" variant="banner" />

        <section v-else class="asset__main__balance">
          <p class="asset__main__balance__label">Balance</p>
          <h2 class="asset__main__balance__value">
            <AmountDisplay :amount="{ amount: totalAmount, denom }" />
          </h2>
          <span class="asset__main__balance__price">
            <Price :amount="{ amount: totalAmount, denom }" />
          </span>

          <dl class="asset__main__balance__card">
            <div class="asset__main__balance__card__item">
              <dt class="asset__main__balance__card__label">Available</dt>
              <dd class="asset__main__balance__card__value">
                <AmountDisplay :amount="{ amount: totalAmount, denom }" />
              </dd>
            </div>

            <div v-if="assetConfig?.stakable" class="asset__main__balance__card__item">
              <dt class="asset__main__balance__card__label">Staked</dt>
              <dd class="asset__main__balance__card__value">-</dd>
            </div>

            <div class="asset__main__balance__card__item">
              <dt class="asset__main__balance__card__label">Pooled</dt>
              <dd class="asset__main__balance__card__value">-</dd>
            </div>
          </dl>
        </section>

        <!-- Chains -->

        <section v-if="assets.length" class="asset__main__chains asset__list">
          <ul class="asset__list__wrapper">
            <li v-for="asset of assets" :key="asset.address" class="asset__list__item asset__main__chains__item">
              <div class="asset__main__chains__item__asset">
                <CircleSymbol
                  :denom="denom"
                  :chain-name="asset.on_chain"
                  class="asset__main__chains__item__asset__avatar"
                />
                <span class="asset__main__chains__item__asset__denom"><ChainName :name="asset.on_chain" /></span>
              </div>
              <span class="asset__main__chains__item__amount"><AmountDisplay :amount="{ amount: asset.amount, denom }" /></span>
              <div class="asset__main__chains__item__balance">
                <span class="asset__main__chains__item__balance__value">
                  <Price :amount="{ amount: asset.amount, denom }" />
                </span>
              </div>
            </li>
          </ul>
        </section>

        <!-- Staking -->

        <section v-if="assetConfig?.stakable" class="asset__main__staking asset__list">
          <div class="asset__list__header">
            <h2 class="asset__list__header__title">Staking</h2>
          </div>

          <StakeTable class="asset__list__wrapper" :denom="denom" />
        </section>

        <!-- Pools -->

        <section v-if="pools.length" class="asset__main__pools asset__list">
          <div class="asset__list__header">
            <p class="asset__list__header__title">Pools</p>
            <button class="asset__list__header__button">
              <PlusIcon class="asset__list__header__button__icon" />
            </button>
          </div>

          <div class="asset__main__pools__wrapper">
            <Pools :pools="pools" />
          </div>
        </section>
      </div>

      <!-- Swap -->

      <div class="asset__aside">
        <LiquiditySwap class="asset__aside__swap" />
        <MoonpayBanner v-if="assets.length && denom == 'uatom'" variant="widget" class="asset__aside__buy" />
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Denom from '@/components/common/Denom.vue';
import PlusIcon from '@/components/common/Icons/PlusIcon.vue';
import MoonpayBanner from '@/components/common/MoonpayBanner.vue';
import Price from '@/components/common/Price.vue';
import StakeTable from '@/components/common/StakeTable.vue';
import Pools from '@/components/liquidity/Pools.vue';
import LiquiditySwap from '@/components/liquidity/Swap.vue';
import useAccount from '@/composables/useAccount';
import usePools from '@/composables/usePools';
import AppLayout from '@/layouts/AppLayout.vue';
import { VerifiedDenoms } from '@/types/api';
import { parseCoins } from '@/utils/basic';

export default defineComponent({
  name: 'Asset',

  components: {
    AmountDisplay,
    ChainName,
    Denom,
    CircleSymbol,
    StakeTable,
    AppLayout,
    Price,
    PlusIcon,
    LiquiditySwap,
    Pools,
    MoonpayBanner,
  },

  setup() {
    const store = useStore();
    const route = useRoute();
    const denom = computed(() => route.params.denom as string);

    const { balancesByDenom } = useAccount();
    const { poolsByDenom } = usePools();

    const assetConfig = computed(() => {
      const verifiedDenoms: VerifiedDenoms = store.getters['demeris/getVerifiedDenoms'] || [];
      return verifiedDenoms.find((item) => item.name === denom.value);
    });

    const assets = computed(() => balancesByDenom(denom.value));
    const pools = computed(() => poolsByDenom(denom.value));

    const totalAmount = computed(() => {
      return assets.value.reduce((acc, item) => acc + parseInt(parseCoins(item.amount)[0].amount), 0);
    });

    return { assetConfig, denom, assets, pools, totalAmount };
  },
});
</script>

<style lang="scss" scoped>
.asset {
  display: flex;
  margin-bottom: 2rem;
  font-size: 1.6rem;
  padding-bottom: 4rem;

  &__main {
    display: flex;
    flex-direction: column;
    width: 60%;

    &__info {
      &__denom {
        display: inline-flex;
        align-items: center;

        &__symbol {
          margin-right: 1.2rem;
        }
        &__name {
          font-size: 2.8rem;
          font-weight: 700;
          margin-right: 1.2rem;
        }
      }
      &__price {
        line-height: 1.2;
        font-weight: 700;
        font-size: 5.1rem;
        margin-top: 1.2rem;
      }
    }

    &__buy-banner {
      margin-top: 6.4rem;
    }
    &__balance {
      margin-top: 6.4rem;
      margin-bottom: -6rem;
      &__label {
        color: var(--muted);
        font-weight: 400;
      }
      &__value {
        font-size: 2.8rem;
        font-weight: 600;
        line-height: 1.4;
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

        &__label {
          margin-bottom: 0.3rem;
          color: var(--muted);
        }

        &__value {
          font-weight: 600;
        }
      }
    }

    &__chains {
      &__item {
        &__asset {
          flex: 1 1 0%;
          display: flex;
          align-items: center;

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
    margin-left: 3.2rem;

    &__swap {
      width: 80%;
    }

    &__buy {
      margin-top: 2.6rem;
      width: 80%;
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

      &__title {
        font-size: 2.8rem;
        font-weight: 700;
      }
    }

    &__wrapper {
      margin-top: 3.2rem;
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
