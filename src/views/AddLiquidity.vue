<template>
  <div class="add-liquidity">
    <header class="add-liquidity__header">
      <button v-if="showBackButton" class="add-liquidity__header__button" @click="goBack">
        <Icon name="ArrowLeftIcon" :icon-size="1.6" />
      </button>

      <nav class="add-liquidity__steps">
        <span
          v-for="label of steps"
          :key="label"
          class="add-liquidity__steps__item"
          :class="{ 'add-liquidity__steps__item--active': step === label }"
        >
          {{ label }}
        </span>
      </nav>

      <button class="add-liquidity__header__button close-button" @click="onClose">
        <Icon name="CloseIcon" :icon-size="1.6" />
      </button>
    </header>

    <main class="add-liquidity__wrapper">
      <h2 class="add-liquidity__title s-2">Add Liquidity</h2>

      <div v-if="pool" class="add-liquidity__pool">
        <div class="add-liquidity__pool__pair">
          <span class="add-liquidity__pool__pair__avatar token-a" />
          <span class="add-liquidity__pool__pair__avatar token-b" />
        </div>

        <span class="add-liquidity__pool__name">{{ formatPoolName(pool) }} Pool</span>
      </div>

      <div class="add-liquidity__content">
        <template v-if="step === 'amount'">
          <div class="add-liquidity__input input-a elevation-card">
            <div class="add-liquidity__input__main">
              <label class="add-liquidity__input__label s-minus">Supply</label>
              <div>
                <select />
                <input placeholder="0" />
              </div>
            </div>

            <div v-if="params.coinA.chain_name" class="add-liquidity__input__details">
              <div class="add-liquidity__input__details__from">
                From <span class="w-bold">{{ params.coinA.chain_name }}</span>
              </div>

              <div class="add-liquidity__input__details__available">
                1210.01 <span class="uppercase">{{ params.coinA.amount.denom }}</span> available
              </div>
            </div>
          </div>

          <div class="add-liquidity__price">
            <template v-if="pool">
              1 <span class="uppercase">{{ params.coinA.amount.denom }}</span> : 1.78
              <span class="uppercase">{{ params.coinB.amount.denom }}</span>
            </template>
            <span v-else>Price</span>
          </div>

          <div class="add-liquidity__input input-b elevation-card">
            <div class="add-liquidity__input__main">
              <label class="add-liquidity__input__label s-minus">Supply</label>
              <div>
                <select />
                <input placeholder="0" />
              </div>
            </div>

            <div v-if="params.coinB.chain_name" class="add-liquidity__input__details">
              <div class="add-liquidity__input__details__from">
                From <span class="w-bold">{{ params.coinB.chain_name }}</span>
              </div>

              <div class="add-liquidity__input__details__available">
                1210.01 <span class="uppercase">{{ params.coinB.amount.denom }}</span> available
              </div>
            </div>
          </div>

          <div class="add-liquidity__controls">
            <Button name="Continue" />
          </div>
        </template>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { reactive, ref } from '@vue/reactivity';
import { computed, watch } from '@vue/runtime-core';
import { useRoute, useRouter } from 'vue-router';

import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import usePools from '@/composables/usePools';
import { AddLiquidityParams } from '@/types/actions';

export default {
  name: 'AddLiquidity',
  components: { Icon, Button },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const poolId = computed(() => route.params.id);

    const { pools, formatPoolName } = usePools();

    const pool = computed(() => {
      if (!poolId.value) {
        return;
      }

      return pools.value.find((pool) => pool.id === +poolId.value);
    });

    const step = ref('amount');
    const steps = ['amount', 'review', 'send'];

    const params = reactive<AddLiquidityParams>({
      pool_id: undefined,
      coinA: {
        amount: {
          denom: '',
          amount: 0,
        },
        chain_name: '',
      },
      coinB: {
        amount: {
          denom: '',
          amount: 0,
        },
        chain_name: '',
      },
    });

    const onClose = () => {
      router.push('/');
    };

    watch(
      pool,
      () => {
        if (!pool.value) {
          return;
        }

        // @ts-ignore
        params.pool_id = pool.value.id;
        params.coinA.amount.denom = pool.value.reserveCoinDenoms[0];
        params.coinA.chain_name = 'Cosmos Hub';

        params.coinB.amount.denom = pool.value.reserveCoinDenoms[1];
        params.coinB.chain_name = 'Kava';
      },
      {
        immediate: true,
      },
    );

    return {
      pool,
      params,
      formatPoolName,
      step,
      steps,
      onClose,
    };
  },
};
</script>

<style lang="scss" scoped>
.add-liquidity {
  position: relative;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 3rem 4rem;
    background: var(--bg);

    &__button {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.8rem;
      padding: 0.6rem;
    }

    .close-button {
      margin-left: auto;
    }
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 3.1rem;
  }

  &__steps {
    flex: 1 1 0%;
    display: flex;
    align-items: center;
    justify-content: center;

    &__item {
      text-transform: capitalize;
      color: var(--inactive);
      font-weight: 600;
      cursor: default;

      & + & {
        margin-left: 4.8rem;
      }
      &--active {
        color: var(--text);
      }
    }
  }

  &__content {
    width: 100%;
    max-width: 38rem;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__pool {
    margin-top: 0.8rem;

    &__pair {
      display: inline-flex;
      align-items: center;
      margin-right: 0.8rem;

      &__avatar {
        width: 1.4rem;
        height: 1.4rem;
        border-radius: 2.4rem;
        background: #ddd;

        &.token-a {
          z-index: 1;
        }

        & + & {
          margin-left: -0.4rem;
          background: #aaa;
        }
      }
    }

    &__name {
      color: var(--muted);
    }
  }

  &__price {
    padding: 0.8rem 1.2rem;
    font-size: 1.2rem;
    color: var(--muted);
    border-radius: 2.4rem;
    background: #e6e6e6;
    display: inline-block;
    margin: 1.5rem auto;
    z-index: 1;
  }

  &__controls {
    margin-top: 3.2rem;
    width: 100%;
  }

  &__input {
    width: 100%;
    border-radius: 10px;
    background: var(--bg);
    z-index: 1;

    &.input-a {
      margin-top: 3.2rem;

      &:after {
        position: absolute;
        content: '';
        display: block;
        height: 10rem;
        width: 1px;
        background: #e6e6e6;
        left: 50%;
      }
    }

    &__main {
      padding: 1.6rem;
      display: flex;
      flex-direction: column;
    }

    &__label {
      color: var(--muted);
      margin-bottom: 1.6rem;
    }

    &__details {
      padding: 1.2rem 1.6rem;
      font-size: 1.2rem;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;

      &__available {
        color: var(--muted);
      }
    }
  }
}
</style>
