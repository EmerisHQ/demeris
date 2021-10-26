<template>
  <div>
    <!-- Title -->
    <div v-if="isStakingAssetExist" class="flex">
      <h2 class="text-2 font-bold cursor-pointer" :class="getTabClass(1)" @click="selectTab(1)">
        {{ $t('components.stakeTable.staking') }}
        <div class="text-0 font-normal text-muted">
          <CurrencyDisplay :value="stakingAssetTotalValue" />
        </div>
      </h2>
      <h2
        v-if="isUnstakingAssetExist"
        class="text-2 font-bold ml-6 cursor-pointer"
        :class="getTabClass(2)"
        @click="selectTab(2)"
      >
        {{ $t('components.stakeTable.unstaking') }}
        <div class="text-0 font-normal text-muted">
          <CurrencyDisplay :value="unstakingAssetValue" />
        </div>
      </h2>
    </div>

    <!-- Staking info banner -->
    <template v-if="!isStakingAssetExist">
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
            <i18n-t keypath="components.stakeTable.lockUpAndEarnRewards">
              <template #ticker>
                <Ticker :name="denom" />
              </template>
              <template #apy>
                <strong>{{ assetStakingAPY }}% {{ $t('components.stakeTable.apy') }}.</strong>
              </template>
            </i18n-t>
          </p>
        </div>

        <Button
          variant="secondary"
          :name="stakingButtonName"
          class="mt-8"
          :click-function="stakeAsset"
          :full-width="false"
        />

        <div class="absolute top-1/2 right-32 transform -translate-y-1/2">
          <CircleSymbol :denom="denom" size="xl" />
        </div>
      </div>
    </template>

    <template v-else>
      <div v-show="selectedTab === 1">
        <div class="stake__rewards">
          <span class="stake__rewards__label">{{ $t('components.stakeTable.reward') }}</span>
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
      </div>
      <div v-show="selectedTab === 2">unstaking</div>
    </template>
  </div>
</template>
<script lang="tsx">
import { computed, defineComponent, PropType, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Ticker from '@/components/common/Ticker.vue';
import Button from '@/components/ui/Button.vue';
import CurrencyDisplay from '@/components/ui/CurrencyDisplay.vue';
import useDenoms from '@/composables/useDenoms';
import type { StakingBalance } from '@/types/api';

export default defineComponent({
  components: {
    Button,
    CircleSymbol,
    Ticker,
    CurrencyDisplay,
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
  setup(props) {
    const { useDenom } = useDenoms();
    const router = useRouter();
    const { t } = useI18n({ useScope: 'global' });
    const selectedTab = ref<number>(1);

    /* computeds */
    const isStakingAssetExist = computed(() => {
      return props.stakingBalances.length > 0;
    });
    const isUnstakingAssetExist = computed(() => {
      // TODO: implement unstaking asset check
      return true;
    });
    const stakingButtonName = computed(() => {
      return t('components.stakeTable.stakeAsset', { ticker: useDenom(props.denom).tickerName.value });
    });
    const assetStakingAPY = computed(() => {
      // TODO
      return 9.7;
    });
    const stakingAssetTotalValue = computed(() => {
      //TODO: this value includes a staking reward too
      return 100;
    });
    const unstakingAssetValue = computed(() => {
      //TODO
      return 77;
    });

    /* functions */
    const stakeAsset = () => {
      router.push(`/stake/${props.denom}`);
    };
    const selectTab = (tabNumber?: number): void => {
      selectedTab.value = tabNumber;
    };
    const getTabClass = (tabNumber: number): string => {
      return selectedTab.value === tabNumber ? '' : 'text-inactive';
    };

    return {
      isUnstakingAssetExist,
      isStakingAssetExist,
      stakingButtonName,
      selectedTab,
      stakingAssetTotalValue,
      unstakingAssetValue,
      assetStakingAPY,
      getTabClass,
      stakeAsset,
      selectTab,
    };
  },
});
</script>
<style lang="scss" scoped>
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
