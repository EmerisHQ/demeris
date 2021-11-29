<template>
  <div>
    <!-- Title -->
    <div v-if="isStakingAssetExist" class="flex">
      <h2 class="text-2 font-bold cursor-pointer" :class="getTabClass(1)" @click="selectTab(1)">
        {{ $t('components.stakeTable.staking') }}
        <div class="text-0 font-normal text-muted">
          <Price :amount="{ denom: denom, amount: totalRewardsAmount }" />
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
        <table class="w-full table-fixed mt-8">
          <colgroup>
            <col width="29%" />
            <col width="29%" />
            <col width="29%" />
            <col width="13%" />
          </colgroup>

          <!-- table body -->
          <tbody>
            <tr v-if="totalRewardsAmount" class="group cursor-pointer shadow-card">
              <td class="py-6 flex items-center group-hover:bg-fg transition">
                <div class="inline-flex items-center ml-6 mr-4">
                  <CircleSymbol :denom="denom" class="w-8 h-8 rounded-full bg-fg z-1" />
                </div>
                <span class="text-left overflow-hidden overflow-ellipsis whitespace-nowrap font-medium">
                  {{ $t('components.stakeTable.claimRewards') }}
                </span>
              </td>
              <td class="text-right group-hover:bg-fg transition">
                {{ totalRewardsDisplayAmount }} <Ticker :name="denom" />
              </td>
              <td class="text-right group-hover:bg-fg transition">
                <Price :amount="{ denom: denom, amount: totalRewardsAmount }" />
              </td>
              <td class="text-right group-hover:bg-fg transition">test4</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-show="selectedTab === 2">unstaking</div>
    </template>
  </div>
</template>
<script lang="tsx">
import { computed, defineComponent, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Price from '@/components/common/Price.vue';
import Ticker from '@/components/common/Ticker.vue';
import Button from '@/components/ui/Button.vue';
import CurrencyDisplay from '@/components/ui/CurrencyDisplay.vue';
import useAccount from '@/composables/useAccount';
import useDenoms from '@/composables/useDenoms';
import useStaking from '@/composables/useStaking';
import { useStore } from '@/store';

export default defineComponent({
  components: {
    Button,
    CircleSymbol,
    Ticker,
    CurrencyDisplay,
    Price,
  },
  props: {
    denom: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { useDenom } = useDenoms();
    const { getChainDisplayInflationByBaseDenom, getStakingRewardsByBaseDenom, getChainNameByBaseDenom } = useStaking();
    const router = useRouter();
    const { t } = useI18n({ useScope: 'global' });
    const { stakingBalancesByChain } = useAccount();
    const store = useStore();

    /* variables */
    const selectedTab = ref<number>(1);
    const assetStakingAPY = ref<number | string>('-');
    const stakingRewardsData = ref(null);

    /* created */
    (async () => {
      assetStakingAPY.value = await getChainDisplayInflationByBaseDenom(props.denom);
    })();

    /* computeds */
    const isSignedIn = computed(() => {
      return store.getters['demeris/isSignedIn'];
    });
    const assetPrecision = computed(() => {
      return (
        store.getters['demeris/getDenomPrecision']({
          name: props.denom,
        }) ?? '6'
      );
    });
    const stakingBalances = computed(() => {
      return stakingBalancesByChain(getChainNameByBaseDenom(props.denom));
    });
    const isStakingAssetExist = computed(() => {
      return stakingBalances.value.length > 0;
    });
    const isUnstakingAssetExist = computed(() => {
      // TODO: implement unstaking asset check
      return true;
    });
    const stakingButtonName = computed(() => {
      return t('components.stakeTable.stakeAsset', { ticker: useDenom(props.denom).tickerName.value });
    });
    const totalRewardsAmount = computed(() => {
      return parseFloat(stakingRewardsData.value?.total);
    });
    const totalRewardsDisplayAmount = computed(() => {
      return Math.trunc(totalRewardsAmount.value) / 10 ** assetPrecision.value;
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

    /* watch */
    watch(
      () => isSignedIn.value,
      async () => {
        stakingRewardsData.value = await getStakingRewardsByBaseDenom(props.denom);
      },
      { immediate: true },
    );

    return {
      isUnstakingAssetExist,
      isStakingAssetExist,
      stakingButtonName,
      selectedTab,
      totalRewardsAmount,
      totalRewardsDisplayAmount,
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
