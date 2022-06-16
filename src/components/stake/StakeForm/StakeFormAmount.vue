<template>
  <div v-if="form.stakes.length > 0" class="flex w-full justify-center">
    <div class="max-w-7xl mx-auto px-8 w-full flex-1 flex flex-col items-stretch">
      <main class="pb-28 flex-1 flex flex-col items-center justify-center">
        <div class="w-full max-w-lg mx-auto">
          <ChainSelectModal
            v-if="state.isChainsModalOpen"
            class="fixed inset-0 z-30 bg-bg"
            :title="$t('components.stakeFormAmount.selectChain')"
            :show-subtitle="true"
            :assets="balances"
            :selected-denom="baseDenom"
            :func="() => toggleChainsModal(null, null)"
            @select="toggleChainsModal($event, state.chainsModalSource)"
          />

          <!-- Validator stake amount input -->
          <fieldset
            v-for="(vali, index) in validatorsToStakeWith"
            :key="vali.validator.operator_address"
            class="bg-surface shadow-card rounded-2xl mt-4 pt-2"
          >
            <ValidatorSelect
              :amount="vali.amount"
              :validator="vali.validator"
              @update:amount="
                (newAmount) => (form.stakes.find((x) => x.validatorAddress == vali.validatorAddress).amount = newAmount)
              "
              @select="() => validatorSelectHandler(index)"
              @unselect="() => validatorUnselectHandler(vali)"
            />

            <button
              class="py-4 px-5 flex items-center justify-between w-full outline-none text-left group active:opacity-70 transition-opacity text-muted hover:text-text focus:text-text border-t border-border rounded-b-2xl"
              @click="toggleChainsModal(null, index)"
            >
              <div>
                {{ $t('pages.addLiquidity.fromLbl') }}
                <span class="font-medium text-text"><ChainName :name="vali.from_chain" /></span>
              </div>
              <div class="flex">
                <AmountDisplay
                  :amount="{
                    amount: chainBalance(vali.denom, vali.from_chain),
                    denom: vali.denom,
                  }"
                  :chain="vali.from_chain"
                  :class="{
                    'text-negative-text': isGreaterWithPrecision(
                      vali.amount,
                      chainBalance(vali.denom, vali.from_chain),
                      precision,
                    ),
                  }"
                />
                <Icon name="ChevronRightIcon" :icon-size="1" class="ml-2" />
              </div>
            </button>
          </fieldset>

          <div class="mt-2 w-full max-w-sm mx-auto">
            <Button
              v-if="validatorsToStakeWith.length < 3"
              class="mt-6 mb-8"
              :name="$t('components.stakeFormAmount.addValidatorButton')"
              variant="link"
              :full-width="false"
              @click="() => validatorAddHandler()"
            >
              <Icon name="PlusIcon" :icon-size="2" />
            </Button>
            <!-- Stake Info -->
            <ListItem inset size="md" :label="$t('components.stakeFormAmount.timeUnstake')">
              <DaysToUnstake :chain-name="chainName" />
            </ListItem>

            <ListItem inset size="md" :label="$t('components.stakeFormAmount.totalStake')">
              <AmountDisplay :amount="{ amount: totalToStake, denom: baseDenom }" />
              <div class="text-muted">
                <Price :amount="{ denom: baseDenom, amount: totalToStake }" :show-zero="true" :show-dash="false" />
              </div>
            </ListItem>

            <!-- Fee -->
            <div class="mt-6 mb-2">
              <FeeLevelSelector :steps="steps" @update:fees="fees = $event" />
            </div>

            <!-- IBC transfer alert -->
            <Alert v-if="hasIBC" status="info" class="mb-6">
              {{ $t('pages.addLiquidity.hubWarning') }}
            </Alert>

            <!-- Continue button -->
            <Button
              :name="$t('generic_cta.continue')"
              :disabled="disabled"
              data-cy="stake-continue-button"
              @click="goToReview"
            />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EmerisAPI } from '@emeris/types';
import BigNumber from 'bignumber.js';
import { computed, inject, reactive, ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'vue-meta';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import ChainSelectModal from '@/components/common/ChainSelectModal.vue';
import FeeLevelSelector from '@/components/common/FeeLevelSelector.vue';
import Price from '@/components/common/Price.vue';
import ValidatorSelect from '@/components/common/ValidatorSelect.vue';
import DaysToUnstake from '@/components/stake/DaysToUnstake.vue';
import Alert from '@/components/ui/Alert.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import ListItem from '@/components/ui/List/ListItem.vue';
import useAccount from '@/composables/useAccount';
import { GlobalGetterTypes } from '@/store';
import { MultiStakeForm, Step } from '@/types/actions';
import { event } from '@/utils/analytics';
import { isNative, parseCoins } from '@/utils/basic';
import { sortBalancesByAmount } from '@/utils/sorting';

interface Props {
  validators: EmerisAPI.Validator[];
  steps: Step[];
}

const props = withDefaults(defineProps<Props>(), {
  validators: () => [],
  steps: () => [],
});

const emit = defineEmits<{
  (e: 'selectanother', value: any): void;
  (e: 'next'): void;
  (e: 'unselect', value: any): void;
}>();

const { t } = useI18n({ useScope: 'global' });
const store = useStore();

const form = inject<MultiStakeForm>('stakeForm');
const { balances: userBalances, getNativeBalances } = useAccount();

const state = reactive({
  isChainsModalOpen: false,
  chainsModalSource: 0,
});
const fees = ref({});
const validators = toRefs(props).validators;
const validatorsToStakeWith = computed(() => {
  return form.stakes.map((x) => {
    return { ...x, validator: validators.value.find((y) => y.operator_address == x.validatorAddress) };
  });
});
/* meta & GA */
useMeta({ title: t('context.stake.title') });

/* variables */
const chain = computed(() => {
  return store.getters[GlobalGetterTypes.API.getChain]({ chain_name: validators.value[0].chain_name });
});
const chainName = ref<string>(validators.value[0].chain_name);
const baseDenom = chain.value?.denoms.find((x) => x.stakable).name;
const hasIBC = computed(() => {
  const denomTypes = form.stakes.map((x) => {
    return isNative(x.denom) ? 'native' : 'ibc';
  });
  if (denomTypes.includes('ibc')) {
    return true;
  } else {
    return false;
  }
});
/* computeds */

const balances = computed(() => {
  // Adds 0 balances for all native assets if not owned by user
  const nativeBalances = getNativeBalances();
  const allBalances = [...userBalances.value];

  for (const nativeBalance of nativeBalances) {
    const hasBalance = userBalances.value.some(
      (item) => item.on_chain === nativeBalance.on_chain && item.base_denom === nativeBalance.base_denom,
    );
    if (!hasBalance) {
      allBalances.push(nativeBalance);
    }
  }

  return sortBalancesByAmount(allBalances);
});
const totalToStake = computed(() =>
  validatorsToStakeWith.value
    .reduce(
      (total, val) => total + Number(val.amount ?? 0) * 10 ** precision.value + Number(val.validator.stakedAmount ?? 0),
      0,
    )
    .toString(),
);
const disabled = computed(() => {
  let chains: Record<string, { amount: BigNumber; denom: string }> = {};
  let toStake = 0;
  for (const validator of validatorsToStakeWith.value) {
    toStake = toStake + Number(validator.amount ?? 0);
    if (chains[validator.from_chain]) {
      chains[validator.from_chain].amount = chains[validator.from_chain].amount.plus(
        new BigNumber(validator.amount != '' ? validator.amount : 0),
      );
    } else {
      chains[validator.from_chain] = {
        amount: new BigNumber(validator.amount != '' ? validator.amount : 0),
        denom: validator.denom,
      };
    }
  }
  if (toStake == 0) {
    return true;
  }
  for (const chain in chains) {
    if (
      chains[chain].amount.multipliedBy(10 ** precision.value).isGreaterThan(chainBalance(chains[chain].denom, chain))
    ) {
      return true;
    }
  }
  return false;
});
const precision = computed(() =>
  store.getters[GlobalGetterTypes.API.getDenomPrecision]({
    name: baseDenom,
  }),
);

const isGreaterWithPrecision = (x, y, precision) => {
  if (x && y) {
    const leftOperand = new BigNumber(x);
    const rightOperand = new BigNumber(y).dividedBy(10 ** precision);
    return leftOperand.isGreaterThan(rightOperand);
  } else {
    return false;
  }
};

/* functions */
const validatorSelectHandler = (index) => {
  emit('selectanother', index);
};
const validatorUnselectHandler = (validator) => {
  emit('unselect', validator);
};
const validatorAddHandler = () => {
  event('multiple_validator_adding', {
    event_label: 'Staking Form Add Another Validator Button Clicked',
    event_category: 'button',
  });
  emit('selectanother', null);
};
const goToReview = () => {
  form.stakes = form.stakes.filter((stake) => Number(stake.amount ?? 0) != 0);
  emit('next');
};
const toggleChainsModal = (asset: EmerisAPI.Balance, index: number) => {
  if (asset) {
    form.stakes[index].from_chain = asset.on_chain;
    form.stakes[index].denom = parseCoins(asset.amount)[0].denom;
  }
  state.chainsModalSource = index;
  state.isChainsModalOpen = !state.isChainsModalOpen;
};
const chainBalance = (denom, chain_name) => {
  return parseCoins(
    balances.value.find((x) => x.on_chain == chain_name && parseCoins(x.amount)[0].denom == denom).amount,
  )[0]?.amount;
};
</script>

<style lang="scss">
.denom-select__coin-amount-type {
  display: none;
}
</style>
