<template>
  <Modal class="text-center" :variant="'dialog'" fullscreen>
    <template v-if="feeWarning.missingFees.length > 0">
      <div class="text-1 font-bold mb-4">{{ $t('components.feeWarningModal.missingMany') }}</div>
      <div class="text-muted leading-copy mb-4">{{ $t('components.feeWarningModal.missingManyText') }}</div>
      <div class="mb-8 flex flex-col items-center">
        <div v-for="missing in feeWarning.missingFees" :key="missing.denom" class="flex py-4 items-center">
          <CircleSymbol
            :chain-name="missing.chain_name"
            :denom="missing.denom"
            size="sm"
            variant="asset"
            class="mr-4"
          />
          <div class="font-bold">
            <AmountDisplay :amount="{ denom: missing.denom, amount: missing.amount }" />
          </div>
        </div>
      </div>
    </template>

    <template v-if="feeWarning.ibcWarning && feeWarning.missingFees.length == 0">
      <div class="text-1 font-bold mb-4">
        {{ $t('components.feeWarningModal.ibcWarning', { denom: feeWarning.ibcDetails.denom }) }}
      </div>
      <div class="text-muted leading-copy mb-8">
        {{
          $t('components.feeWarningModal.ibcWarningText', {
            ibcDenom: feeWarning.ibcDetails.ibcDenom,
            chain: feeWarning.ibcDetails.chain_name,
            denom: feeWarning.ibcDetails.denom,
          })
        }}
      </div>
    </template>

    <template #buttons>
      <template v-if="feeWarning.missingFees.length == 1 && feeWarning.missingFees[0].denom == 'uatom'">
        <ModalButton :name="$t('generic_cta.cancel')" :click-function="cancel" />
        <ModalButton :name="$t('generic_cta.getAtom')" :click-function="goMoon" />
      </template>
      <template
        v-if="
          feeWarning.missingFees.length > 1 ||
            (feeWarning.missingFees.length == 1 && feeWarning.missingFees[0].denom != 'uatom')
        "
      >
        <ModalButton :name="$t('generic_cta.understand')" :click-function="cancel" />
      </template>
      <template v-if="feeWarning.ibcWarning && feeWarning.missingFees.length == 0">
        <ModalButton :name="$t('generic_cta.cancel')" :click-function="cancel" />
        <ModalButton :name="$t('generic_cta.proceed')" :click-function="proceed" />
      </template>
    </template>
  </Modal>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Modal from '@/components/ui/Modal.vue';
import ModalButton from '@/components/ui/ModalButton.vue';
import useEmitter from '@/composables/useEmitter';
import { GlobalDemerisGetterTypes } from '@/store';

import { ProvideViewerKey } from '../../transactionProcessHelpers';
import { useTransactionsStore } from '../../transactionsStore';

const { actor } = inject(ProvideViewerKey);
const { state, send } = actor;

const emits = defineEmits(['close']);
const transactionsStore = useTransactionsStore();
const emitter = useEmitter();
const store = useStore();

const mpDomain = 'https://buy.moonpay.io';
const mpParams = computed(() => {
  return {
    apiKey: 'pk_live_C5H29zimSfFDzncZqYM4lQjuqZp2NNke',
    currencyCode: 'atom',
    walletAddress: store.getters[GlobalDemerisGetterTypes.USER.getOwnAddress]({ chain_name: 'cosmos-hub' }),
    baseCurrencyCode: 'usd',
    // baseCurrencyAmount: '50',
  };
});
const mpQuery = computed(() => new URLSearchParams(mpParams.value).toString());
const mpUrl = computed(() => mpDomain + '/?' + mpQuery.value);

const isSignedIn = computed(() => store.getters[GlobalDemerisGetterTypes.USER.isSignedIn]);
const feeWarning = computed(() => state.value.context.fees.validation);

const goMoon = () => {
  if (isSignedIn.value) {
    window.open(mpUrl.value, '', 'height=480,width=320');
  } else {
    emitter.emit('toggle-settings-modal');
  }
};

const cancel = () => {
  transactionsStore.removeTransaction(transactionsStore.currentId);
  emits('close');
};
const proceed = () => send('PROCEED_FEE');
</script>
