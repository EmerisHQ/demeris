<template>
  <div>
    <label>To</label>
    <Address v-model="form.recipient" />
  </div>

  <div>
    <label>Reference (memo)</label>
    <Input v-model="form.memo" placeholde="Add reference (memo)" hint="My hint message" />
  </div>

  <div v-if="form.address">
    <label>
      <input v-model="form.isTermChecked" type="checkbox" />
      I have reviewed the address and understand that if it is incorrect, my sent funds may be lost.
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';

import Address from '@/components/ui/Address.vue';
import Input from '@/components/ui/Input.vue';
import { TransferForm } from '@/types/actions';

export default defineComponent({
  name: 'TransferFormRecipient',

  components: {
    Address,
    Input,
  },

  setup() {
    const form = inject<TransferForm>('transferForm');

    return { form };
  },
});
</script>
