/* eslint-disable max-lines */
import { EmerisAPI, EmerisDEXInfo } from '@emeris/types';
import BigNumber from 'bignumber.js';
import { assign, createMachine, Interpreter, State } from 'xstate';

import { Step } from '@/types/actions';

import * as logic from '../logic';

interface SwapContextData {
  availableDenoms: string[];
  routes: any[];
  steps: Step[];
  swaps: EmerisDEXInfo.Swaps;
}

export interface SwapCoin {
  denom: string;
  chain: string;
  baseDenom: string;
}

export interface SwapContext {
  inputCoin?: SwapCoin;
  outputCoin?: SwapCoin;
  inputAmount: string;
  outputAmount: string;
  defaultInputDenom?: string;
  selectedRouteIndex?: number;
  balances: EmerisAPI.Balances;
  data: SwapContextData;
}

const defaultContext = (): SwapContext => ({
  inputCoin: undefined,
  outputCoin: undefined,
  inputAmount: undefined,
  outputAmount: undefined,
  defaultInputDenom: undefined,
  selectedRouteIndex: undefined,
  balances: [],
  data: {
    availableDenoms: [],
    routes: [],
    steps: [],
    swaps: [],
  },
});

export type SwapEvents =
  | { type: 'INPUT.CHANGE_COIN'; value: SwapCoin }
  | { type: 'OUTPUT.CHANGE_COIN'; value: SwapCoin }
  | { type: 'INPUT.CHANGE_AMOUNT'; value: string }
  | { type: 'OUTPUT.CHANGE_AMOUNT'; value: string }
  | { type: 'BALANCES.SET'; balances?: EmerisAPI.Balances }
  | { type: 'ROUTE.SELECT_INDEX'; value: number }
  | { type: 'STEPS.CLEAR' }
  | { type: 'COINS.SWITCH' }
  | { type: 'INVALID.OVER_MAX' }
  | { type: 'INVALID.BELOW_MIN' }
  | { type: 'START' }
  | { type: 'RESET' }
  | { type: 'SUBMIT' };

export const swapMachine = createMachine<SwapContext, SwapEvents>(
  {
    id: 'swap',
    initial: 'idle',
    context: defaultContext(),
    on: {
      'INPUT.CHANGE_COIN': [
        {
          target: 'updating.routes.input',
          actions: 'setInputCoin',
          cond: 'hasInputParams',
        },
        {
          target: 'updating.routes.output',
          actions: 'setInputCoin',
        },
      ],
      'OUTPUT.CHANGE_COIN': [
        {
          target: 'updating.routes.output',
          actions: 'setOutputCoin',
          cond: 'hasOutputParams',
        },
        {
          target: 'updating.routes.input',
          actions: 'setOutputCoin',
        },
      ],
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
      idle: {
        on: {
          START: 'booting',
        },
      },
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
                  onError: '#unavailable',
                },
              },
              success: {
                type: 'final',
              },
            },
          },
          swaps: {
            initial: 'pending',
            states: {
              pending: {
                invoke: {
                  src: 'getSwaps',
                  onDone: {
                    target: 'success',
                    actions: 'assignSwaps',
                  },
                  onError: '#unavailable',
                },
              },
              success: {
                type: 'final',
              },
            },
          },
        },
        onDone: {
          target: 'ready',
          actions: ['loadDefaultInputCoin'],
        },
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
          idle: {
            on: {
              'BALANCES.SET': {
                actions: 'assignBalances',
              },
            },
          },
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
              SUBMIT: 'submitting',
            },
          },
          submitting: {
            invoke: {
              src: 'handleSubmit',
              onDone: {
                target: '#submitted',
                actions: 'assignSteps',
              },
              onError: 'invalid',
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
        on: {
          'COINS.SWITCH': {
            target: 'updating.routes.input',
            actions: 'switchCoins',
          },
        },
      },
      submitted: {
        id: 'submitted',
        on: {
          RESET: {
            target: '#ready',
            actions: 'resetData',
          },
          'STEPS.CLEAR': {
            target: '#ready',
            actions: 'clearSteps',
          },
        },
      },
    },
  },
  {
    services: {
      performValidation: (context) => (send) => {
        const { amount } = logic.amountToUnit({ amount: context.inputAmount, denom: context.inputCoin?.baseDenom });

        if (new BigNumber(amount).isGreaterThan(logic.getMaxInputAmount(context)?.amount)) {
          return send('INVALID.OVER_MAX');
        }

        if (new BigNumber(amount).isLessThan(logic.getMinInputValue())) {
          return send('INVALID.BELOW_MIN');
        }

        return Promise.resolve(true);
      },
      handleSubmit: async (context) => {
        return Promise.resolve(logic.convertRouteToSteps(context, context.selectedRouteIndex));
      },
      getRoutesFromOutput: async (context) => logic.fetchSwapRoutes(context, 'output'),
      getRoutesFromInput: async (context) => logic.fetchSwapRoutes(context, 'input'),
    },
    actions: {
      assignDefaultInputDenom: assign({
        defaultInputDenom: (_, event: any) => event.value,
      }),
      assignBalances: assign((_, event: any) => ({ balances: event.balances })),
      assignSwaps: assign((context, event: any) => ({
        data: {
          ...context.data,
          swaps: event.data,
        },
      })),
      assignAvailableDenoms: assign((context, event: any) => ({
        data: {
          ...context.data,
          availableDenoms: event.data,
        },
      })),
      assignRoutes: assign((context, event: any) => ({
        data: {
          ...context.data,
          routes: logic.removeExceedingTransactionsFromRoutes(event.data),
        },
        selectedRouteIndex: 0,
      })),
      assignSteps: assign((context, event: any) => ({
        data: {
          ...context.data,
          steps: event.data,
        },
      })),
      clearRoutes: assign((context) => ({
        data: {
          ...context.data,
          routes: [],
        },
        selectedRouteIndex: undefined,
      })),
      clearSteps: assign((context) => ({
        data: {
          ...context.data,
          steps: [],
        },
      })),
      switchCoins: assign({
        outputCoin: (context) => {
          if (!context.inputCoin) return undefined;
          return {
            denom: context.inputCoin.baseDenom,
            baseDenom: context.inputCoin.baseDenom,
            chain: undefined,
          };
        },
        inputAmount: (context) => context.outputAmount,
        outputAmount: (context) => context.inputAmount,
        inputCoin: (context) => {
          if (!context.outputCoin) return undefined;
          return {
            denom: context.outputCoin.baseDenom,
            baseDenom: context.outputCoin.baseDenom,
            chain: context.inputCoin?.chain,
          };
        },
      }),
      setInputCoin: assign((context, event: any) => ({
        inputCoin: event.value,
        outputCoin: event.value?.baseDenom === context.outputCoin?.baseDenom ? undefined : context.outputCoin,
        outputAmount: event.value?.baseDenom === context.outputCoin?.baseDenom ? undefined : context.outputAmount,
      })),
      setInputAmount: assign((_, event: any) => ({ inputAmount: event.value })),
      setOutputAmount: assign((_, event: any) => ({ outputAmount: event.value })),
      setOutputCoin: assign((context, event: any) => ({
        outputCoin: event.value,
        inputCoin: event.value?.baseDenom === context.inputCoin?.baseDenom ? undefined : context.inputCoin,
        inputAmount: event.value?.baseDenom === context.inputCoin?.baseDenom ? undefined : context.inputAmount,
      })),
      setSelectedRouteIndex: assign({
        selectedRouteIndex: (_, event: any) => event.value,
      }),
      resetData: assign((context) => ({
        outputCoin: undefined,
        outputAmount: undefined,
        inputAmount: undefined,
        selectedRouteIndex: undefined,
        data: {
          ...context.data,
          steps: [],
          routes: [],
        },
      })),
      updateInputAmountFromRoute: assign({
        inputAmount: (context) => {
          if (!context.data.routes.length) {
            return '0';
          }

          const expectedAmount = logic.getInputAmountFromRoute(context);
          return logic.amountToHuman(expectedAmount)?.amount;
        },
      }),
      updateOutputAmountFromRoute: assign({
        outputAmount: (context) => {
          if (!context.data.routes.length) {
            return '0';
          }

          const expectedAmount = logic.getOutputAmountFromRoute(context);
          return logic.amountToHuman(expectedAmount)?.amount;
        },
      }),
      loadDefaultInputCoin: assign((context) => ({
        inputCoin: logic.getDefaultInputCoin(context),
      })),
    },
    guards: {
      hasInputParams: (context) => context.inputCoin?.denom && !!context.inputAmount,
      hasOutputParams: (context) => context.outputCoin?.denom && !!context.outputAmount,
      hasRouteParams: (context) => {
        if (context.inputCoin?.denom && context.inputAmount && !!context.outputCoin?.denom) return true;
        if (context.outputCoin?.denom && context.outputAmount && !!context.inputCoin?.denom) return true;
        return false;
      },
      hasAllParams: (context) =>
        context.inputCoin?.denom && context.inputAmount && context.outputCoin?.denom && !!context.outputAmount,
    },
  },
);

function createUpdateRoutesState({ onDone, invokeSrc }: { onDone: string; invokeSrc: string }) {
  return {
    initial: 'choosing',
    entry: 'clearRoutes',
    states: {
      choosing: {
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
          onError: {
            target: '#unavailable',
            actions: ['clearRoutes', onDone],
          },
        },
      },
      debounce: {
        after: {
          500: 'run',
        },
      },
    },
  };
}

export type SwapState = State<SwapContext, SwapEvents>;
export type SwapService = Interpreter<SwapContext, SwapState, SwapEvents>;
