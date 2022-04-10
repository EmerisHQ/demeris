import axios from 'axios';
import BigNumber from 'bignumber.js';
import { assign, createMachine } from 'xstate';

import {
  amountToHuman,
  amountToUnit,
  getInputAmountFromRoute,
  getMaxAmount,
  getOutputAmountFromRoute,
} from './swapMachineHelpers';

interface SwapContextData {
  availableDenoms: string[];
  routes: any[];
}

interface SwapContext {
  inputCoin: any;
  outputCoin: any;
  inputAmount: string;
  outputAmount: string;
  selectedRouteIndex: any;
  balances: any[];
  data: SwapContextData;
}

const defaultContext = () => ({
  inputCoin: {},
  outputCoin: {},
  inputAmount: undefined,
  outputAmount: undefined,
  selectedRouteIndex: undefined,
  balances: [],
  data: {
    availableDenoms: [],
    routes: [],
  },
});

const createUpdateRoutesState = ({ onDone, invokeSrc }: { onDone: string; invokeSrc: string }) => ({
  initial: 'choose',
  states: {
    choose: {
      always: [
        {
          target: 'debounce',
          cond: 'hasRouteParams',
        },
        { target: '#ready' },
      ],
    },
    run: {
      invoke: {
        src: invokeSrc,
        onDone: {
          target: '#ready',
          actions: ['assignRoutes', onDone],
        },
        onError: '#unavailable',
      },
    },
    debounce: {
      after: {
        500: 'run',
      },
    },
  },
});

export const swapMachine = createMachine<SwapContext>(
  {
    id: 'swap',
    initial: 'booting',
    context: defaultContext(),
    on: {
      'INPUT.CHANGE_COIN': {
        target: 'updating.routes.input',
        actions: 'setInputCoin',
      },
      'OUTPUT.CHANGE_COIN': {
        target: 'updating.routes.output',
        actions: 'setOutputCoin',
      },
      'INPUT.CHANGE_AMOUNT': {
        target: 'updating.routes.input',
        actions: 'setInputAmount',
      },
      'OUTPUT.CHANGE_AMOUNT': {
        target: 'updating.routes.output',
        actions: 'setOutputAmount',
      },
    },
    states: {
      booting: {
        type: 'parallel',
        states: {
          balances: {
            initial: 'pending',
            states: {
              pending: {
                on: {
                  'BALANCES.SET': {
                    actions: 'assignBalances',
                    target: 'success',
                  },
                },
              },
              success: {
                type: 'final',
              },
            },
          },
          availableDenoms: {
            initial: 'pending',
            states: {
              pending: {
                invoke: {
                  src: 'getAvailableDenoms',
                  onDone: {
                    target: 'success',
                    actions: 'assignAvailableDenoms',
                  },
                },
              },
              success: {
                type: 'final',
              },
            },
          },
        },
        onDone: 'ready',
      },
      ready: {
        id: 'ready',
        initial: 'choose',
        on: {
          'ROUTE.SELECT_INDEX': {
            actions: ['setSelectedRouteIndex', 'updateOutputAmountFromRoute'],
          },
          'COINS.SWITCH': {
            target: 'updating.routes.input',
            actions: 'switchCoins',
          },
        },
        states: {
          choose: {
            always: [{ target: 'pending', cond: 'hasAllParams' }, { target: 'idle' }],
          },
          idle: {},
          pending: {
            on: {
              'INVALID.OVER_MAX': 'invalid.overMax',
              'INVALID.BELOW_MIN': 'invalid.belowMin',
            },
            invoke: {
              src: 'performValidation',
              onDone: 'valid',
            },
          },
          valid: {
            on: {
              SUBMIT: {
                actions: 'handleSubmit',
              },
            },
          },
          invalid: {
            initial: 'unknown',
            states: {
              overMax: {},
              belowMin: {},
              unknown: {},
            },
          },
        },
      },
      updating: {
        states: {
          routes: {
            states: {
              input: createUpdateRoutesState({
                invokeSrc: 'getRoutesFromInput',
                onDone: 'updateOutputAmountFromRoute',
              }),
              output: createUpdateRoutesState({
                invokeSrc: 'getRoutesFromOutput',
                onDone: 'updateInputAmountFromRoute',
              }),
            },
          },
          availableDenoms: {
            invoke: {
              src: 'getAvailableDenoms',
              onDone: {
                target: '#ready',
                actions: 'assignAvailableDenoms',
              },
            },
          },
        },
      },
      unavailable: {
        id: 'unavailable',
      },
    },
  },
  {
    services: {
      performValidation: (ctx) => (send) => {
        const { amount } = amountToUnit({ amount: ctx.inputAmount, denom: ctx.inputCoin?.denom });
        if (new BigNumber(amount).isGreaterThan(getMaxAmount(ctx)?.amount)) {
          return send('INVALID.OVER_MAX');
        }

        return Promise.resolve(true);
      },
      getAvailableDenoms: () => {
        return Promise.resolve(['uatom', 'uosmo']);
      },
      getRoutesFromOutput: async (ctx) => {
        const { data } = await axios.post('https://dev.demeris.io/v1/daggregation/routing', {
          chainIn: ctx.inputCoin.chain,
          chainOut: 'osmosis' /*ctx.outputCoin.chain*/,
          denomIn: ctx.inputCoin.denom,
          denomOut: ctx.outputCoin.denom,
          amountOut: amountToUnit({ amount: ctx.outputAmount, denom: ctx.outputCoin?.denom }).amount,
        });
        return data.routes;
      },
      getRoutesFromInput: async (ctx) => {
        const { data } = await axios.post('https://dev.demeris.io/v1/daggregation/routing', {
          chainIn: ctx.inputCoin.chain,
          chainOut: 'osmosis' /*ctx.outputCoin.chain*/,
          denomIn: ctx.inputCoin.denom,
          denomOut: ctx.outputCoin.denom,
          amountIn: amountToUnit({ amount: ctx.inputAmount, denom: ctx.inputCoin?.denom }).amount,
        });
        return data.routes;
      },
    },
    actions: {
      assignBalances: assign({
        balances: (context, event) => event.balances,
      }),
      assignAvailableDenoms: assign((context, event) => ({
        data: {
          ...context.data,
          availableDenoms: event.data,
        },
      })),
      assignRoutes: assign((context, event) => ({
        data: {
          ...context.data,
          routes: event.data,
        },
        selectedRouteIndex: 0,
      })),
      switchCoins: assign({
        outputCoin: (ctx) => {
          if (ctx.inputCoin?.denom) {
            return {
              denom: ctx.inputCoin.denom,
              chain: 'cosmos-hub',
            };
          }
        },
        inputAmount: (ctx) => ctx.outputAmount,
        outputAmount: (ctx) => ctx.inputAmount,
        inputCoin: (ctx) => ctx.outputCoin,
      }),
      setInputCoin: assign((context, event) => ({
        inputCoin: event.value,
        outputCoin: event.value?.denom === context.outputCoin?.denom ? {} : context.outputCoin,
        outputAmount: event.value?.denom === context.outputCoin?.denom ? undefined : context.outputAmount,
      })),
      setInputAmount: assign((context, event) => ({
        inputAmount: event.value,
      })),
      setOutputAmount: assign((context, event) => ({
        outputAmount: event.value,
      })),
      setOutputCoin: assign({
        outputCoin: (ctx, event) => ({ denom: event.value?.denom, chain: 'cosmos-hub' }),
        inputCoin: (ctx, event) => (event.value?.denom === ctx.inputCoin?.denom ? {} : ctx.inputCoin),
        inputAmount: (ctx, event) => (event.value?.denom === ctx.inputCoin?.denom ? undefined : ctx.inputAmount),
      }),
      setSelectedRouteIndex: assign((context, event) => ({
        selectedRouteIndex: event.value,
      })),
      updateInputAmountFromRoute: assign({
        inputAmount: (ctx) => {
          if (!ctx.data.routes.length) {
            return '0';
          }

          const expectedAmount = getInputAmountFromRoute(ctx);
          return amountToHuman(expectedAmount)?.amount;
        },
      }),
      updateOutputAmountFromRoute: assign({
        outputAmount: (ctx) => {
          if (!ctx.data.routes.length) {
            return '0';
          }

          const expectedAmount = getOutputAmountFromRoute(ctx);
          return amountToHuman(expectedAmount)?.amount;
        },
      }),
    },
    guards: {
      hasRouteParams: (ctx) => ctx.inputCoin?.denom && ctx.inputAmount && ctx.outputCoin?.denom,
      hasAllParams: (ctx) => ctx.inputCoin?.denom && ctx.inputAmount && ctx.outputCoin?.denom && !!ctx.outputAmount,
    },
  },
);
