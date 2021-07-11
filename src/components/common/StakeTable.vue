<script setup lang="tsx">
import type { PropType } from 'vue';
import { defineComponent, defineProps } from 'vue';

import Button from '@/components/ui/Button.vue';
import type { StakingBalance } from '@/types/api';

defineProps({
  stakingBalances: {
    type: Array as PropType<StakingBalance[]>,
    default: () => [],
  },
});

const StakeBanner = defineComponent({
  name: 'StakeBanner',
  setup() {
    return () => (
      <div class="stake__banner">
        <div class="stake__banner__wrapper">
          <p class="stake__banner__title">Earn rewards by staking ATOM</p>
          <p class="stake__banner__subtitle">
            Lock up your ATOM and earn passive income with an average <span class="w-bold">9.7% APY</span>.
          </p>
        </div>

        <div class="stake__banner__controls">
          <Button status="secondary" name="Coming soon" class="stake__banner__controls__button" />
        </div>
      </div>
    );
  },
});
</script>

<template>
  <div class="stake">
    <StakeBanner v-if="!stakingBalances.length" />

    <template v-else>
      <div class="stake__rewards">
        <span class="stake__rewards__label">Rewards</span>
        <span class="stake__rewards__label__amount">0.495 ATOM</span>
        <span class="stake__rewards__label__balance">+$10.15</span>
      </div>

      <ul class="stake__list">
        <li class="stake__list__item">
          <div class="stake__list__item__validator">
            <span class="stake__list__item__validator__avatar"> N </span>
            <span class="stake__list__item__validator__name"> nylira </span>
          </div>

          <span class="stake__list__item__amount"> 82.46 ATOM </span>

          <div class="stake__list__item__balance">
            <span class="stake__list__item__balance__value">$1,690.50</span>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>

<style lang="scss">
.stake {
  &__banner {
    background: var(--bg);
    border: 1px solid var(--border-trans);
    border-radius: 1.6rem;
    padding: 2.4rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 23.5rem;
    width: 100%;
    background-image: url('~@/assets/images/stake-atom.png');
    background-repeat: no-repeat;
    background-position: center right;

    &__wrapper {
      flex: 1 1 0%;
      width: 60%;
    }

    &__title {
      font-size: 2.1rem;
      font-weight: 700;
    }

    &__subtitle {
      color: var(--muted);
      margin-top: 1.2rem;
    }

    &__controls {
      display: inline-flex;

      .button {
        color: var(--inactive);
        cursor: not-allowed;
      }
    }
  }
}
</style>
