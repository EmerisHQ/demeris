<template>
  <div class="move-form">
    <template v-if="step === 'amount'">
      <h2 class="move-form__title s-2">Move assets</h2>
      <MoveFormAmount :balances="balances" @next="goToStep('review')" />
    </template>

    <template v-if="step === 'review'">
      <h2 class="move-form__title s-2">Review your transfer details</h2>

      <Button class="mt-10" name="Confirm and continue" @click="goToStep('move')" />
    </template>

    <template v-if="step === 'move'"> TODO </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, provide, reactive } from 'vue';

import Button from '@/components/ui/Button.vue';
import { MoveAssetsForm } from '@/types/actions';
import { Balances } from '@/types/api';

import MoveFormAmount from './MoveFormAmount.vue';

type Step = 'amount' | 'review' | 'move';

export default defineComponent({
  name: 'MoveForm',

  components: {
    Button,
    MoveFormAmount,
  },

  props: {
    balances: {
      type: Object as PropType<Balances>,
      required: true,
    },
    step: {
      type: String as PropType<Step>,
      default: undefined,
    },
  },

  emits: ['update:step'],

  setup(props, { emit }) {
    const form: MoveAssetsForm = reactive({
      balance: {
        denom: '',
        amount: '0',
      },
      on_chain: '',
      to_chain: '',
    });

    const step = computed({
      get: () => props.step,
      set: (value) => emit('update:step', value),
    });

    const goToStep = (value: Step) => {
      step.value = value;
    };

    if (!props.step) {
      step.value = 'amount';
    }

    provide('moveForm', form);

    return { form, goToStep };
  },
});
</script>

<style lang="scss">
.move-form {
  &__title {
    text-align: center;
    margin-bottom: 3.2rem;
  }
}
</style>
