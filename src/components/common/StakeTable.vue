<script lang="tsx">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Denom from '@/components/common/Denom.vue';
import Button from '@/components/ui/Button.vue';
import type { StakingBalance } from '@/types/api';

export default defineComponent({
  components: {
    Button,
    CircleSymbol,
    Denom,
  },
  props: {
    denom: {
      type: String,
      required: true,
    },
    stakingBalances: {
      type: Array as PropType<StakingBalance[]>,
      default: () => [],
    },
  },
});
</script>

<template>
  <div class="stake">
    <template v-if="!stakingBalances.length">
      <div class="stake__banner">
        <div class="stake__banner__wrapper">
          <p class="stake__banner__title">Earn rewards by staking <Denom :name="denom" /></p>
          <p class="stake__banner__subtitle">
            Lock up your <Denom :name="denom" /> and earn passive income with an average
            <span class="w-bold">9.7% APY</span>.
          </p>
        </div>

        <div class="stake__banner__controls">
          <Button status="secondary" name="Coming soon" class="stake__banner__controls__button" />
        </div>

        <div class="stake__banner__symbol">
          <CircleSymbol :denom="denom" size="xl" />
        </div>
      </div>
    </template>

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
    border: 1px solid var(--border);
    border-radius: 1.6rem;
    padding: 2.4rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 23.5rem;
    width: 100%;
    background-image: url('~@/assets/images/stake-rings.png');
    background-repeat: no-repeat;
    background-position: center right;
    position: relative;

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

    &__symbol {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translate(-95%, -50%);
    }
  }
}
</style>
