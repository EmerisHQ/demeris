<template>
  <div>
    <label>To</label>
    <Address v-model:address="form.recipient" />
  </div>

  <div>
    <label>Reference (memo)</label>
    <Input v-model="form.memo" placeholde="Add reference (memo)" hint="My hint message" />
  </div>

  <div v-if="form.recipient">
    <Checkbox
      v-model="form.isTermChecked"
      label="I have reviewed the address and understand that if it is incorrect, my sent funds may be lost."
    />
  </div>

  <div>
    <Button name="Confirm" :disabled="isValid" @click="onSubmit" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue';

import Address from '@/components/ui/Address.vue';
import Button from '@/components/ui/Button.vue';
import Checkbox from '@/components/ui/Checkbox.vue';
import Input from '@/components/ui/Input.vue';
import { TransferForm } from '@/types/actions';

export default defineComponent({
  name: 'SendFormRecipient',

  components: {
    Address,
    Button,
    Checkbox,
    Input,
  },

  emits: ['next'],

  setup(_, { emit }) {
    const form = inject<TransferForm>('transferForm');

    const isValid = computed(() => {
      return form.isTermChecked;
    });

    const onSubmit = () => {
      emit('next');
    };

    return { form, isValid, onSubmit };
  },
});
</script>
