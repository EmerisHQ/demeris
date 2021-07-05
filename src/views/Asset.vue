<template>
  <AppLayout>
    <div class="asset">
      <div class="asset__main">
        <div class="asset__main__back">
          <router-link :to="{ name: 'Assets' }" class="asset__main__back__button">
            <span class="asset__main__back__button__icon"><ArrowLeftIcon /></span>
            <span>All assets</span>
          </router-link>
        </div>

        <!-- Stats -->

        <section class="asset__main__stats">
          <div class="asset__main__stats__container">
            <div class="asset__main__stats__container__left">
              <p class="asset__main__stats__container__left__token">
                <AmountDisplay :amount="{ amount: totalAmount, denom }" />
              </p>
              <p class="asset__main__stats__container__left__balance">
                <Price :amount="{ amount: totalAmount, denom: denom }" />
              </p>
              <!--<span class="asset__main__stats__container__left__trending">
                <span>15% (+$1,719.71)</span>
              </span>//-->
            </div>

            <dl class="asset__main__stats__container__right">
              <div class="asset__main__stats__container__right__available">
                <dt>Available</dt>
                <dd>$1,310.36</dd>
              </div>

              <div class="asset__main__stats__container__right__price">
                <dt>Price</dt>
                <dd><Price :amount="{ denom: denom, amount: null }" /></dd>
              </div>
            </dl>
          </div>
        </section>

        <!-- Chains -->

        <section class="asset__main__chains asset__list">
          <div class="asset__list__header">
            <h2 class="asset__list__header__title">Chains</h2>
            <button class="asset__list__header__button">
              <PlusIcon class="asset__list__header__button__icon" />
            </button>
          </div>

          <ul class="asset__list__wrapper">
            <li v-for="asset of assets" :key="asset.address" class="asset__list__item asset__main__chains__item">
              <div class="asset__main__chains__item__asset">
                <span class="asset__main__chains__item__asset__avatar" />
                <span class="asset__main__chains__item__asset__denom"><ChainName :name="asset.on_chain" /></span>
              </div>
              <span class="asset__main__chains__item__amount"><AmountDisplay :amount="{ amount: asset.amount, denom }" /></span>
              <div class="asset__main__chains__item__balance">
                <span class="asset__main__chains__item__balance__value">
                  <Price :amount="{ amount: asset.amount, denom }" />
                </span>
                <button class="asset__main__chains__item__more">
                  <Icon name="SendIcon" :icon-size="1.2" />
                </button>
              </div>
            </li>
          </ul>
        </section>

        <!-- TODO: Staking -->

        <section v-if="false" class="asset__main__staking asset__list">
          <div class="asset__list__header">
            <h2 class="asset__list__header__title">Staking</h2>
            <button class="asset__list__header__button">
              <PlusIcon class="asset__list__header__button__icon" />
            </button>
          </div>

          <div class="asset__main__staking__rewards">
            <span class="asset__main__staking__rewards__label">Rewards</span>
            <span class="asset__main__staking__rewards__amount">0.495 ATOM</span>
            <span class="asset__main__staking__rewards__balance">+$10.15</span>
            <button class="asset__main__staking__rewards__button">Claim</button>
          </div>

          <ul class="asset__list__wrapper">
            <li class="asset__list__item asset__main__staking__item">
              <div class="asset__main__staking__item__validator">
                <span class="asset__main__staking__item__validator__avatar"> N </span>
                <span class="asset__main__staking__item__validator__name"> nylira </span>
              </div>

              <span class="asset__main__staking__item__amount"> 82.46 ATOM </span>

              <div class="asset__main__staking__item__balance">
                <span class="asset__main__staking__item__balance__value">$1,690.50</span>
                <button class="asset__main__staking__item__more"><Icon name="CaretDownIcon" :icon-size="1.6" /></button>
              </div>
            </li>
          </ul>
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
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { parseCoins } from '@cosmjs/launchpad';
import { computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import ArrowLeftIcon from '@/components/common/Icons/ArrowLeftIcon.vue';
import PlusIcon from '@/components/common/Icons/PlusIcon.vue';
import Price from '@/components/common/Price.vue';
import Pools from '@/components/liquidity/Pools.vue';
import LiquiditySwap from '@/components/liquidity/Swap.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import usePools from '@/composables/usePools';
import AppLayout from '@/layouts/AppLayout.vue';
export default defineComponent({
  name: 'Asset',

  components: {
    AmountDisplay,
    ChainName,
    AppLayout,
    Icon,
    Price,
    PlusIcon,
    ArrowLeftIcon,
    LiquiditySwap,
    Pools,
  },

  setup() {
    const route = useRoute();
    const denom = computed(() => route.params.denom as string);

    const { balancesByDenom } = useAccount();
    const { poolsByDenom } = usePools();

    const assets = computed(() => balancesByDenom(denom.value));
    const pools = computed(() => poolsByDenom(denom.value));

    const totalAmount = computed(() => {
      return assets.value.reduce((acc, item) => acc + parseInt(parseCoins(item.amount)[0].amount), 0);
    });

    return { denom, assets, pools, totalAmount };
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

    &__back {
      &__button {
        display: flex;
        align-items: center;
        font-weight: 600;
        padding: 0.8rem 0;

        &__icon {
          margin-right: 0.4rem;

          svg {
            width: 2rem;
            height: 2rem;
          }
        }
      }
    }

    &__stats {
      margin-top: 3.2rem;
      display: flex;
      flex-direction: column;

      &__container {
        display: flex;

        &__left {
          display: flex;
          flex-direction: column;

          &__token {
            font-weight: 700;
            font-size: 2.8rem;
            line-height: 1;
          }

          &__balance {
            margin-top: 0.8rem;
            font-weight: 700;
            font-size: 6.7rem;
            line-height: 1.3;
          }

          &__trending {
            margin-top: 0.8rem;
            font-weight: 500;
            color: rgb(6, 126, 62);
          }
        }

        &__right {
          margin-left: 6rem;
          display: flex;
          flex-direction: column;

          dt {
            color: var(--muted);
          }

          dd {
            margin-top: 0.3rem;
            font-weight: 600;
            font-size: 2.1rem;
          }

          &__price {
            margin-top: 3.2rem;
          }
        }
      }
    }

    &__chains {
      &__item {
        &__asset {
          flex: 1 1 0%;
          display: flex;
          align-items: center;

          &__avatar {
            width: 3.2rem;
            height: 3.2rem;
            border-radius: 2.4rem;
            background-color: rgba(0, 0, 0, 0.1);
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
    align-items: flex-start;
    justify-content: flex-end;
    margin-left: 3.2rem;

    &__swap {
      width: 80%;
    }
  }

  &__list {
    margin-top: 7rem;
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

      &__button {
        padding: 1rem;

        &__icon {
          width: 2.2rem;
          height: 2.2rem;
        }
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

  &__list + &__list {
    margin-top: 7rem;
  }
}
</style>
