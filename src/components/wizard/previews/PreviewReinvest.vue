<template>
  <List>
    <!-- Total rewards -->
    <ListItem :label="$t(`components.previews.claim.totalRewards`)">
      <div class="flex justify-end items-center">
        <div class="text-right">
          <AmountDisplay
            class="font-medium"
            :class="context === 'widget' ? 'text-0' : 'text-1'"
            :amount="{ amount: rewardsAmount, denom: baseDenom }"
          />
          <div class="block text-muted -text-1" :class="{ 'mt-0.5': context !== 'widget' }">
            <Price :amount="{ denom: baseDenom, amount: rewardsAmount }" />
          </div>
        </div>
        <CircleSymbol :denom="baseDenom" size="md" class="ml-3" />
      </div>
    </ListItem>

    <!-- Validator list -->
    <ListItem :label="$t(`components.previews.claim.validators`)">
      <div
        v-for="vali of validators"
        :key="vali.validator_address"
        class="flex justify-end items-center mb-4 last:mb-0"
      >
        <div class="text-right">
          <div class="block text-muted -text-1" :class="{ 'mt-0.5': context !== 'widget' }">
            <div class="text-text text-0">
              {{ vali.moniker }}
            </div>
            <template v-if="validators.length > 1">
              <AmountDisplay
                class="font-medium"
                :amount="{ amount: parseInt(vali.reward).toString(), denom: baseDenom }"
              />
              {{ $t(`components.previews.claim.rewards`) }}
            </template>
          </div>
        </div>
        <ValidatorBadge :validator="getValidator(vali.validator_address)" class="ml-3" />
      </div>
    </ListItem>

    <!-- Transaction fees -->
    <ListItem :label="$t(`components.previews.claim.transactionFee`)">
      <div class="flex justify-end items-center">
        <div class="text-right">
          <template v-for="(fee, chain) in fees" :key="'fee_' + chain">
            <template v-for="(feeAmount, denom) in fee" :key="'fee' + chain + denom">
              <AmountDisplay :amount="{ amount: feeAmount.toString(), denom }" />
            </template>
          </template>
        </div>
      </div>
    </ListItem>
  </List>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, toRefs } from 'vue';
import { useRoute } from 'vue-router';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Price from '@/components/common/Price.vue';
import ValidatorBadge from '@/components/common/ValidatorBadge.vue';
import { List, ListItem } from '@/components/ui/List';
import useStaking from '@/composables/useStaking';
import * as Actions from '@/types/actions';
import { getSumOfRewards } from '@/utils/basic';

interface Props {
  step?: Actions.Step;
  response?: Actions.Step;
  fees: Actions.FeeTotals;
  context?: 'default' | 'widget';
  isReceipt: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  step: undefined,
  response: undefined,
  context: 'default',
  isReceipt: false,
});

const route = useRoute();
const { getValidatorsByBaseDenom } = useStaking();

const baseDenom = route.params.denom as string;
const validatorList = ref([]);
const propsRef = toRefs(props);
const rewardsAmount = computed(() => {
  return getSumOfRewards(propsRef.step.value.transactions[0].data.total, baseDenom);
});
const validators = computed(() => {
  return propsRef.step.value.transactions[0].data.rewards;
});
onMounted(async () => {
  validatorList.value = await getValidatorsByBaseDenom(baseDenom);
});
const getValidator = (val_address) => {
  return validatorList.value.find((x) => x.operator_address == val_address);
};
</script>

<style lang="scss" scoped></style>
