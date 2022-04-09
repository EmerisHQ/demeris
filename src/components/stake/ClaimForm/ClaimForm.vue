<template>
  <div class="w-full mx-auto">
    <template v-if="['review', 'stake'].includes(step)">
      <TransactionProcessCreator
        v-if="steps.length"
        :steps="steps"
        action="claim"
        @pending="closeModal"
        @close="closeModal"
        @previous="$emit('previous')"
      />
    </template>
  </div>
</template>
<script lang="ts">
import { EmerisAPI } from '@emeris/types';
import { computed, defineComponent, onMounted, PropType, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { actionHandler } from '@/actionhandler';
import useStaking from '@/composables/useStaking';
import TransactionProcessCreator from '@/features/transactions/components/TransactionProcessCreator.vue';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { ClaimRewardsAction } from '@/types/actions';
import { event } from '@/utils/analytics';

type Step = 'validator' | 'amount' | 'review' | 'stake';

export default defineComponent({
  name: 'ClaimForm',

  components: {
    TransactionProcessCreator,
  },

  props: {
    step: {
      type: String as PropType<Step>,
      default: undefined,
    },
    validators: {
      type: Array as PropType<EmerisAPI.Validator[]>,
      required: true,
      default: () => {
        return [];
      },
    },
  },

  emits: ['update:step', 'previous'],

  setup(props, { emit }) {
    const steps = ref([]);
    const store = useStore() as RootStoreTyped;
    const router = useRouter();

    const { getStakingRewardsByBaseDenom, getValidatorMoniker } = useStaking();

    const propsRef = toRefs(props);
    const chain = computed(() => {
      return store.getters[GlobalGetterTypes.API.getChain]({
        chain_name: propsRef.validators.value[0].chain_name,
      });
    });
    const baseDenom = chain.value?.denoms.find((x) => x.stakable).name;
    const gasPrice = computed(() => {
      return store.getters[GlobalGetterTypes.USER.getPreferredGasPriceLevel];
    });

    const step = computed({
      get: () => props.step,
      set: (value) => emit('update:step', value),
    });

    const closeModal = () => {
      router.push('/');
    };
    onMounted(async () => {
      const rewardsData = (await getStakingRewardsByBaseDenom(baseDenom)) as any;
      const chainName = store.getters[GlobalGetterTypes.API.getChainNameByBaseDenom]({ denom: baseDenom });
      const rewardsDataWithMoniker = rewardsData.rewards.map((reward) => {
        reward.moniker = getValidatorMoniker(reward.validator_address, propsRef.validators.value);
        return reward;
      });
      const action = {
        name: 'claim',
        params: { total: rewardsData.total, rewards: rewardsDataWithMoniker, chainName },
      } as ClaimRewardsAction;
      event('review_tx', { event_label: 'Reviewing claim tx', event_category: 'transactions' });
      steps.value = await actionHandler(action);
    });

    const goToStep = (value: Step) => {
      step.value = value;
    };
    const resetHandler = () => {
      goToStep('review');
    };

    if (!props.step) {
      step.value = 'review';
    }
    return {
      gasPrice,
      steps,
      goToStep,
      resetHandler,
      closeModal,
    };
  },
});
</script>

<style lang="scss"></style>
