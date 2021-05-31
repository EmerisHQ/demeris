<template>
  <AppLayout>
    <div class="home">
      <ul v-if="transferType">
        <li v-for="label of allSteps[transferType]" :key="label">
          {{ label }}
        </li>
      </ul>

      <template v-if="!transferType">
        <h2>Who are you sending to?</h2>
        <div>
          <button @click="setTransferType('send')">Send</button>
          <button @click="setTransferType('move')">Move</button>
        </div>
      </template>

      <template v-else-if="transferType === 'send'">
        <SendForm v-model:step="step" />
      </template>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { ref } from '@vue/reactivity';

import SendForm from '@/components/transfer/SendForm/SendForm.vue';
import AppLayout from '@/layouts/AppLayout.vue';

type TransferType = 'move' | 'send';

export default {
  name: 'Send',
  components: { AppLayout, SendForm },

  setup() {
    const transferType = ref<TransferType>(undefined);
    const step = ref(undefined);

    const allSteps = {
      send: ['Recipient', 'Amount', 'Review', 'Send'],
      move: ['Amount', 'Review', 'Move'],
    };

    const setTransferType = (type: TransferType) => {
      transferType.value = type;
    };

    return { transferType, setTransferType, step, allSteps };
  },
};
</script>
