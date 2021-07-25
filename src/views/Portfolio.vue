<template>
  <AppLayout>
    <div class="wrapper">
      <div class="portfolio">
        <div class="portfolio__total">
          <div class="portfolio__total__text text-muted">{{ $t('context.assets.totalBalance') }}</div>
          <div class="portfolio__total__value text-5 font-bold">
            <TotalPrice :balances="balances" small-decimals />
          </div>
        </div>
        <div class="portfolio__assets">
          <div class="portfolio__assets__header">
            <h2 class="portfolio__assets__header__text text-2 font-bold">{{ $t('context.assets.title') }}</h2>
            <router-link class="portfolio__assets__header__link font-medium" to="/assets">
              {{ balances.length ? $t('generic_cta.discoverMore') : $t('generic_cta.seeall') }} <ArrowRightIcon />
            </router-link>
          </div>

<<<<<<< HEAD
          <div class="portfolio__assets__table>">
=======
          <MoonpayBanner
            v-if="!balances.length"
            title="Add crypto to your account"
            size="large"
            class="portfolio__assets__buy-banner"
          />
          <div v-else class="portfolio__assets__table>">
>>>>>>> style: convert 10px rem to 16px rem
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
<<<<<<< HEAD
            <h2 class="portfolio__pools__header__text">{{ $t('context.pools.title') }}</h2>
            <router-link v-if="poolsInvested.length" class="portfolio__pools__header__link" to="/pools">
=======
            <h2 class="portfolio__pools__header__text text-2 font-bold">{{ $t('context.pools.title') }}</h2>
            <router-link v-if="poolsInvested.length" class="portfolio__pools__header__link font-medium" to="/assets">
>>>>>>> style: convert 10px rem to 16px rem
              {{ $t('generic_cta.discoverMore') }} <ArrowRightIcon />
            </router-link>
          </div>

          <div v-if="poolsInvested.length" class="portfolio__pools__cards">
            <Pools :pools="poolsInvested" />
          </div>

          <div v-else class="portfolio__pools__empty">
            <p class="portfolio__pools__empty__description text-muted">{{ $t('context.pools.empty') }}</p>
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
        <LiquiditySwap class="portfolio__aside__swap" />
        <Intro />
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
      const poolsCopy = JSON.parse(JSON.stringify(pools.value));
      return poolsCopy.filter((item) => balances.value.some((item2) => item.pool_coin_denom == item2.base_denom));
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
      &__value {
        margin-top: 0.5rem;
      }
      margin-bottom: 3.75rem;
    }
    &__assets {
      &__buy-banner {
        margin-top: 1.5rem;
        margin-bottom: 1.5rem;
      }
      &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.75rem;

        &__link {
          display: flex;
          align-items: center;
          svg {
            margin-left: 0.625rem;
          }
        }
      }
      margin-bottom: 3.75rem;
    }
    &__pools {
      &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;

        &__link {
          display: flex;
          align-items: center;
          svg {
            margin-left: 0.625rem;
          }
        }
      }

      &__empty {
        padding: 2rem;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        &__button {
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
  }
}
</style>
