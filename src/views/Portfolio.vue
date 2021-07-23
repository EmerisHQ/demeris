<template>
  <AppLayout>
    <div class="wrapper">
      <div class="portfolio">
        <div class="portfolio__total">
          <div class="portfolio__total__text">{{ $t('context.assets.totalBalance') }}</div>
          <div class="portfolio__total__value">
            <TotalPrice :balances="balances" />
          </div>
        </div>
        <div class="portfolio__assets">
          <div class="portfolio__assets__header">
            <h2 class="portfolio__assets__header__text">{{ $t('context.assets.title') }}</h2>
            <router-link class="portfolio__assets__header__link" to="/assets">
              {{ balances.length ? $t('generic_cta.discoverMore') : $t('generic_cta.seeall') }} <ArrowRightIcon />
            </router-link>
          </div>

          <div class="portfolio__assets__table>">
            <AssetsTable
              :balances="balances"
              :hide-zero-assets="true"
              variant="balance"
              class="assets__table"
              :show-headers="false"
              :limit-rows="4"
              @row-click="openAssetPage"
            />
          </div>

          <MoonpayBanner
            v-if="!balances.length"
            title="Add ATOM to your account"
            class="portfolio__assets__buy-banner"
          />
        </div>
        <div class="portfolio__pools">
          <div class="portfolio__pools__header">
            <h2 class="portfolio__pools__header__text">{{ $t('context.pools.title') }}</h2>
            <router-link v-if="poolsInvested.length" class="portfolio__pools__header__link" to="/assets">
              {{ $t('generic_cta.discoverMore') }} <ArrowRightIcon />
            </router-link>
          </div>

          <div v-if="poolsInvested.length" class="portfolio__pools__cards">
            <Pools :pools="poolsInvested" />
          </div>

          <div v-else class="portfolio__pools__empty">
            <p class="portfolio__pools__empty__description">{{ $t('context.pools.empty') }}</p>
            <Button
              status="secondary"
              class="portfolio__pools__empty__button"
              :name="$t('context.pools.explore')"
              @click="openPoolsPage"
            />
          </div>
        </div>
      </div>

      <div class="portfolio__aside">
        <Intro />
        <LiquiditySwap class="portfolio__aside__swap" />
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { computed } from '@vue/runtime-core';
import { useRouter } from 'vue-router';

import AssetsTable from '@/components/assets/AssetsTable';
import ArrowRightIcon from '@/components/common/Icons/ArrowRightIcon.vue';
import Intro from '@/components/common/Intro.vue';
import MoonpayBanner from '@/components/common/MoonpayBanner.vue';
import TotalPrice from '@/components/common/TotalPrice.vue';
import Pools from '@/components/liquidity/Pools.vue';
import LiquiditySwap from '@/components/liquidity/Swap.vue';
import Button from '@/components/ui/Button.vue';
import useAccount from '@/composables/useAccount';
import usePools from '@/composables/usePools';
import AppLayout from '@/layouts/AppLayout.vue';

export default {
  name: 'Portfolio',
  components: {
    AppLayout,
    Button,
    MoonpayBanner,
    LiquiditySwap,
    TotalPrice,
    AssetsTable,
    ArrowRightIcon,
    Pools,
    Intro,
  },

  setup() {
    const router = useRouter();
    const { balances } = useAccount();
    const { pools } = usePools();

    const openAssetPage = (asset: Record<string, string>) => {
      router.push({ name: 'Asset', params: { denom: asset.denom } });
    };

    const openPoolsPage = () => {
      router.push({ name: 'Pools' });
    };

    const poolsInvested = computed(() => {
      const bals = [];
      for (const balance of balances.value) {
        if (pools.value.length > 0) {
          let poolBalance = pools.value.find((x) => x.pool_coin_denom == balance.base_denom);
          if (poolBalance) {
            bals.push(poolBalance);
          }
        }
      }
      return bals;
    });

    return { balances, poolsInvested, openAssetPage, openPoolsPage };
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  justify-content: space-between;

  .portfolio {
    display: flex;
    flex-direction: column;
    width: 60%;

    &__total {
      &__text {
        opacity: 0.67;
        font-size: 1.6rem;
      }
      &__value {
        margin-top: 0.8rem;
        font-weight: 700;
        font-size: 6.7rem;
        line-height: 1.3;
      }
      margin-bottom: 6rem;
    }
    &__assets {
      &__buy-banner {
        margin-top: 2.6rem;
        margin-bottom: 2.6rem;
      }
      &__header {
        font-size: 2.8rem;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2.8rem;

        &__link {
          font-size: 1.6rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          svg {
            margin-left: 1rem;
          }
        }
      }
      margin-bottom: 6rem;
    }
    &__pools {
      &__header {
        font-size: 2.8rem;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2.6rem;

        &__link {
          font-size: 1.6rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          svg {
            margin-left: 1rem;
          }
        }
      }

      &__empty {
        padding: 3.2rem;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        &__description {
          color: var(--muted);
        }

        &__button {
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
  }
}
</style>
