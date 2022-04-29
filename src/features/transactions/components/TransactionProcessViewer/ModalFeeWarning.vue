<template>
  <Modal class="text-center" :variant="'dialog'" fullscreen>
    <template v-if="feeWarning.missingFees.length > 0">
      <div class="text-1 font-bold mb-4">{{ $t('components.feeWarningModal.' + action + '.missingMany') }}</div>
      <div class="text-muted leading-copy mb-4">
        {{ $t('components.feeWarningModal.' + action + '.missingManyText') }}
      </div>
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
import { computed, inject, nextTick } from 'vue';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Modal from '@/components/ui/Modal.vue';
import ModalButton from '@/components/ui/ModalButton.vue';
import useCountry from '@/composables/useCountry';
import useEmitter from '@/composables/useEmitter';
import { GlobalGetterTypes } from '@/store';
import { featureRunning } from '@/utils/FeatureManager';

import { ProvideViewerKey } from '../../transactionProcessHelpers';
import { useTransactionsStore } from '../../transactionsStore';

const { actor, stepId } = inject(ProvideViewerKey);
const { state, send } = actor;

const emits = defineEmits(['close']);
const transactionsStore = useTransactionsStore();
const emitter = useEmitter();
const store = useStore();

const isSignedIn = computed(() => store.getters[GlobalGetterTypes.USER.isSignedIn]);
const action = computed(() => state.value.context.input.action);
const feeWarning = computed(() => state.value.context.fees.validation);

const goMoon = () => {
  if (isSignedIn.value) {
    const userCountry = useCountry();
    userCountry.includes('America') && featureRunning('SIMPLEX') ? emitter.emit('simplex') : emitter.emit('moonpay');
  } else {
    emitter.emit('toggle-settings-modal');
  }
};

const cancel = async () => {
  emits('close');
  await nextTick();
  transactionsStore.removeTransaction(stepId);
};
const proceed = () => send('PROCEED_FEE');
</script>
