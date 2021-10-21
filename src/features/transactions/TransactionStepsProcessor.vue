<template>
  <div class="flex w-full items-center space-x-4 px-6">
    <div>
      <StateIcon />
    </div>

    <div class="flex-1 flex flex-col">
      <p class="font-medium">Title</p>
      <p class="-text-1 text-muted"><StateDescription /></p>
    </div>

    <div>
      <StateControls />
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { defineComponent } from '@vue/runtime-core';
import { useActor } from '@xstate/vue';

import Icon from '@/components/ui/Icon.vue';
import Spinner from '@/components/ui/Spinner.vue';

import Button from '../../components/ui/Button.vue';

const props = defineProps({
  service: {
    type: Object,
    required: true,
  },
});
// @ts-ignore
const { state, send } = useActor(props.service);

send({ type: 'SET_DATA', action: 'addliquidity', steps: [{ x: 1 }] });

const StateIcon = defineComponent({
  setup() {
    return () => {
      if (state.value.matches('failed')) {
        return <Icon name="WarningTriangleIcon" class="text-negative" />;
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
  setup() {
    return () => {
      if (state.value.matches('validating')) {
        return <p>Preparing transaction...</p>;
      }

      if (state.value.matches('waitingSignature')) {
        if (state.value.context.steps.length > 1) {
          return <p>{(state.value.context.currentIndex + 1) / state.value.context.steps.length} Waiting to sign</p>;
        }
        return <p>Waiting signature</p>;
      }

      if (state.value.matches('transacting')) {
        return <p>Transaction in progress...</p>;
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
  setup() {
    return () => {
      if (state.value.can('RETRY')) {
        return <Button name="Try again" onClick={() => send('RETRY')} />;
      }

      if (state.value.can('SIGN')) {
        return <Button name="Sign" onClick={() => send('SIGN')} />;
      }

      return null;
    };
  },
});
</script>
