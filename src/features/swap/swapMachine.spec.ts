import { waitFor } from '@testing-library/vue';
import { interpret } from 'xstate';
import { SimulatedClock } from 'xstate/lib/SimulatedClock';

import { swapMachine } from './swapMachine';

it('should refetch routes when update deposit token', async () => {
  const service = interpret(swapMachine).start();

  await waitFor(() => service.state.matches('idle'));

  service.send({ type: 'UPDATE_DEPOSIT_COIN', value: 'uatom' });

  await waitFor(() => expect(service.state.matches('updating.routes')).toBe(true));
  await waitFor(() => expect(service.state.context.depositCoin).toBe('uatom'));
});

it('should refetch routes when update deposit amount', async () => {
  const service = interpret(swapMachine).start();

  await waitFor(() => service.state.matches('idle'));

  service.send({ type: 'UPDATE_DEPOSIT_AMOUNT', value: '1' });

  await waitFor(() => expect(service.state.matches('updating.routes')).toBe(true));
  await waitFor(() => expect(service.state.context.depositAmount).toBe('1'));
});

it('should debounce deposit amount changes', async () => {
  const mockGetRoutes = vitest.fn(() => Promise.resolve([]));

  const service = interpret(
    swapMachine.withConfig({
      services: {
        getRoutes: mockGetRoutes,
      },
    }),
    { clock: new SimulatedClock() },
  ).start();

  await waitFor(() => service.state.matches('idle'));

  service.send({ type: 'UPDATE_DEPOSIT_AMOUNT', value: '1' });
  service.send({ type: 'UPDATE_DEPOSIT_AMOUNT', value: '1.23' });
  service.send({ type: 'UPDATE_DEPOSIT_AMOUNT', value: '1.1892' });

  await waitFor(() => expect(service.state.matches('updating.routes.debounce')).toBe(true));

  service.clock.increment(2000);

  await waitFor(() => expect(service.state.matches('updating.routes.run')).toBe(true));

  await waitFor(() => expect(service.state.context.depositAmount).toBe('1.1892'));

  expect(mockGetRoutes).toHaveBeenCalledTimes(1);
});

it('should get idle state when amount is empty', async () => {
  const service = interpret(swapMachine, { clock: new SimulatedClock() }).start();

  await waitFor(() => expect(service.state.matches('active.idle')).toBe(true));

  service.send({ type: 'UPDATE_DEPOSIT_AMOUNT', value: undefined });
  service.clock.increment(2000);

  await waitFor(() => expect(service.state.matches('active.idle')).toBe(true));
});

it('should switch coins', async () => {
  const service = interpret(swapMachine);
  service.start();

  await waitFor(() => service.state.matches('idle'));

  service.send({ type: 'UPDATE_DEPOSIT_COIN', value: 'uatom' });
  service.send({ type: 'UPDATE_DEPOSIT_AMOUNT', value: '1' });

  await waitFor(() => expect(service.state.context.depositCoin).toBe('uatom'));

  service.send({ type: 'UPDATE_RECEIVE_COIN', value: 'uosmo' });

  await waitFor(() => expect(service.state.context.receiveCoin).toBe('uosmo'));
  await waitFor(() => expect(service.state.matches('active.valid')).toBe(true));

  service.send({ type: 'SWITCH_COINS' });

  await waitFor(() =>
    expect(service.state.context).toMatchObject({
      depositCoin: 'uosmo',
      depositAmount: undefined,
      receiveCoin: 'uatom',
      receiveAmount: '1',
    }),
  );

  expect(service.state.matches('active.valid')).toBe(false);
});
