<template>
  <Modal class="text-center" :variant="'dialog'" fullscreen @close="closeModal">
    <div class="flex items-center justify-center my-6">
      <Icon name="WarningTriangleIcon" :icon-size="3" class="text-negative" />
    </div>
    <template v-if="!state.context.error?.status">
      <div class="text-1 font-bold mb-4">
        {{ $t('components.txHandlingModal.chainDown') }}
      </div>
      <div class="text-muted leading-copy mb-8">
        {{ $t('components.txHandlingModal.chainDownDesc') }}
      </div>
    </template>
    <template v-else>
      <div class="text-1 font-bold mb-4">
        {{ $t('components.txHandlingModal.relayerDown') }}
      </div>
      <div class="text-muted leading-copy mb-8">
        {{ $t('components.txHandlingModal.relayerDownDesc') }}
      </div>
    </template>
    <template #buttons>
      <ModalButton :name="$t('generic_cta.understand')" :click-function="() => closeModal()" />
    </template>
  </Modal>
</template>

<script lang="ts" setup>
import { inject } from '@vue/runtime-core';

import Icon from '@/components/ui/Icon.vue';
import Modal from '@/components/ui/Modal.vue';
import ModalButton from '@/components/ui/ModalButton.vue';

import { ProvideViewerKey } from '../../transactionProcessHelpers';

const { actor, closeModal } = inject(ProvideViewerKey);
const { state } = actor;
</script>
