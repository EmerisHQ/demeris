<template>
  <List class="border px-8 rounded-lg">
    <!-- Total rewards -->
    <ListItem :label="$t(`components.previews.claim.totalRewards`)">
      <div class="flex justify-end items-center">
        <div class="text-right">
          <AmountDisplay
            class="font-medium"
            :class="context === 'widget' ? 'text-0' : 'text-1'"
            :amount="{ amount: rewardsAmount, denom: rewardsDenom }"
          />
          <div class="block text-muted -text-1" :class="{ 'mt-0.5': context !== 'widget' }">
            <Price :amount="{ denom: rewardsDenom, amount: rewardsAmount }" />
          </div>
        </div>
        <CircleSymbol :denom="'uatom'" :chain-name="'cosmos-hub'" size="md" class="ml-3" />
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
            <AmountDisplay class="font-medium" :amount="{ amount: parseInt(vali.reward), denom: rewardsDenom }" />
            {{ $t(`components.previews.claim.rewards`) }}
          </div>
        </div>
        <!-- TODO -->
        <!-- <CircleSymbol :denom="'uatom'" :chain-name="'cosmos-hub'" size="md" class="ml-3" /> -->
      </div>
    </ListItem>

    <!-- Transaction fees -->
    <ListItem :label="$t(`components.previews.claim.transactionFee`)">
      <div class="flex justify-end items-center">
        <div class="text-right">
          <AmountDisplay class="text-0" :amount="{ amount: fee, denom: rewardsDenom }" />
        </div>
        <CircleSymbol :denom="'uatom'" :chain-name="'cosmos-hub'" size="md" class="ml-3" />
      </div>
    </ListItem>
  </List>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Price from '@/components/common/Price.vue';
import { List, ListItem } from '@/components/ui/List';
import * as Actions from '@/types/actions';

export default defineComponent({
  name: 'PreviewClaim',

  components: {
    AmountDisplay,
    Price,
    CircleSymbol,
    List,
    ListItem,
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
  },

  setup(props: any) {
    const rewardsDenom = computed(() => {
      return props.step.transactions[0].data.total.replace(/[0-9.,]+/gi, '');
    });
    const rewardsAmount = computed(() => {
      return parseInt(props.step.transactions[0].data.total);
    });
    const validators = computed(() => {
      return props.step.transactions[0].data.rewards;
    });
    const fee = computed(() => {
      return Object.values(Object.values(props.fees)[0]);
    });

    return {
      rewardsDenom,
      rewardsAmount,
      validators,
      fee,
    };
  },
});
</script>

<style lang="scss" scoped></style>
