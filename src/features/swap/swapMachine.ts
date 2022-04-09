import { assign, createMachine } from 'xstate';

interface SwapContextData {
  availableDenoms: string[];
  routes: any[];
}

interface SwapContext {
  inputCoin: any;
  outputCoin: any;
  inputAmount: number;
  outputAmount: number;
  selectedRoute: any;
  balances: any[];
  data: SwapContextData;
}

const defaultContext = () => ({
  inputCoin: {},
  outputCoin: {},
  inputAmount: undefined,
  outputAmount: undefined,
  selectedRoute: undefined,
  showAssetSearch: '',
  balances: [],
  data: {
    availableDenoms: [],
    routes: [],
  },
});

const updateRoutesState = {
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
        src: 'getRoutes',
        onDone: {
          target: '#ready',
          actions: 'assignRoutes',
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

export const swapMachine = createMachine<SwapContext>(
  {
    id: 'swap',
    initial: 'booting',
    context: defaultContext(),
    on: {
      'INPUT.CHANGE_COIN': {
        target: 'updating.routes.input',
        actions: 'setDepositCoin',
      },
      'OUTPUT.CHANGE_COIN': {
        target: 'updating.routes.output',
        actions: 'setReceiveCoin',
      },
      'INPUT.CHANGE_AMOUNT': {
        target: 'updating.routes.input',
        actions: 'setDepositAmount',
      },
      'OUTPUT.CHANGE_AMOUNT': {
        target: 'updating.routes.output',
        actions: 'setReceiveAmount',
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
          'ROUTE.SELECT': {
            actions: 'setSelectedRoute',
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
              INVALID_INSUFFICIENT_INPUT_AMOUNT: 'invalid.insufficientDepositAmount',
              INVALID_INSUFFICIENT_BALANCE: 'invalid.insufficientBalance',
              INVALID: 'invalid',
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
              insufficientDepositAmount: {},
              insufficientFeeAmount: {},
              insufficientBalance: {},
              noRoutes: {},
              unknown: {},
            },
          },
        },
      },
      updating: {
        states: {
          routes: {
            states: {
              input: updateRoutesState,
              output: updateRoutesState,
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
      unavailable: {},
    },
  },
  {
    services: {
      performValidation: (context) => (send) => {
        if (!context.inputAmount) {
          return send('INVALID');
        }

        return Promise.resolve(true);
      },
      getAvailableDenoms: () => {
        return Promise.resolve(['uatom', 'uosmo']);
      },
      getRoutes: () => {
        return new Promise((resolve) => setTimeout(() => resolve([]), 1000));
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
        outputAmount: 0,
        inputCoin: (ctx) => ctx.outputCoin,
        inputAmount: (ctx) => ctx.outputAmount,
      }),
      setDepositCoin: assign((context, event) => ({
        inputCoin: event.value,
        outputCoin: event.value?.denom === context.outputCoin?.denom ? {} : context.outputCoin,
        outputAmount: event.value?.denom === context.outputCoin?.denom ? undefined : context.outputAmount,
      })),
      setDepositAmount: assign((context, event) => ({
        inputAmount: event.value,
      })),
      setReceiveAmount: assign((context, event) => ({
        outputAmount: event.value,
      })),
      setReceiveCoin: assign({
        outputCoin: (ctx, event) => ({ denom: event.value?.denom, chain: 'cosmos-hub' }),
        inputCoin: (ctx, event) => (event.value?.denom === ctx.inputCoin?.denom ? {} : ctx.inputCoin),
        inputAmount: (ctx, event) => (event.value?.denom === ctx.inputCoin?.denom ? undefined : ctx.inputAmount),
      }),
      setSelectedRoute: assign((context, event) => ({
        selectedRoute: event.value,
      })),
    },
    guards: {
      hasRouteParams: (ctx) => ctx.inputCoin?.denom && ctx.inputAmount && ctx.outputCoin?.denom,
      hasAllParams: (ctx) => ctx.inputCoin?.denom && ctx.inputAmount && ctx.outputCoin?.denom && !!ctx.outputAmount,
    },
  },
);
