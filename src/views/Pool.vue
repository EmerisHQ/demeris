<template>
  <AppLayout>
    <div class="pool">
      <div class="pool__main">
        <section class="pool__main__stats">
          <span class="pool__main__stats__subtitle">Gravity DEX Pool</span>
          <div class="pool__main__stats__header">
            <h2 class="pool__main__stats__name s-2">{{ formatPoolName(pool) }}</h2>
          </div>
          <h1 class="pool__main__stats__supply">$130,040,429</h1>
        </section>

        <section class="pool__main__assets">
          <h2 class="pool__main__assets__title s-2">Underlying assets</h2>

          <table class="pool__main__assets__table assets-table">
            <thead>
              <tr>
                <th class="text-left">Asset</th>
                <th class="text-right">Quantity</th>
                <th class="text-right">Price</th>
                <th class="text-right">Allocation</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="balance of reserveBalances" :key="balance.base_denom" class="assets-table__row">
                <td class="assets-table__row__denom">
                  <div class="assets-table__row__denom__avatar" />
                  <span class="w-bold">{{ $filters.getCoinName(balance.base_denom) }}</span>
                </td>
                <td class="text-right">{{ balance.amount }} {{ $filters.getCoinName(balance.base_denom) }}</td>
                <td class="text-right">$20.50</td>
                <td class="text-right w-bold">65,020.75</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section v-if="relatedPools.length" class="pool__main__pools">
          <div class="pool__main__pools__header">
            <h2 class="s-2">Other pools</h2>
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
          <div class="pool-equity elevation-panel">
            <div class="pool-equity__header">
              <h2 class="s-2 w-bold">Equity</h2>
              <Icon name="ThreeDotsIcon" />
            </div>

            <div class="pool-equity__stats">
              <div class="pool-equity__stats__avatar" />
              <div class="pool-equity__stats__wrapper">
                <p class="pool-equity__stats__amount w-bold">1.56 G-AK-LP</p>
                <p class="pool-equity__stats__balance s-2 w-bold">$1,420.50</p>
                <span class="pool-equity__stats__share s-minus">0.01% of pool</span>
              </div>
            </div>

            <div class="pool-equity__supply">
              <Button name="Add liquidity" @click="addLiquidityHandler" />
            </div>

            <div class="pool-equity__assets">
              <span class="pool-equity__assets__label s-minus">Assets provided</span>
              <ul class="pool-equity__assets__list">
                <li class="pool-equity__assets__list__item">
                  <div class="pool-equity__assets__list__item__avatar" />
                  <span class="pool-equity__assets__list__item__denom w-bold">30 ATOM</span>
                  <span>$615.00</span>
                </li>
                <li class="pool-equity__assets__list__item">
                  <div class="pool-equity__assets__list__item__avatar" />
                  <span class="pool-equity__assets__list__item__denom w-bold">44 KAVA</span>
                  <span>$615.00</span>
                </li>
              </ul>
            </div>

            <div class="pool-equity__withdraw">
              <Button name="Withdraw" status="secondary" @click="withdrawLiquidityHandler" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import Pools from '@/components/liquidity/Pools.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import usePools from '@/composables/usePools';
import AppLayout from '@/layouts/AppLayout.vue';
import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';

export default defineComponent({
  name: 'Pool',

  components: {
    AppLayout,
    Icon,
    Button,
    Pools,
  },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    const { poolById, formatPoolName, poolsByDenom } = usePools();

    const pool = computed(() => {
      return poolById(+route.params.id);
    });

    const reserveBalances = computed(() => {
      // return store.getters['demeris/getBalances']({ address: pool.value.reserveAccountAddress });
      const balances = [
        {
          base_denom: pool.value.reserve_coin_denoms[0],
          amount: 100,
        },
        {
          base_denom: pool.value.reserve_coin_denoms[1],
          amount: 200,
        },
      ];

      return balances;
    });

    const relatedPools = computed(() => {
      return [
        ...poolsByDenom(pool.value.reserve_coin_denoms[0]),
        ...poolsByDenom(pool.value.reserve_coin_denoms[1]),
      ].filter((item) => item.id !== pool.value.id);
    });

    const updateReserveBalances = () => {
      store.dispatch(GlobalDemerisActionTypes.GET_BALANCES, {
        params: { address: pool.value.reserve_account_address },
      });
    };

    const addLiquidityHandler = () => {
      router.push({ name: 'AddLiquidity', params: { id: pool.value.id } });
    };

    const withdrawLiquidityHandler = () => {
      router.push({ name: 'WithdrawLiquidity', params: { id: pool.value.id } });
    };

    watch(pool, updateReserveBalances, { immediate: true });

    return {
      router,
      route,
      pool,
      reserveBalances,
      relatedPools,
      addLiquidityHandler,
      withdrawLiquidityHandler,
      formatPoolName,
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
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
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
      width: 90%;
    }
  }
}

.assets-table {
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
    font-size: 1.2rem;
    font-weight: 400;
    padding-bottom: 1.2rem;
  }

  &__row {
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
      }
    }
  }
}

.pool-equity {
  width: 100%;
  background: red;
  padding: 2.4rem;
  border-radius: 1.6rem;
  background: linear-gradient(98.5deg, rgba(195, 152, 252, 0.06) 0%, rgba(253, 131, 140, 0.06) 100%), #ffffff;

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
      width: 3.2rem;
      height: 3.2rem;
      border-radius: 2.6rem;
      margin-right: 1.2rem;
      background: linear-gradient(135deg, #c99aff 15.62%, #ff737b 85.42%);
      box-shadow: 0px 4px 10.6667px rgba(255, 116, 124, 0.28);
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
