import { useActor, useSelector } from '@xstate/vue';
import { useMachine } from '@xstate/vue';
import { nextTick, ref } from 'vue';

import { getCurrentRoute } from '../logic';
import { swapMachine, SwapService } from './machine';
import { useSwapStore } from './store';

export const inputAmountRef = ref<HTMLInputElement | null>(null);
export const outputAmountRef = ref<HTMLInputElement | null>(null);

export const useSwapRefs = () => ({
  inputAmountRef,
  outputAmountRef,
});

export const useCurrentSwapRoute = () => {
  const swapStore = useSwapStore();
  return useSelector(swapStore.service, (state) => getCurrentRoute(state.context));
};

export const useSwapMachine = (defaultInputDenom: string) => {
  const swapStore = useSwapStore();

  const machine = useMachine(swapMachine, {
    actions: {
      updateSlippageSession: (context) => swapStore.updateSlippageSession(+context.maxSlippage),
      focusInputAmount: () => nextTick(() => inputAmountRef.value?.focus()),
      focusOutputAmount: () => nextTick(() => outputAmountRef.value?.focus()),
    },
    context: {
      defaultInputDenom,
    },
    services: {
      getAvailableDenoms: () => swapStore.syncAvailableDenoms(),
      getSwaps: () => swapStore.syncSwaps(),
    },
  });

  swapStore.setService(machine.service);
  return machine;
};

export const useSwapActor = () => {
  const swapStore = useSwapStore();
  return useActor(swapStore.service as SwapService);
};
