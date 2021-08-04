<template>
  <div class="w-full max-w-sm mx-auto">
    <fieldset class="mt-8">
      <label class="block mb-2 -text-1 text-muted">{{ $t('components.sendForm.to') }}</label>
      <Address
        v-model:address.trim="form.recipient"
        :invalid="!!form.recipient && !isValidAddress"
        :placeholder="$t('components.sendForm.toPlaceholder')"
      />
    </fieldset>

    <fieldset class="mt-8">
      <label class="block mb-2 -text-1 text-muted">{{ $t('components.sendForm.memo') }}</label>
      <Input
        v-model="form.memo"
        :placeholder="$t('components.sendForm.memoPlaceholder')"
        :hint="$t('components.sendForm.memoHint')"
      />
    </fieldset>

    <fieldset v-if="form.recipient" class="mt-8">
      <Checkbox v-model="form.isTermChecked" :label="$t('components.sendForm.agreeTerms')" />
    </fieldset>

    <fieldset class="mt-8">
      <Button :name="$t('generic_cta.continue')" :disabled="!isValid" :click-function="isValid && onSubmit" />
    </fieldset>
  </div>
</template>

<script lang="ts">
import { bech32 } from 'bech32';
import { computed, defineComponent, inject } from 'vue';

import Address from '@/components/ui/Address.vue';
import Button from '@/components/ui/Button.vue';
import Checkbox from '@/components/ui/Checkbox.vue';
import Input from '@/components/ui/Input.vue';
import { SendAddressForm } from '@/types/actions';

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
      return form.isTermChecked && isValidAddress.value;
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
        console.error(e);
        return false;
      }
    });

    const onSubmit = () => {
      emit('next');
    };

    return { form, isValid, isValidAddress, onSubmit };
  },
});
</script>
