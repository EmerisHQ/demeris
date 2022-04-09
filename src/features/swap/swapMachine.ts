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

export const swapMachine = createMachine<SwapContext>(
  {
    id: 'swap',
    initial: 'booting',
    context: defaultContext(),
    on: {
      UPDATE_INPUT_COIN: {
        target: 'updating.routes.run',
        actions: 'setDepositCoin',
      },
      UPDATE_OUTPUT_COIN: {
        target: 'updating.routes.run',
        actions: 'setReceiveCoin',
      },
      UPDATE_INPUT_AMOUNT: {
        target: 'updating.routes.debounce',
        actions: 'setDepositAmount',
      },
      UPDATE_OUTPUT_AMOUNT: {
        target: 'updating.routes.debounce',
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
                  UPDATE_BALANCES: {
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
        onDone: 'available',
      },
      available: {
        id: 'available',
        initial: 'choose',
        on: {
          SELECT_ROUTE: {
            actions: 'setSelectedRoute',
          },
          SWITCH_COINS: {
            target: 'updating.routes',
            actions: 'switchCoins',
          },
        },
        states: {
          choose: {
            always: [
              { target: 'idle', cond: (ctx) => !ctx.inputAmount || !ctx.inputCoin || !ctx.outputCoin },
              { target: 'pending' },
            ],
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
            initial: 'run',
            states: {
              run: {
                invoke: {
                  src: 'getRoutes',
                  onDone: {
                    target: '#available',
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
          },
          availableDenoms: {
            invoke: {
              src: 'getAvailableDenoms',
              onDone: {
                target: '#available',
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
        outputAmount: (ctx) => ctx.inputAmount,
        inputCoin: (ctx) => ctx.outputCoin,
        inputAmount: (ctx) => ctx.outputAmount,
      }),
      setDepositCoin: assign((context, event) => ({
        inputCoin: event.value,
        outputCoin: event.value?.denom === context.outputCoin?.denom ? {} : context.outputCoin,
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
      }),
      setSelectedRoute: assign((context, event) => ({
        selectedRoute: event.value,
      })),
    },
  },
);
