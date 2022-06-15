<template>
  <List>
    <!-- Pay/Receive -->

    <ListItem v-if="tx" :size="size" :label="$t('components.previews.stake.stakeLbl')">
      <div class="flex justify-end items-center">
        <div class="text-right">
          <AmountDisplay
            class="font-medium"
            :class="context === 'widget' ? 'text-0' : 'text-1'"
            :amount="{ amount: totalStaked, denom: baseDenom }"
          />
          <div class="block text-muted -text-1" :class="{ 'mt-0.5': context !== 'widget' }">
            <Price :amount="{ amount: totalStaked, denom: baseDenom }" />
          </div>
        </div>
        <CircleSymbol :denom="baseDenom" :chain-name="chainName" size="md" class="ml-3" />
      </div>
    </ListItem>

    <!-- Price  -->
    <ListItem v-if="tx" :size="size" :label="$t('components.previews.stake.validatorsLbl')">
      <template v-for="(stake, index) in tx" :key="'stake' + index">
        <div class="flex justify-end items-center pb-5">
          <div class="flex flex-col text-right items-end">
            <div>{{ getValidatorMoniker(stake.validatorAddress) }}</div>
            <div v-if="!isReceipt"><AmountDisplay :amount="stake.amount" /></div>
            <div v-if="getStakingBalance(stake.validatorAddress) != 0" class="text-muted -text-1">
              Staked
              <AmountDisplay :amount="{ amount: getStakingBalance(stake.validatorAddress) + '', denom: baseDenom }" />
            </div>
          </div>
          <div>
            <ValidatorBadge :validator="getValidator(stake.validatorAddress)" size="md" class="ml-3" />
          </div>
        </div>
      </template>
    </ListItem>

    <!-- Fee -->
    <ListItem
      :size="size"
      :label="$t('components.previews.stake.feeLbl')"
      :hint="$t('components.previews.stake.feeLblHint')"
    >
      <template v-for="(fee, chain) in fees" :key="'fee_' + chain">
        <template v-for="(feeAmount, denom) in fee" :key="'fee' + chain + denom">
          <AmountDisplay :amount="{ amount: feeAmount.toString(), denom }" />
        </template>
      </template>
    </ListItem>
  </List>
</template>
<script setup lang="ts">
import { EmerisBase } from '@emeris/types';
import BigNumber from 'bignumber.js';
import { computed, onMounted, ref, toRefs } from 'vue';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Price from '@/components/common/Price.vue';
import ValidatorBadge from '@/components/common/ValidatorBadge.vue';
import { List, ListItem } from '@/components/ui/List';
import useAccount from '@/composables/useAccount';
import useChains from '@/composables/useChains';
import useStaking from '@/composables/useStaking';
import * as Actions from '@/types/actions';
import { DesignSizes } from '@/types/util';
import { keyHashfromAddress } from '@/utils/basic';

interface Props {
  step: Actions.Step;
  fees: Record<string, EmerisBase.Amount>;
  context?: 'default' | 'widget';
  isReceipt: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  context: 'default',
  isReceipt: false,
});

const { getChainNameByBaseDenom } = useChains();
const { getValidatorsByBaseDenom } = useStaking();
const propsRef = toRefs(props);
const { stakingBalancesByChain } = useAccount();
const validators = ref([]);
const tx = propsRef.step.value.transactions[0];
const chainName = (tx.data as Actions.StakeData[])[0].chain_name;
const baseDenom = (tx.data as Actions.StakeData[])[0].amount.denom;
const totalStaked = (tx.data as Actions.StakeData[])
  .reduce((acc, txdata) => {
    return acc.plus(new BigNumber(txdata.amount.amount));
  }, new BigNumber(0))
  .toString();

let chainNameToGetStakingBalances = ref<string>(null);
onMounted(async () => {
  chainNameToGetStakingBalances.value = await getChainNameByBaseDenom(baseDenom);
  validators.value = await getValidatorsByBaseDenom(baseDenom);
});

const stakingBalances = computed(() => {
  return stakingBalancesByChain(chainNameToGetStakingBalances.value);
});
const getStakingBalance = (address) => {
  return stakingBalances.value.find((x) => x.validator_address == keyHashfromAddress(address))?.amount ?? 0;
};
const getValidatorMoniker = (address) => {
  return validators.value.find((x) => x.operator_address == address)?.moniker ?? 'unknown';
};
const size: DesignSizes = props.context === 'default' ? 'md' : 'sm';
const getValidator = (address) => {
  return validators.value.find((x) => x.operator_address == address);
};
</script>
<style lang="scss" scoped></style>
