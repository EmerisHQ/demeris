<template>
  <button class="flex w-full items-center space-x-3 hover:bg-fg">
    <div>
      <StateIcon />
    </div>

    <div class="flex-1 text-left flex flex-col">
      <p class="font-medium"><StateTitle /></p>
      <p class="-text-1 opacity-60"><StateDescription /></p>
    </div>

    <div>
      <StateControls v-if="!hideControls" />
    </div>
  </button>
</template>

<script lang="tsx" setup>
import { defineComponent } from '@vue/runtime-core';
import { useActor } from '@xstate/vue';

import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import Spinner from '@/components/ui/Spinner.vue';

const props = defineProps({
  service: {
    type: Object,
    required: true,
  },
  hideControls: {
    type: Boolean,
    default: false,
  },
});
// @ts-ignore
const { state, send } = useActor(props.service);

const StateIcon = defineComponent({
  name: 'StateIcon',
  setup() {
    return () => {
      if (state.value.matches('failed')) {
        return <Icon name="WarningTriangleIcon" class="text-negative" />;
      }

      if (state.value.matches('success')) {
        return <Icon name="WarningTriangleIcon" class="text-positive" />;
      }

      if (state.value.matches('transacting') || state.value.matches('validating')) {
        return (
          <div style="transform: scale(0.5)">
            <Spinner size={2.5} />
          </div>
        );
      }

      return <Icon name="ExclamationIcon" class="text-warning" />;
    };
  },
});

const StateDescription = defineComponent({
  name: 'StateDescription',
  setup() {
    return () => {
      if (state.value.matches('validating')) {
        return <p>Preparing transaction...</p>;
      }

      if (state.value.matches('waitingSignature')) {
        if (state.value.context.steps.length > 1) {
          return (
            <p>
              {state.value.context.currentIndex + 1}/{state.value.context.steps.length} Waiting to sign
            </p>
          );
        }
        return <p>Waiting signature</p>;
      }

      if (state.value.matches('transacting')) {
        return <p>Transaction in progress...</p>;
      }

      if (state.value.matches('review')) {
        return (
          <p>
            Sign in Keplr ({state.value.context.currentStepIndex + 1}/{state.value.context.steps.length})
          </p>
        );
      }

      if (state.value.matches('failed.sign')) {
        return <p>Transaction not signed</p>;
      }

      if (state.value.matches('failed.confirmations')) {
        return <p>Transaction failed</p>;
      }
    };
  },
});

const StateControls = defineComponent({
  name: 'StateControls',
  setup() {
    const dispatch = (action: any) => (event: Event) => {
      event.stopPropagation();
      send(action);
    };

    return () => {
      if (state.value.can('RETRY')) {
        return <Button name="Try again" onClick={dispatch('RETRY')} size="sm" />;
      }

      if (state.value.can('SIGN')) {
        return <Button name="Sign" onClick={dispatch('SIGN')} size="sm" />;
      }

      return null;
    };
  },
});

const StateTitle = defineComponent({
  name: 'StateTitle',
  setup() {
    const currentTransaction =
      state.value.context.steps[state.value.context.currentStepIndex].transactions[
        state.value.context.currentTransactionIndex
      ];
    const name = currentTransaction.name;

    return () => {
      switch (name) {
        case 'transfer':
          return <span>Transfer</span>;
        default:
          return <span>{name}</span>;
      }
    };
  },
});
</script>
