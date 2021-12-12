<template>
  <div>
    <!-- Title -->
    <div v-if="isStakingAssetExist" class="flex justify-between">
      <div class="flex">
        <h2 class="text-2 font-bold cursor-pointer" :class="getTabClass(1)" @click="selectTab(1)">
          {{ $t('components.stakeTable.staking') }}
          <div class="text-0 font-normal text-muted">{{ totalStakedAssetDisplayAmount }} <Ticker :name="denom" /></div>
        </h2>
        <h2
          v-if="isUnstakingAssetExist"
          class="text-2 font-bold ml-6 cursor-pointer"
          :class="getTabClass(2)"
          @click="selectTab(2)"
        >
          {{ $t('components.stakeTable.unstaking') }}
          <div class="text-0 font-normal text-muted">
            <div class="text-0 font-normal text-muted">
              {{ totalStakedAssetDisplayAmount }} <Ticker :name="denom" />
            </div>
          </div>
        </h2>
      </div>

      <Button
        :name="$t('components.stakeTable.stake')"
        variant="link"
        :full-width="false"
        @click="() => goStakeActionPage(StakingActions.STAKE)"
      >
        <Icon name="PlusIcon" :icon-size="2" />
      </Button>
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
          :click-function="() => goStakeActionPage(StakingActions.STAKE)"
          :full-width="false"
        />

        <div class="absolute top-1/2 right-32 transform -translate-y-1/2">
          <CircleSymbol :denom="denom" size="xl" />
        </div>
      </div>
    </template>

    <template v-else>
      <div v-show="selectedTab === 1">
        <!-- staking reward table -->
        <table class="w-full table-fixed mt-8 text-right">
          <colgroup>
            <col width="29%" />
            <col width="29%" />
            <col width="29%" />
            <col width="13%" />
          </colgroup>

          <!-- table body -->
          <tbody>
            <!-- claim rewards -->
            <tr
              v-if="totalRewardsAmount"
              class="group cursor-pointer shadow-card rounded-xl"
              @click="goStakeActionPage(StakingActions.CLAIM)"
            >
              <td class="py-6 flex items-center">
                <div class="inline-flex items-center ml-6 mr-4">
                  <img src="@/assets/svg/icons/reward.svg" />
                </div>
                <span class="text-left overflow-hidden overflow-ellipsis whitespace-nowrap font-medium">
                  {{ $t('components.stakeTable.claimRewards') }}
                </span>
              </td>
              <td class="text-right text-muted">{{ totalRewardsDisplayAmount }} <Ticker :name="denom" /></td>
              <td class="text-right font-medium">
                <div class="flex justify-end">+<Price :amount="{ denom: denom, amount: totalRewardsAmount }" /></div>
              </td>
              <td class="text-right">
                <Icon
                  name="CaretRightIcon"
                  :icon-size="1"
                  class="ml-1.5 px-1.5 self-stretch text-muted group-hover:text-text transition-colors"
                />
              </td>
            </tr>

            <!-- staked validators -->
            <tr v-for="validator of stakingBalances" :key="validator.address" class="group cursor-pointer">
              <td class="py-6 flex items-center transition">
                <div class="inline-flex items-center mr-4">
                  <CircleSymbol :denom="denom" class="w-8 h-8 rounded-full bg-fg z-1" />
                </div>
                <span class="text-left overflow-hidden overflow-ellipsis whitespace-nowrap font-medium">
                  {{ getValidatorMoniker(validator.validator_address) }}
                </span>
              </td>
              <td class="text-right text-muted">{{ getDisplayAmount(validator.amount) }} <Ticker :name="denom" /></td>
              <td class="text-right font-medium">
                <Price :amount="{ denom: denom, amount: validator.amount }" />
              </td>
              <td class="text-right">
                <tippy placement="right" trigger="click" :interactive="true" :arrow="false" :offset="[0, -20]">
                  <Icon
                    name="ThreeDotsIcon"
                    :icon-size="1"
                    class="ml-1.5 px-1.5 self-stretch text-muted group-hover:text-text transition-colors"
                  />
                  <template #content>
                    <div class="w-64 text-0 font-normal text-left">
                      <div
                        class="py-2.5 px-6 cursor-pointer hover:text-text text-muted"
                        @click="goStakeActionPage(StakingActions.STAKE, validator.validator_address)"
                      >
                        {{ $t('components.stakeTable.stake') }}
                      </div>
                      <div
                        class="py-2.5 px-6 cursor-pointer hover:text-text text-muted"
                        @click="goStakeActionPage(StakingActions.UNSTAKE, validator.validator_address)"
                      >
                        {{ $t('components.stakeTable.unstake') }}
                      </div>
                      <div
                        class="py-2.5 px-6 cursor-pointer hover:text-text text-muted"
                        @click="goStakeActionPage(StakingActions.SWITCH, validator.validator_address)"
                      >
                        {{ $t('components.stakeTable.switchValidator') }}
                      </div>
                    </div>
                  </template>
                </tippy>
              </td>
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
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import useDenoms from '@/composables/useDenoms';
import useStaking from '@/composables/useStaking';
import { useStore } from '@/store';
import { StakingActions } from '@/types/actions';
import { keyHashfromAddress } from '@/utils/basic';

export default defineComponent({
  components: {
    Button,
    CircleSymbol,
    Ticker,
    Price,
    Icon,
  },
  props: {
    denom: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { useDenom } = useDenoms();
    const {
      getValidatorsByBaseDenom,
      getChainDisplayInflationByBaseDenom,
      getStakingRewardsByBaseDenom,
      getChainNameByBaseDenom,
    } = useStaking();
    const router = useRouter();
    const { t } = useI18n({ useScope: 'global' });
    const { stakingBalancesByChain } = useAccount();
    const store = useStore();

    /* variables */
    const selectedTab = ref<number>(1);
    const assetStakingAPY = ref<number | string>('-');
    const stakingRewardsData = ref(null);
    const validatorList = ref<Array<any>>([]);

    /* created */
    (async () => {
      assetStakingAPY.value = await getChainDisplayInflationByBaseDenom(props.denom);
      validatorList.value = await getValidatorsByBaseDenom(props.denom);
      console.log('validatorList', validatorList.value);
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
    const totalStakedAssetDisplayAmount = computed(() => {
      // console.log(stakingBalances.value)
      return (
        Math.trunc(
          (stakingBalances.value.reduce((total, currentValue) => total + Number(currentValue.amount), 0) /
            10 ** assetPrecision.value +
            totalRewardsDisplayAmount.value) *
            10 ** assetPrecision.value,
        ) /
        10 ** assetPrecision.value
      );
    });
    const isStakingAssetExist = computed(() => {
      return stakingBalances.value.length > 0;
    });
    const isUnstakingAssetExist = computed(() => {
      // TODO: implement unstaking asset check
      return false;
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
    const selectTab = (tabNumber?: number): void => {
      selectedTab.value = tabNumber;
    };
    const getTabClass = (tabNumber: number): string => {
      return selectedTab.value === tabNumber ? '' : 'text-inactive';
    };
    const getDisplayAmount = (amount: any): number => {
      return Number(amount) / 10 ** assetPrecision.value;
    };
    const getValidatorMoniker = (address: string): string => {
      let moniker;
      validatorList.value.some((vali) => {
        if (keyHashfromAddress(vali.operator_address) === address) {
          moniker = vali.moniker;
          return true;
        } else {
          return false;
        }
      });
      return moniker;
    };
    const goStakeActionPage = (action: string, validatorAddress = '') => {
      if (action === StakingActions.STAKE) {
        router.push(
          `/stake/${props.denom}?action=${StakingActions.STAKE}${
            validatorAddress ? `&validator_address=${validatorAddress}` : ''
          }`,
        );
      } else if (action === StakingActions.UNSTAKE) {
        router.push(
          `/stake/${props.denom}?action=${StakingActions.UNSTAKE}${
            validatorAddress ? `&validator_address=${validatorAddress}` : ''
          }`,
        );
      } else if (action === StakingActions.SWITCH) {
        router.push(
          `/stake/${props.denom}?action=${StakingActions.SWITCH}${
            validatorAddress ? `&validator_address=${validatorAddress}` : ''
          }`,
        );
      } else {
        router.push(`/stake/${props.denom}?action=${StakingActions.CLAIM}`);
      }
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
      StakingActions,
      isUnstakingAssetExist,
      isStakingAssetExist,
      stakingButtonName,
      selectedTab,
      totalRewardsAmount,
      totalRewardsDisplayAmount,
      unstakingAssetValue,
      totalStakedAssetDisplayAmount,
      assetStakingAPY,
      getDisplayAmount,
      stakingBalances,
      goStakeActionPage,
      getValidatorMoniker,
      getTabClass,
      selectTab,
    };
  },
});
</script>
<style scoped>
* >>> .tippy-box {
  background: var(--inverse);
  color: var(--text);
}
</style>
