<template>
  <List>
    <!-- Pay/Receive -->

    <ListItem direction="col">
      <ListItem v-if="tx" :size="size" :label="$t('components.previews.unstake.unstakeLbl')">
        <div class="flex justify-end items-center">
          <div class="text-right">
            <AmountDisplay
              class="font-medium"
              :class="context === 'widget' ? 'text-0' : 'text-1'"
              :amount="{ amount: unStaked, denom: baseDenom }"
            />
            <div class="block text-muted -text-1" :class="{ 'mt-0.5': context !== 'widget' }">
              <Price :amount="{ amount: unStaked, denom: baseDenom }" />
            </div>
          </div>
          <CircleSymbol :denom="baseDenom" :chain-name="chainName" size="md" class="ml-3" />
        </div>
      </ListItem>
      <ListItem v-if="tx" :size="sm" :label="$t('components.previews.unstake.claimLbl')" class="text-muted">
        <AmountDisplay class="font-medium" :amount="{ amount: unStaked, denom: baseDenom }" />
      </ListItem>
    </ListItem>

    <!-- Price  -->
    <ListItem v-if="tx" :size="size" :label="$t('components.previews.stake.validatorsLbl')">
      <div class="flex justify-end">
        <div>
          {{ getValidatorMoniker(stake.validatorAddress) }}
          <AmountDisplay :amount="stake.amount" />
        </div>
      </div>
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
<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Price from '@/components/common/Price.vue';
import { List, ListItem } from '@/components/ui/List';
import useStaking from '@/composables/useStaking';
import * as Actions from '@/types/actions';
import * as Base from '@/types/base';
export default defineComponent({
  name: 'PreviewUnstake',
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
      required: true,
    },
    fees: {
      type: Object as PropType<Record<string, Base.Amount>>,
      required: true,
    },
    context: {
      type: String as PropType<'default' | 'widget'>,
      default: 'default',
    },
  },

  setup(props) {
    const store = useStore();
    const { getValidatorsByBaseDenom } = useStaking();

    const route = useRoute();

    const propsRef = toRefs(props);
    const validators = ref([]);
    const baseDenom = route.params.denom as string;
    const tx = computed(() => propsRef.step.value.transactions[0]);
    const chainName = computed(() => {
      return (tx.value.data as Actions.UndelegateData).chain_name;
    });
    const unStaked = computed(() => {
      return (tx.value.data as Actions.UndelegateData).amount.amount;
    });
    onMounted(async () => {
      validators.value = await getValidatorsByBaseDenom(baseDenom);
    });
    const getValidatorMoniker = (address) => {
      return validators.value.find((x) => x.operator_address == address)?.moniker ?? 'unknown';
    };
    const size = props.context === 'default' ? 'md' : 'sm';

    return {
      store,
      size,
      tx,
      getValidatorMoniker,
      baseDenom,
      chainName,
      unStaked,
    };
  },
});
</script>
<style lang="scss" scoped></style>
