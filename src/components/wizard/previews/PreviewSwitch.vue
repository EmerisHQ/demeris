<template>
  <List>
    <!-- Pay/Receive -->

    <ListItem v-if="tx" :size="size" :label="$t('components.previews.switch.stakeLbl')">
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
    <ListItem v-if="tx" :size="size" :label="$t('components.previews.switch.fromLbl')">
      <div class="flex justify-end items-center">
        {{ getValidatorMoniker(validatorSrcAddress) }}
        <ValidatorBadge :size="size" :validator="getValidator(validatorSrcAddress)" />
      </div>
    </ListItem>

    <ListItem v-if="tx" :size="size" :label="$t('components.previews.switch.toLbl')">
      <div class="flex justify-end items-center">
        {{ getValidatorMoniker(validatorDstAddress) }}
        <ValidatorBadge :size="size" :validator="getValidator(validatorDstAddress)" />
      </div>
    </ListItem>
    <!-- Fee -->
    <ListItem
      :size="size"
      :label="$t('components.previews.switch.feeLbl')"
      :hint="$t('components.previews.switch.feeLblHint')"
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
import { onMounted, ref, toRefs } from 'vue';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Price from '@/components/common/Price.vue';
import ValidatorBadge from '@/components/common/ValidatorBadge.vue';
import { List, ListItem } from '@/components/ui/List';
import useStaking from '@/composables/useStaking';
import * as Actions from '@/types/actions';
import { DesignSizes } from '@/types/util';

interface Props {
  step: Actions.Step;
  fees: Record<string, EmerisBase.Amount>;
  context?: 'default' | 'widget';
  isReceipt?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  context: 'default',
  isReceipt: false,
});

const { getValidatorsByBaseDenom } = useStaking();

const propsRef = toRefs(props);
const validators = ref([]);
const tx = propsRef.step.value.transactions[0];
const baseDenom = (tx.data as Actions.RestakeData).amount.denom;
const chainName = (tx.data as Actions.RestakeData).chain_name;
const totalStaked = (tx.data as Actions.RestakeData).amount.amount;
const validatorSrcAddress = tx.data.validatorSrcAddress;
const validatorDstAddress = tx.data.validatorDstAddress;

onMounted(async () => {
  validators.value = await getValidatorsByBaseDenom(baseDenom);
});
const getValidatorMoniker = (address) => {
  return validators.value.find((x) => x.operator_address == address)?.moniker ?? 'unknown';
};

const getValidator = (address) => {
  return validators.value.find((x) => x.operator_address == address);
};
const size: DesignSizes = props.context === 'default' ? 'md' : 'sm';
</script>
<style lang="scss" scoped></style>
