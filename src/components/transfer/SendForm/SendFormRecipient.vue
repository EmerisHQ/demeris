<template>
  <fieldset class="form__field">
    <label>{{ $t('components.sendForm.to') }}</label>
    <Address v-model:address="form.recipient" />
  </fieldset>

  <fieldset class="form__field">
    <label>{{ $t('components.sendForm.memo') }}</label>
    <Input
      v-model="form.memo"
      :placeholder="$t('components.sendForm.memoPlaceholder')"
      :hint="$t('components.sendForm.memoHint')"
    />
  </fieldset>

  <fieldset v-if="form.recipient" class="form__field">
    <Checkbox v-model="form.isTermChecked" :label="$t('components.sendForm.agreeTerms')" />
  </fieldset>

  <fieldset class="form__field">
    <Button :name="$t('generic_cta.continue')" :disabled="!isValid" @click="onSubmit" />
  </fieldset>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue';

import Address from '@/components/ui/Address.vue';
import Button from '@/components/ui/Button.vue';
import Checkbox from '@/components/ui/Checkbox.vue';
import Input from '@/components/ui/Input.vue';
import { SendAddressForm } from '@/types/actions';
import { bech32 } from 'bech32';
import { store } from '../../../store/index';

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
    const form = inject<SendAddressForm>('transferForm');

    const isValid = computed(() => {
      return (form.isTermChecked && isValidAddress.value);
    });

    const isValidAddress = computed(() => {
      const chains = Object.values(store.getters['demeris/getChains']);

      try {
        const prefix = bech32.decode(form.recipient).prefix;
        //@ts-ignore
        if (chains.find((item) => item.node_info.bech32_config.prefix_account == prefix)) {
          return true;
        }

        return false;

      } catch (e) {
        console.log(e);
        return false;
      }
    });

    const onSubmit = () => {
      emit('next');
    };

    return { form, isValid, onSubmit };
  },
});
</script>
