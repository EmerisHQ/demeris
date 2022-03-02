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
            <div class="text-0 font-normal text-muted">{{ unstakingAssetValue }} <Ticker :name="denom" /></div>
          </div>
        </h2>
      </div>

      <Button
        :name="$t('components.stakeTable.stake')"
        variant="link"
        :full-width="false"
        @click="() => goStakeActionPage(StakingActions.STAKE)"
      >
        <Icon name="PlusIcon" :icon-size="1.5" />
      </Button>
    </div>

    <!-- Staking info banner -->
    <template v-if="!isStakingAssetExist">
      <div
        class="stake__banner relative border border-border rounded-2xl p-6 flex flex-col justify-between bg-right bg-no-repeat"
      >
        <div class="flex-1 max-w-xs">
          <h3 class="text-1 font-bold">{{ $t('components.stakeTable.earnRewards') }} <Ticker :name="denom" /></h3>
          <p class="text-muted leading-copy mt-3">
            <i18n-t scope="global" keypath="components.stakeTable.lockUpAndEarnRewards">
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
      <template v-if="validatorList.length > 0">
        <div v-show="selectedTab === 1">
          <!-- staking reward table -->
          <table class="w-full table-fixed mt-8 text-right">
            <colgroup>
              <col width="32%" />
              <col width="38%" />
              <col width="20%" />
              <col width="8%" />
            </colgroup>

            <!-- table body -->
            <tbody>
              <!-- claim rewards -->
              <tr
                v-if="totalRewardsAmount"
                class="group cursor-pointer shadow-card hover:shadow-dropdown transition-shadow rounded-xl"
                @click="goStakeActionPage(StakingActions.CLAIM)"
              >
                <td class="py-6 flex items-center rounded-l-xl bg-surface">
                  <div class="inline-flex items-center ml-6 mr-4">
                    <img src="@/assets/svg/icons/reward.svg" />
                  </div>
                  <span class="text-left overflow-hidden overflow-ellipsis whitespace-nowrap font-medium">
                    {{ $t('components.stakeTable.claimRewards') }}
                  </span>
                </td>
                <td class="text-right text-muted bg-surface">
                  {{ totalRewardsDisplayAmount }} <Ticker :name="denom" />
                </td>
                <td class="text-right font-medium bg-surface">
                  <div class="flex justify-end">
                    +<Price :amount="{ denom: denom, amount: totalRewardsAmount }" :show-dash="false" />
                  </div>
                </td>
                <td class="text-right rounded-r-xl bg-surface">
                  <Icon
                    name="CaretRightIcon"
                    :icon-size="1"
                    class="ml-4 p-2 self-stretch text-muted group-hover:text-text transition-colors"
                  />
                </td>
              </tr>

              <!-- staked validators -->
              <tr v-for="validator of stakingBalances" :key="validator.validator_address">
                <td class="py-6 flex items-center transition">
                  <div class="inline-flex items-center mr-4">
                    <ValidatorBadge
                      :validator="
                        validatorList.find((x) => keyHashfromAddress(x.operator_address) == validator.validator_address)
                      "
                      class="w-8 h-8 rounded-full bg-fg z-1"
                    />
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
                  <tippy
                    placement="right-start"
                    trigger="click"
                    delay="0"
                    :interactive="true"
                    :arrow="false"
                    :offset="[-24, 0]"
                  >
                    <Button :full-width="false" variant="link" class="text-muted hover:text-text w-12" rounded>
                      <Icon name="ThreeDotsIcon" :icon-size="1.5" />
                    </Button>
                    <template #content>
                      <div class="w-64 text-0 font-normal text-left -mx-3">
                        <div
                          class="py-2 px-6"
                          :class="{
                            'text-muted': validatorList.find(
                              (x) => keyHashfromAddress(x.operator_address) == validator.validator_address,
                            ).jailed,
                            'cursor-pointer hover:text-link': !validatorList.find(
                              (x) => keyHashfromAddress(x.operator_address) == validator.validator_address,
                            ).jailed,
                          }"
                          @click="
                            () => {
                              if (
                                !validatorList.find(
                                  (x) => keyHashfromAddress(x.operator_address) == validator.validator_address,
                                ).jailed
                              ) {
                                goStakeActionPage(StakingActions.STAKE, validator.validator_address);
                              }
                            }
                          "
                        >
                          {{ $t('components.stakeTable.stake') }}
                        </div>
                        <div
                          class="py-2 px-6 cursor-pointer hover:text-link"
                          @click="goStakeActionPage(StakingActions.UNSTAKE, validator.validator_address)"
                        >
                          {{ $t('components.stakeTable.unstake') }}
                        </div>
                        <div
                          class="py-2 px-6 cursor-pointer hover:text-link"
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
        <div v-show="selectedTab === 2">
          <table class="w-full table-fixed mt-8 text-right">
            <colgroup>
              <col width="30%" />
              <col width="20%" />
              <col width="25%" />
              <col width="25%" />
            </colgroup>

            <!-- table body -->
            <tbody>
              <!-- staked validators -->
              <template v-for="unbondingBalance of unbondingBalances">
                <tr
                  v-for="(entry, index) of unbondingBalance.entries"
                  :key="unbondingBalance.validator_address + '_' + index"
                  class="group"
                >
                  <td class="py-6 flex items-center transition">
                    <div class="inline-flex items-center mr-4">
                      <ValidatorBadge
                        :validator="
                          validatorList.find(
                            (x) => keyHashfromAddress(x.operator_address) == unbondingBalance.validator_address,
                          )
                        "
                        class="w-8 h-8 rounded-full bg-fg z-1"
                      />
                    </div>
                    <span class="text-left overflow-hidden overflow-ellipsis whitespace-nowrap font-medium">
                      {{ getValidatorMoniker(unbondingBalance.validator_address) }}
                    </span>
                  </td>
                  <td class="text-left text-muted">
                    <div class="inline-flex items-center">
                      <TimeIcon class="mr-2" />
                      <span>
                        {{ getTimeToString(entry.completion_time) }}
                      </span>
                    </div>
                  </td>
                  <td class="text-right text-muted">{{ getDisplayAmount(entry.balance) }} <Ticker :name="denom" /></td>
                  <td class="text-right font-medium">
                    <Price :amount="{ denom: denom, amount: entry.balance }" />
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </template>
      <SkeletonLoader v-else width="100%" height="300px" />
    </template>
  </div>
</template>
<script lang="tsx">
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { computed, defineComponent, ref, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import CircleSymbol from '@/components/common/CircleSymbol.vue';
import TimeIcon from '@/components/common/Icons/TimeIcon.vue';
import SkeletonLoader from '@/components/common/loaders/SkeletonLoader.vue';
import Price from '@/components/common/Price.vue';
import Ticker from '@/components/common/Ticker.vue';
import ValidatorBadge from '@/components/common/ValidatorBadge.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import useDenoms from '@/composables/useDenoms';
import useStaking from '@/composables/useStaking';
import { GlobalDemerisGetterTypes } from '@/store';
import { StakingActions } from '@/types/actions';
import { chainAddressfromKeyhash, keyHashfromAddress } from '@/utils/basic';

export default defineComponent({
  components: {
    Button,
    CircleSymbol,
    Ticker,
    Price,
    Icon,
    ValidatorBadge,
    SkeletonLoader,
    TimeIcon,
  },
  props: {
    denom: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    dayjs.extend(relativeTime);
    const { useDenom } = useDenoms();
    const { getValidatorsByBaseDenom, getChainDisplayInflationByBaseDenom, getStakingRewardsByBaseDenom } =
      useStaking();
    const router = useRouter();
    const { t } = useI18n({ useScope: 'global' });
    const { stakingBalancesByChain, unbondingDelegationsByChain } = useAccount();
    const store = useStore();
    /* variables */
    const selectedTab = ref<number>(1);
    const assetStakingAPY = ref<number | string>('-');
    const stakingRewardsData = ref(null);
    const validatorList = ref<Array<any>>([]);
    const propsRef = toRefs(props);

    const chain_name = computed(() =>
      store.getters[GlobalDemerisGetterTypes.API.getChainNameByBaseDenom]({ denom: propsRef.denom.value }),
    );
    watch(
      () => chain_name.value,
      async (newVal, _) => {
        if (newVal) {
          assetStakingAPY.value = await getChainDisplayInflationByBaseDenom(propsRef.denom.value);
          validatorList.value = await getValidatorsByBaseDenom(propsRef.denom.value);
        }
      },
      { immediate: true },
    );

    /* computeds */
    const isSignedIn = computed(() => {
      return store.getters[GlobalDemerisGetterTypes.USER.isSignedIn];
    });
    const assetPrecision = computed(() => {
      return (
        store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({
          name: propsRef.denom.value,
        }) ?? '6'
      );
    });
    const stakingBalances = computed(() => {
      return stakingBalancesByChain(
        store.getters[GlobalDemerisGetterTypes.API.getChainNameByBaseDenom]({ denom: propsRef.denom.value }),
      );
    });
    const getTimeToString = (isodate: string) => {
      return dayjs().to(dayjs(isodate));
    };
    const unbondingBalances = computed(() => {
      return unbondingDelegationsByChain(
        store.getters[GlobalDemerisGetterTypes.API.getChainNameByBaseDenom]({ denom: propsRef.denom.value }),
      );
    });
    const operator_prefix = computed(() => {
      return store.getters[GlobalDemerisGetterTypes.API.getBech32Config]({
        chain_name: store.getters[GlobalDemerisGetterTypes.API.getChainNameByBaseDenom]({
          denom: propsRef.denom.value,
        }),
      }).val_addr;
    });
    const totalStakedAssetDisplayAmount = computed(() => {
      const total = new BigNumber(totalRewardsAmount.value).plus(
        stakingBalances.value.reduce(
          (total, currentValue) => total.plus(new BigNumber(currentValue.amount)),
          new BigNumber(0),
        ),
      );
      if (total.isLessThan(1)) {
        return '<' + (1 / 10 ** assetPrecision.value).toFixed(assetPrecision.value);
      } else {
        const totalDisplay = total.dividedBy(10 ** assetPrecision.value);
        return totalDisplay.toFixed(assetPrecision.value);
      }
    });
    const isStakingAssetExist = computed(() => {
      return stakingBalances.value.length > 0;
    });
    const isUnstakingAssetExist = computed(() => {
      return unbondingBalances.value.length > 0;
    });
    const stakingButtonName = computed(() => {
      return t('components.stakeTable.stakeAsset', { ticker: useDenom(props.denom).tickerName.value });
    });
    const totalRewardsAmount = computed(() => {
      return parseFloat(stakingRewardsData.value?.total ?? 0);
    });
    const totalRewardsDisplayAmount = computed(() => {
      if (totalRewardsAmount.value < 1) {
        return '<' + (1 / 10 ** assetPrecision.value).toFixed(assetPrecision.value);
      }
      return new BigNumber(totalRewardsAmount.value ?? 0)
        .dividedBy(10 ** assetPrecision.value)
        .toFixed(assetPrecision.value);
    });
    const unstakingAssetValue = computed(() => {
      return unbondingBalances.value
        .map((x) => x.entries)
        .flat()
        .reduce((acc, entry) => {
          return acc.plus(new BigNumber(entry.balance));
        }, new BigNumber(0))
        .dividedBy(10 ** assetPrecision.value)
        .toString();
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
    const getValidatorData = (address: string): any => {
      validatorList.value.some((vali) => {
        if (keyHashfromAddress(vali.operator_address) === address) {
          return vali;
        }
      });
    };
    const goStakeActionPage = (action: string, valAddress = '') => {
      const validatorAddress = chainAddressfromKeyhash(operator_prefix.value, valAddress);
      switch (action) {
        case StakingActions.STAKE:
        case StakingActions.UNSTAKE:
        case StakingActions.SWITCH:
          router.push(`/staking/${props.denom}/${action}${validatorAddress ? `/${validatorAddress}` : ''}`);
          return;
        default:
          router.push(`/staking/${props.denom}/${StakingActions.CLAIM}`);
          return;
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
      getTimeToString,
      isUnstakingAssetExist,
      isStakingAssetExist,
      unbondingBalances,
      stakingButtonName,
      selectedTab,
      totalRewardsAmount,
      totalRewardsDisplayAmount,
      unstakingAssetValue,
      totalStakedAssetDisplayAmount,
      assetStakingAPY,
      getDisplayAmount,
      getValidatorData,
      stakingBalances,
      goStakeActionPage,
      getValidatorMoniker,
      getTabClass,
      selectTab,
      keyHashfromAddress,
      validatorList,
    };
  },
});
</script>
<style scoped>
* >>> .tippy-box {
  background: var(--surface);
  color: var(--text);
}
</style>
