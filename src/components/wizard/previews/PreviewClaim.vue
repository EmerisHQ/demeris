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
        <CircleSymbol :denom="rewardsDenom" size="md" class="ml-3" />
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
                :amount="{ amount: parseInt(vali.reward).toString(), denom: rewardsDenom }"
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

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref, toRefs } from 'vue';
import { useRoute } from 'vue-router';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Price from '@/components/common/Price.vue';
import ValidatorBadge from '@/components/common/ValidatorBadge.vue';
import { List, ListItem } from '@/components/ui/List';
import useStaking from '@/composables/useStaking';
import * as Actions from '@/types/actions';
import { getSumOfRewards } from '@/utils/basic';

export default defineComponent({
  name: 'PreviewClaim',

  components: {
    AmountDisplay,
    Price,
    CircleSymbol,
    List,
    ListItem,
    ValidatorBadge,
  },

  props: {
    step: {
      type: Object as PropType<Actions.Step>,
      default: undefined,
    },
    response: {
      type: Object as PropType<Actions.Step>,
      default: undefined,
    },
    fees: {
      type: Object as PropType<Actions.FeeTotals>,
      required: true,
    },
    context: {
      type: String as PropType<'default' | 'widget'>,
      default: 'default',
    },
    isReceipt: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },
  },

  setup(props: any) {
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
    return {
      baseDenom,
      rewardsAmount,
      validators,
      getValidator,
    };
  },
});
</script>

<style lang="scss" scoped></style>
