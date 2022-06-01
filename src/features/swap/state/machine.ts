/* eslint-disable max-lines */
import { EmerisAPI, EmerisDEXInfo } from '@emeris/types';
import BigNumber from 'bignumber.js';
import { assign, createMachine, Interpreter, State } from 'xstate';

import { Step } from '@/types/actions';

import * as logic from '../logic';
import {
  getAvailableChainsByDenom,
  getDenomFromBaseDenom,
  resolveBaseDenom,
  resolveCoinToSupportedDex,
} from '../logic';

interface SwapContextData {
  availableDenoms: string[];
  routes: any[];
  steps: Step[];
  swaps: EmerisDEXInfo.Swaps;
}

export interface SwapCoin {
  baseDenom: string;
  chain: string;
  denom: string;
}

export interface SwapContext {
  balances: EmerisAPI.Balances;
  data: SwapContextData;
  defaultInputDenom?: string;
  inputAmount: string;
  inputCoinDex?: SwapCoin;
  inputCoin?: SwapCoin;
  maxSlippage: string;
  outputAmount: string;
  outputCoin?: SwapCoin;
  selectedRouteIndex?: number;
}

const defaultContext = (): SwapContext => ({
  inputCoin: undefined,
  inputCoinDex: undefined,
  outputCoin: undefined,
  inputAmount: undefined,
  outputAmount: undefined,
  defaultInputDenom: undefined,
  selectedRouteIndex: undefined,
  balances: [],
  maxSlippage: '1',
  data: {
    availableDenoms: [],
    routes: [],
    steps: [],
    swaps: [],
  },
});

export type SwapEvents =
  | { type: 'BALANCES.SET'; balances?: EmerisAPI.Balances }
  | { type: 'COINS.SWITCH' }
  | { type: 'CONFIRM' }
  | { type: 'CANCEL' }
  | { type: 'INPUT.CHANGE_AMOUNT'; value: string }
  | { type: 'INPUT.CHANGE_COIN'; value: SwapCoin }
  | { type: 'INVALID.BELOW_MIN' }
  | { type: 'INVALID.OVER_MAX' }
  | { type: 'UNAVAILABLE.OVER_MAX' }
  | { type: 'UNAVAILABLE.UNKNOWN' }
  | { type: 'OUTPUT.CHANGE_AMOUNT'; value: string }
  | { type: 'OUTPUT.CHANGE_COIN'; value: SwapCoin }
  | { type: 'RESET' }
  | { type: 'ROUTE.SELECT_INDEX'; value: number }
  | { type: 'SHOW_SWAP_ROUTE.CONTINUE' }
  | { type: 'SLIPPAGE.CHANGE'; value: string }
  | { type: 'START' }
  | { type: 'STEPS.CLEAR' }
  | { type: 'SUBMIT' };

// xstate-ignore-next-line
export const swapMachine = createMachine<SwapContext, SwapEvents>(
  {
    id: 'swap',
    initial: 'idle',
    context: defaultContext(),
    preserveActionOrder: true,
    on: {
      'INPUT.CHANGE_COIN': [
        {
          target: '#ready',
          actions: ['setInputCoin', 'updateInputCoinDex', 'clearRoutes', 'focusInputAmount'],
          cond: 'hasInputParams',
        },
        {
          target: 'updating.routes.output',
          actions: ['setInputCoin', 'updateInputCoinDex'],
        },
      ],
      'OUTPUT.CHANGE_COIN': [
        {
          target: '#ready',
          actions: ['setOutputCoin', 'clearRoutes', 'focusOutputAmount'],
          cond: 'hasOutputParams',
        },
        {
          target: 'updating.routes.input',
          actions: ['setOutputCoin'],
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
      'SLIPPAGE.CHANGE': {
        actions: ['setSlippage', 'updateSlippageSession'],
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
          actions: ['loadDefaultInputCoin', 'updateInputCoinDex'],
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
            actions: ['switchCoins', 'updateInputCoinDex', 'focusInputAmount'],
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
            invoke: {
              src: 'prepareSigningSteps',
              onDone: {
                actions: 'assignSteps',
              },
            },
            on: {
              SUBMIT: 'submitting',
            },
          },
          submitting: {
            invoke: {
              src: 'prepareSigningSteps',
              onDone: {
                target: 'confirming',
                actions: 'assignSteps',
              },
              onError: 'invalid',
            },
          },
          confirming: {
            on: { CONFIRM: '#submitted', CANCEL: 'valid' },
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
        entry: 'clearSteps',
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
        initial: 'unknown',
        invoke: {
          src: 'isOverMax',
          onDone: '.overMax',
        },
        on: {
          'COINS.SWITCH': {
            target: 'updating.routes.input',
            actions: ['switchCoins', 'updateInputCoinDex', 'focusInputAmount'],
          },
          'UNAVAILABLE.OVER_MAX': {
            target: '.overMax',
          },
          'UNAVAILABLE.UNKNOWN': {
            target: '.unknown',
          },
          'BALANCES.SET': {
            actions: 'assignBalances',
          },
        },
        states: {
          overMax: {},
          unknown: {},
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
          'BALANCES.SET': {
            actions: 'assignBalances',
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
      prepareSigningSteps: async (context) => {
        return logic.prepareRouteToSign(context, context.selectedRouteIndex);
      },
      getRoutesFromOutput: async (context) => logic.fetchSwapRoutes(context, 'output'),
      getRoutesFromInput: async (context) => logic.fetchSwapRoutes(context, 'input'),
      isOverMax: (context) => (send) => {
        const { amount } = logic.amountToUnit({ amount: context.inputAmount, denom: context.inputCoin?.baseDenom });

        if (new BigNumber(amount).isGreaterThan(logic.getMaxInputAmount(context)?.amount)) {
          return send('UNAVAILABLE.OVER_MAX');
        }
        return send('UNAVAILABLE.UNKNOWN');
      },
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
      assignRoutes: assign((context, event: any) => {
        let routes = logic.removeExceedingStepsFromRoutes(event.data);
        if (context.inputCoin.chain !== context.inputCoinDex.chain) {
          routes = logic.prependAdditionalStepsToRoutes(routes, context.inputCoin, context.inputCoinDex);
        }

        return {
          data: {
            ...context.data,
            routes,
          },
          selectedRouteIndex: 0,
        };
      }),
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
      setSlippage: assign({
        maxSlippage: (_, event: any) => {
          const value = event.value;
          if (!value) return '1';

          return Math.min(+event.value, 100).toString();
        },
      }),
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

          const baseDenom = context.outputCoin.baseDenom;
          const availableChains = getAvailableChainsByDenom(context, baseDenom);
          const hasChain = availableChains.includes(context.inputCoin?.chain);
          const newChain = hasChain ? context.inputCoin?.chain : availableChains[0];
          const newDenom = getDenomFromBaseDenom(context, baseDenom, newChain);

          return {
            denom: newDenom,
            baseDenom: baseDenom,
            chain: newChain,
          };
        },
      }),
      setInputCoin: assign((context, event: any) => {
        return {
          inputCoin: event.value,
          inputAmount: undefined,
          outputCoin: event.value?.baseDenom === context.outputCoin?.baseDenom ? undefined : context.outputCoin,
          outputAmount: undefined,
          data: {
            ...context.data,
            steps: [],
          },
        };
      }),
      updateInputCoinDex: assign({
        inputCoinDex: (context) => resolveCoinToSupportedDex(context, context.inputCoin),
      }),
      setInputAmount: assign((_, event: any) => ({ inputAmount: event.value })),
      setOutputAmount: assign((_, event: any) => ({ outputAmount: event.value })),
      setOutputCoin: assign((context, event: any) => {
        return {
          outputCoin: event.value,
          outputAmount: undefined,
          inputCoin: event.value?.baseDenom === context.inputCoin?.baseDenom ? undefined : context.inputCoin,
          inputAmount: context.outputAmount ? undefined : context.inputAmount,
          data: {
            ...context.data,
            steps: [],
          },
        };
      }),
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
            return '-';
          }

          const expectedAmount = logic.getInputAmountFromRoute(context);
          return logic.amountToHuman(expectedAmount)?.amount;
        },
      }),
      updateOutputAmountFromRoute: assign({
        outputAmount: (context) => {
          if (!context.data.routes.length) {
            return '-';
          }
          const { amount, denom } = logic.getOutputAmountFromRoute(context);
          const baseDenom = resolveBaseDenom(denom, { context });
          return logic.amountToHuman({ denom: baseDenom, amount: amount })?.amount;
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
        if (context.inputCoin?.denom && +context.inputAmount && !!context.outputCoin?.denom) return true;
        if (context.outputCoin?.denom && +context.outputAmount && !!context.inputCoin?.denom) return true;
        return false;
      },
      hasAllParams: (context) =>
        context.inputCoin?.denom && +context.inputAmount && context.outputCoin?.denom && !!+context.outputAmount,
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
          { target: '#ready', actions: ['clearRoutes'] },
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
