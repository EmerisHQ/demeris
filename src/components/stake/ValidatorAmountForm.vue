<template>
  <div v-if="state.validatorAmounts.length > 0" class="flex w-full justify-center">
    <div class="max-w-7xl mx-auto px-8 w-full flex-1 flex flex-col items-stretch">
      <main class="pb-28 flex-1 flex flex-col items-center justify-center">
        <div class="w-full max-w-lg mx-auto">
          <ChainSelectModal
            v-if="state.isChainsModalOpen"
            class="fixed inset-0 z-30 bg-bg"
            title="Select chain"
            :show-subtitle="false"
            :assets="balances"
            :selected-denom="baseDenom"
            :func="() => toggleChainsModal()"
            @select="toggleChainsModal($event, state.chainsModalSource)"
          />

          <!-- Validator stake amount input -->
          <fieldset
            v-for="(vali, index) in state.validatorAmounts"
            :key="vali.validator.operator_address"
            class="bg-surface shadow-card rounded-2xl mt-4 pt-2"
          >
            <ValidatorSelect
              v-model:amount="vali.inputAmount"
              :validator="vali"
              @select="() => validatorSelectHandler(index)"
            />

            <button
              class="
                py-4
                px-5
                flex
                items-center
                justify-between
                w-full
                outline-none
                text-left
                group
                active:opacity-70
                transition-opacity
                text-muted
                hover:text-text
                focus:text-text
                border-t border-border
                rounded-b-2xl
              "
              @click="toggleChainsModal(null, index)"
            >
              <div>
                {{ $t('pages.addLiquidity.fromLbl') }}
                <span class="font-medium text-text"><ChainName :name="vali.from?.on_chain" /></span>
              </div>
              <div class="flex">
                <AmountDisplay
                  :amount="{
                    amount: vali.from?.amount,
                    denom: vali.from?.base_denom,
                  }"
                  :class="{
                    'text-negative-text': compareInputToBalance(vali.inputAmount, vali.from?.amount),
                  }"
                />
                <Icon name="ChevronRightIcon" :icon-size="1" class="ml-2" />
              </div>
            </button>
          </fieldset>

          <Button
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
                <Price :amount="{ denom: baseDenom, amount: totalToStake }" :show-zero="true" />
              </div>
            </ListItem>

            <!-- Fee -->
            <div class="mt-6 mb-2">
              <FeeLevelSelector :steps="actionSteps" @update:fees="state.fees = $event" />
            </div>

            <!-- IBC transfer alert -->
            <Alert v-if="hasIBC" status="info" class="mb-6">
              {{ $t('pages.addLiquidity.hubWarning') }}
            </Alert>

            <!-- Continue button -->
            <Button :name="$t('generic_cta.continue')" :disabled="false" @click="goToReview" />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, reactive, ref, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'vue-meta';
import { useRouter } from 'vue-router';
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
import { MultiDelegateAction, Step } from '@/types/actions';
import { Balance } from '@/types/api';
import { actionHandler } from '@/utils/actionHandler';
import { parseCoins } from '@/utils/basic';
export default {
  name: 'ValidatorAmountForm',
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
    validators: { type: Array, required: true, default: () => [] },
  },

  emits: ['previous', 'next'],
  setup(props, { emit }) {
    /* hooks */
    const { t } = useI18n({ useScope: 'global' });
    const router = useRouter();
    const store = useStore();
    const { balances: userBalances, getNativeBalances } = useAccount();
    const toStake = ref({});
    const actionSteps = ref<Step[]>([]);
    const state = reactive({
      isChainsModalOpen: false,
      chainsModalSource: 0,
      fees: {},
      validatorAmounts: [],
    });
    const validators = toRefs(props).validators;
    watch(
      () => validators.value,
      (newList, _oldList) => {
        for (let i = 0; i < newList.length; i++) {
          if (state.validatorAmounts[i]) {
            if (state.validatorAmounts[i].validator.operator_address != newList[i].operator_address) {
              state.validatorAmounts[i].validator = newList[i];
            }
          } else {
            state.validatorAmounts.push({ validator: newList[i], inputAmount: null, from: null });
          }
        }
        console.log(state.validatorAmounts);
      },
      { immediate: true },
    );
    /* meta & GA */
    useMeta({ title: t('context.stake.title') });

    /* variables */
    const baseDenom = router.currentRoute.value.params.denom as string;

    const action = computed(() => {
      return {
        name: 'multistake',
        params: state.validatorAmounts.map((x) => {
          if (x.from) {
            return {
              validatorAddress: x.validator.operator_address,
              amount: {
                amount: {
                  amount: (x.inputAmount * 10 ** precision.value).toString(),
                  denom: parseCoins(x.from.amount)[0].denom,
                },
                chain_name: x.from.on_chain,
              },
            };
          }
        }),
      } as MultiDelegateAction;
    });
    watch(
      () => action.value,
      async (action, _) => {
        actionSteps.value = await actionHandler(action);
      },
    );
    const hasIBC = computed(() => {
      const steptxnames = actionSteps.value.map((x) => x.transactions.map((tx) => tx.name)).flat();
      if (steptxnames.includes('ibc_backward') || steptxnames.includes('ibc_forward')) {
        return true;
      } else {
        return false;
      }
    });
    /* computeds */
    const balances = computed(() => {
      const nativeBalances = getNativeBalances();
      const result = [...userBalances.value];

      for (const nativeBalance of nativeBalances) {
        const hasBalance = userBalances.value.some(
          (item) => item.on_chain === nativeBalance.on_chain && item.base_denom === nativeBalance.base_denom,
        );
        if (!hasBalance) {
          result.push(nativeBalance);
        }
      }

      result.sort((a, b) => {
        const coinA = parseCoins(a.amount)[0];
        const coinB = parseCoins(b.amount)[0];
        return +coinB.amount - +coinA.amount;
      });

      return result;
    });
    const totalToStake = computed(
      () =>
        state.validatorAmounts.reduce((total, val) => total + Number(val.inputAmount ?? 0), 0) * 10 ** precision.value,
    );
    const precision = computed(() =>
      store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({
        name: baseDenom,
      }),
    );

    const compareInputToBalance = (input, balancestring) => {
      if (input && balancestring) {
        const balance = parseCoins(balancestring)[0].amount;
        const inputAmt = parseFloat(input);
        const balanceAmt = Number(balance) / 10 ** precision.value;
        return inputAmt > balanceAmt;
      } else {
        return false;
      }
    };

    /* functions */
    const validatorSelectHandler = (index) => {
      emit('previous', index);
    };
    const validatorAddHandler = () => {
      emit('previous', null);
    };
    const goToReview = () => {
      emit('next', actionSteps.value);
    };
    const toggleChainsModal = (asset: Balance, index: number) => {
      if (asset) {
        state.validatorAmounts[index].from = asset;
      }
      state.chainsModalSource = index;
      state.isChainsModalOpen = !state.isChainsModalOpen;
    };

    return {
      state,
      actionSteps,
      balances,
      precision,
      baseDenom,
      validatorSelectHandler,
      validatorAddHandler,
      toggleChainsModal,
      toStake,
      goToReview,
      compareInputToBalance,
      totalToStake,
      hasIBC,
    };
  },
};
</script>

<style lang="scss">
.denom-select__coin-amount-type {
  display: none;
}
</style>
