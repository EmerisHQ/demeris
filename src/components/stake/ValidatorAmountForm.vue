<template>
  <div class="flex w-full justify-center">
    <div class="max-w-7xl mx-auto px-8 w-full flex-1 flex flex-col items-stretch">
      <main class="pb-28 flex-1 flex flex-col items-center justify-center">
        <div class="w-full max-w-lg mx-auto">
          <ChainSelectModal
            v-if="state.isChainsModalOpen"
            class="fixed inset-0 z-30 bg-bg"
            title="Select chain"
            :show-subtitle="false"
            :assets="balances"
            :selected-denom="'uatom'"
            :func="() => toggleChainsModal()"
            @select="toggleChainsModal($event, state.chainsModalSource)"
          />

          <!-- Validator stake amount input -->
          <fieldset
            v-for="vali in validators"
            :key="vali.operator_address"
            class="bg-surface shadow-card rounded-2xl mt-4 pt-2"
          >
            <ValidatorSelect v-model:amount="vali.inputAmount" :validator="vali" @select="validatorSelectHandler" />

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
              @click="toggleChainsModal(null, vali.operator_address)"
            >
              <div>
                {{ $t('pages.addLiquidity.fromLbl') }}
                <span class="font-medium text-text"><ChainName :name="toStake[vali.operator_address]?.on_chain" /></span>
              </div>
              <div class="flex">
                test
                <Icon name="ChevronRightIcon" :icon-size="1" class="ml-2" />
              </div>
            </button>
          </fieldset>

          <div class="mt-2 w-full max-w-sm mx-auto">
            <!-- Stake Info -->
            <ListItem inset size="md" label="Time to unstake"> 21 days </ListItem>

            <ListItem inset size="md" label="Total stake">
              <AmountDisplay :amount="{ amount: 100, denom: 'uatom' }" />
              <div class="text-muted">
                <Price :amount="{ denom: baseDenom, amount: 100 }" :show-zero="true" />
              </div>
            </ListItem>

            <!-- Fee -->
            <div class="mt-6 mb-2">
              <FeeLevelSelector :steps="actionSteps" @update:fees="state.fees = $event" />
            </div>

            <!-- IBC transfer alert -->
            <Alert v-if="true" status="info" class="mb-6">
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
import { computed, reactive, ref } from 'vue';
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
import { Step } from '@/types/actions';
import { Balance } from '@/types/api';
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
    totalStakedAmount: {
      type: Number,
      required: true,
      default: 0,
    },
  },

  emits: ['previous'],
  setup(props, { emit }) {
    /* hooks */
    const { t } = useI18n({ useScope: 'global' });
    const router = useRouter();
    const store = useStore();
    const { balances: userBalances, getNativeBalances } = useAccount();
    const toStake = ref({});
    /* meta & GA */
    useMeta({ title: t('context.stake.title') });

    /* variables */
    const baseDenom = router.currentRoute.value.params.denom as string;
    const actionSteps = ref<Step[]>([]);
    const validatorStakingAmounts = ref(0);
    const state = reactive({
      isChainsModalOpen: false,
      chainsModalSource: 'coinA',
      fees: {},
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
    const precision = computed(() =>
      store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({
        name: baseDenom,
      }),
    );

    /* functions */
    const validatorSelectHandler = (e) => {
      console.log('back');
      emit('previous');
    };
    const goToReview = () => {
      console.log('GO TO REVIEW');
    };
    const toggleChainsModal = (asset: Balance, source: string) => {
      if (asset) {
        toStake.value[source] = asset;
      }
      console.log(toStake.value);
      state.chainsModalSource = source;
      state.isChainsModalOpen = !state.isChainsModalOpen;
    };

    return {
      validatorStakingAmounts,
      actionSteps,
      state,
      balances,
      precision,
      baseDenom,
      validatorSelectHandler,
      toggleChainsModal,
      toStake,
      goToReview,
    };
  },
};
</script>

<style lang="scss">
.denom-select__coin-amount-type {
  display: none;
}
</style>
