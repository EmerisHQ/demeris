<template>
  <AppLayout>
    <div class="wrapper">
      <div class="portfolio">
        <div class="portfolio__total">
          <div class="portfolio__total__text">Total balance:</div>
          <div class="portfolio__total__value">
            <TotalPrice :balances="balances" />
          </div>
        </div>
        <div class="portfolio__assets">
          <div class="portfolio__assets__header">
            <div class="portfolio__assets__header__text">Assets</div>
            <router-link class="portfolio__assets__header__link" to="/assets">See all <ArrowRightIcon /></router-link>
          </div>
          <div class="portfolio__assets__table>">
            <AssetsTable
              :balances="balances"
              display-style="compact"
              class="assets__table"
              :show-headers="false"
              :limit-rows="4"
              @row-click="openAssetPage"
            />
          </div>
        </div>
        <div class="portfolio__pools">
          <div class="portfolio__pools__header">
            <div class="portfolio__pools__header__text">Pools</div>
            <router-link class="portfolio__pools__header__link" to="/pools">See all <ArrowRightIcon /></router-link>
          </div>
          <div class="portfolio__pools__cards">
            <Pools :pools="invested.length > 0 ? invested : toppools" />
          </div>
        </div>
      </div>
      <div>
        <LiquiditySwap />
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { computed } from '@vue/runtime-core';
import { useRouter } from 'vue-router';

import AssetsTable from '@/components/assets/AssetsTable';
import ArrowRightIcon from '@/components/common/Icons/ArrowRightIcon.vue';
import TotalPrice from '@/components/common/TotalPrice.vue';
import Pools from '@/components/liquidity/Pools.vue';
import LiquiditySwap from '@/components/liquidity/Swap.vue';
import useAccount from '@/composables/useAccount';
import usePools from '@/composables/usePools';
import AppLayout from '@/layouts/AppLayout.vue';
export default {
  name: 'Portfolio',
  components: { AppLayout, LiquiditySwap, TotalPrice, AssetsTable, ArrowRightIcon, Pools },
  setup() {
    const router = useRouter();
    const { balances } = useAccount();
    const { pools } = usePools();
    const openAssetPage = (asset: Record<string, string>) => {
      router.push({ name: 'Asset', params: { denom: asset.denom } });
    };
    const invested = computed(() => {
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
    const toppools = computed(() => {
      return pools.value.slice(0, 2);
    });
    return { balances, openAssetPage, pools, invested, toppools };
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  max-width: 1136px;
  margin: 0 auto;

  .portfolio {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 0;
    margin-right: 6rem;
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
      &__header {
        font-size: 2.8rem;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
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
        margin-bottom: 2rem;
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
    }
  }
}
</style>
