import { useActor, useSelector } from '@xstate/vue';
import { useMachine } from '@xstate/vue';

import { getCurrentRoute } from '../logic';
import { swapMachine, SwapService } from './machine';
import { useSwapStore } from './store';

export const useCurrentSwapRoute = () => {
  const swapStore = useSwapStore();
  return useSelector(swapStore.service, (state) => getCurrentRoute(state.context));
};

export const useSwapMachine = (defaultInputDenom: string) => {
  const swapStore = useSwapStore();

  const machine = useMachine(swapMachine, {
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
