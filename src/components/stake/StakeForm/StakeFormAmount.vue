<template>
  <div v-if="form.stakes.length > 0" class="flex w-full justify-center">
    <div class="max-w-7xl mx-auto px-8 w-full flex-1 flex flex-col items-stretch">
      <main class="pb-28 flex-1 flex flex-col items-center justify-center">
        <div class="w-full max-w-lg mx-auto">
          <ChainSelectModal
            v-if="state.isChainsModalOpen"
            class="fixed inset-0 z-30 bg-bg"
            title="Select chain"
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

          <Button
            v-if="validatorsToStakeWith.length < 3"
            class="mt-2"
            name="Add a validator"
            variant="link"
            :full-width="false"
            @click="() => validatorAddHandler()"
          >
            <Icon name="PlusIcon" :icon-size="2" />
          </Button>
          <div class="mt-2 w-full max-w-sm mx-auto">
            <!-- Stake Info -->
            <ListItem inset size="md" label="Time to unstake"> 21 days </ListItem>

            <ListItem inset size="md" label="Total stake">
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
            <Button :name="$t('generic_cta.continue')" :disabled="disabled" @click="goToReview" />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import BigNumber from 'bignumber.js';
import { computed, defineComponent, inject, PropType, reactive, ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'vue-meta';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import ChainSelectModal from '@/components/common/ChainSelectModal.vue';
import FeeLevelSelector from '@/components/common/FeeLevelSelector.vue';
import Price from '@/components/common/Price.vue';
import ValidatorSelect from '@/components/common/ValidatorSelect.vue';
import Alert from '@/components/ui/Alert.vue';
/* import AmountInput from '@/components/ui/AmountInput.vue'; */
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import ListItem from '@/components/ui/List/ListItem.vue';
import useAccount from '@/composables/useAccount';
import { GlobalDemerisGetterTypes } from '@/store';
import { ChainData } from '@/store/demeris-api/state';
import { MultiStakeForm, Step } from '@/types/actions';
import { Balance } from '@/types/api';
import { isNative, parseCoins } from '@/utils/basic';
export default defineComponent({
  name: 'StakeFormAmount',
  components: {
    Alert,
    Price,
    AmountDisplay,
    Button,
    ChainName,
    ChainSelectModal,
    ValidatorSelect,
    FeeLevelSelector,
    Icon,
    ListItem,
  },
  props: {
    validators: { type: Array as PropType<any[]>, required: true, default: () => [] },
    steps: {
      type: Array as PropType<Step[]>,
      default: () => [],
    },
  },

  emits: ['selectanother', 'next'],
  setup(props, { emit }) {
    /* hooks */
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
      return store.getters[GlobalDemerisGetterTypes.API.getChain]({ chain_name: validators.value[0].chain_name });
    });
    const baseDenom = (chain.value as ChainData)?.denoms.find((x) => x.stakable).name;
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

      allBalances.sort((a, b) => {
        const coinA = parseCoins(a.amount)[0];
        const coinB = parseCoins(b.amount)[0];
        return +coinB.amount - +coinA.amount;
      });

      return allBalances;
    });
    const totalToStake = computed(() =>
      validatorsToStakeWith.value
        .reduce(
          (total, val) =>
            total + Number(val.amount ?? 0) * 10 ** precision.value + Number(val.validator.stakedAmount ?? 0),
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
          chains[chain].amount
            .multipliedBy(10 ** precision.value)
            .isGreaterThan(chainBalance(chains[chain].denom, chain))
        ) {
          return true;
        }
      }
      return false;
    });
    const precision = computed(() =>
      store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({
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
    const validatorAddHandler = () => {
      emit('selectanother', null);
    };
    const goToReview = () => {
      form.stakes = form.stakes.filter((stake) => Number(stake.amount ?? 0) != 0);
      emit('next');
    };
    const toggleChainsModal = (asset: Balance, index: number) => {
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
    return {
      state,
      form,
      fees,
      disabled,
      balances,
      precision,
      baseDenom,
      validatorSelectHandler,
      validatorAddHandler,
      toggleChainsModal,
      goToReview,
      isGreaterWithPrecision,
      totalToStake,
      validatorsToStakeWith,
      hasIBC,
      chainBalance,
    };
  },
});
</script>

<style lang="scss">
.denom-select__coin-amount-type {
  display: none;
}
</style>
