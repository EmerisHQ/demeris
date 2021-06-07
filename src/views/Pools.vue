<template>
  <AppLayout>
    <section class="pools">
      <nav class="pools__nav">
        <router-link to="/pools" class="pools__nav__item">My Pools</router-link>
        <router-link to="/pools" custom>
          <span class="pools__nav__item pools__nav__item--inactive">All Pools</span>
        </router-link>
      </nav>

      <div class="pools__subheader">
        <Search v-model:keyword="keyword" />
        <Button name="Add liquidity" @click="openAddLiqudityPage" />
      </div>

      <table class="pools-table">
        <colgroup>
          <col width="30%" />
        </colgroup>

        <thead>
          <tr>
            <th class="text-left">Token Pair</th>
            <th class="text-right">Your share</th>
            <th class="text-right">Liquidity</th>
            <th class="text-right">APY</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="pool of filteredPools" :key="pool.id" class="pools-table__row">
            <td class="pools-table__row__pair">
              <div class="pools-table__row__pair__pool">
                <span class="pools-table__row__pair__pool__avatar token-a" />
                <span class="pools-table__row__pair__pool__avatar token-b" />
              </div>
              <span class="pools-table__row__pair__name w-bold">{{ formatPoolName(pool) }}</span>
            </td>
            <td class="text-right">$1,000.50 (0,1%)</td>
            <td class="text-right">$100,000.50 (0,1%)</td>
            <td class="text-right">10%</td>
            <td class="pools-table__row__controls text-right">
              <router-link
                :to="{ name: 'WithdrawLiquidity', params: { id: pool.id } }"
                class="pools-table__row__controls__button elevation-button"
              >
                -
              </router-link>
              <router-link
                :to="{ name: 'AddLiquidity', params: { id: pool.id } }"
                class="pools-table__row__controls__button elevation-button"
              >
                +
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </AppLayout>
</template>

<script lang="ts">
import { ref } from '@vue/reactivity';
import { computed } from '@vue/runtime-core';
import { useRouter } from 'vue-router';

import Search from '@/components/common/Search.vue';
import Button from '@/components/ui/Button.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Pool } from '@/types/actions';

import poolsFixture from '../../tests/fixtures/pools.json';

export default {
  name: 'Pools',
  components: { AppLayout, Search, Button },

  setup() {
    const router = useRouter();
    const keyword = ref<string>('');

    const pools: Pool[] = poolsFixture.pools.map((pool) => ({
      id: +pool.id,
      typeId: pool.type_id,
      reserveCoinDenoms: pool.reserve_coin_denoms,
      reserveAccountAddress: pool.reserve_account_address,
      poolCoinDenom: pool.pool_coin_denom,
    }));

    const filteredPools = computed(() => {
      return pools.filter((pool) => pool.reserveCoinDenoms.join().indexOf(keyword.value) !== -1);
    });

    const formatPoolName = (pool: Pool) => {
      return pool.reserveCoinDenoms.join('/').toUpperCase();
    };

    const openAddLiqudityPage = () => {
      router.push({ name: 'AddLiquidity' });
    };

    return {
      filteredPools,
      keyword,
      openAddLiqudityPage,
      formatPoolName,
    };
  },
};
</script>

<style lang="scss" scoped>
.pools {
  display: flex;
  flex-direction: column;
  font-size: 1.6rem;

  &__subheader {
    margin-top: 2.4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__nav {
    display: flex;

    &__item {
      font-size: 2.8rem;
      font-weight: 600;
      margin-right: 2.4rem;

      &--inactive {
        color: rgba(0, 0, 0, 0.33);
        cursor: not-allowed;
      }
    }
  }
}

.pools-table {
  margin-top: 2.4rem;
  width: 100%;
  table-layout: fixed;

  .text-right {
    text-align: right;
  }

  .text-left {
    text-align: left;
  }

  th {
    color: var(--muted);
    vertical-align: middle;
    font-size: 1.3rem;
    font-weight: 400;
    padding-bottom: 1.2rem;
  }

  &__row {
    &__pair {
      padding: 2rem 0;
      display: flex;
      align-items: center;

      &__pool {
        display: inline-flex;
        align-items: center;
        margin-right: 1.6rem;

        &__avatar {
          width: 3.2rem;
          height: 3.2rem;
          border-radius: 2.4rem;
          background: #ddd;

          &.token-a {
            z-index: 1;
          }

          & + & {
            margin-left: -0.6rem;
            background: #aaa;
          }
        }
      }

      &__name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
      }
    }

    &__controls {
      &__button {
        width: 4rem;
        height: 4rem;
        border-radius: 2.6rem;
        font-size: 2rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;

        & + & {
          margin-left: 1.6rem;
        }
      }
    }
  }
}
</style>
