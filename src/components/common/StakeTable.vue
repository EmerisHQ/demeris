<script lang="tsx">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Ticker from '@/components/common/Ticker.vue';
import Button from '@/components/ui/Button.vue';
import type { StakingBalance } from '@/types/api';

export default defineComponent({
  components: {
    Button,
    CircleSymbol,
    Ticker,
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
  <div>
    <template v-if="!stakingBalances.length">
      <div
        class="
          stake__banner
          relative
          border border-border
          rounded-2xl
          p-6
          flex flex-col
          justify-between
          bg-right bg-no-repeat
        "
      >
        <div class="flex-1 max-w-xs">
          <h3 class="text-1 font-bold">{{ $t('components.stakeTable.earnRewards') }} <Ticker :name="denom" /></h3>
          <p class="text-muted leading-copy mt-3">
            {{ $t('components.stakeTable.lockUp') }} <Ticker :name="denom" /> {{ $t('components.stakeTable.andEarn') }}
          </p>
        </div>

        <Button variant="secondary" name="Coming soon" class="mt-8" disabled :full-width="false" />

        <div class="absolute top-1/2 right-32 transform -translate-y-1/2">
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
    background-image: url('~@/assets/images/gold-ephemeris-ring-1.png'),
      url('~@/assets/images/gold-ephemeris-ring-2.png');
    background-size: 230px, 290px;
    background-position: 88%, 93%;
  }

  // Moved from old styles in Asset.vue
  &__rewards {
    margin-top: 2rem;
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
    background: var(--fg);
    display: flex;
    align-items: center;

    &__label {
      flex: 1;
      font-weight: 600;
    }

    &__amount {
      margin-left: 1rem;
      color: var(--muted);
    }

    &__balance {
      margin-left: 1rem;
      font-weight: 600;
      text-align: right;
    }

    &__button {
      margin-left: 1rem;
      padding: 0.75rem 1.5rem;
      background-color: black;
      color: white;
      font-weight: 600;
      border-radius: 1.25rem;
    }
  }

  &__item {
    &__validator {
      flex: 1 1 0%;
      display: flex;
      align-items: center;

      &__avatar {
        border-radius: 0.5rem;
        width: 2.5rem;
        height: 2.5rem;
        background-color: rgba(0, 0, 0, 0.1);
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &__name {
        margin-left: 1rem;
        flex: 1 1 0%;
        font-weight: bold;
      }
    }

    &__amount {
      margin-left: 1rem;
      width: 33.33%;
      text-align: right;
      color: var(--muted);
    }

    &__balance {
      margin-left: 1rem;
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
      margin-left: 1rem;
      padding: 0.25rem;
    }
  }
}
</style>
