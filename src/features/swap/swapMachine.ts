import { assign, createMachine } from 'xstate';

interface SwapContextData {
  availableDenoms: string[];
  routes: any[];
}

interface SwapContext {
  depositCoin: any;
  receiveCoin: any;
  depositAmount: number;
  receiveAmount: number;
  selectedRoute: any;
  balances: any[];
  data: SwapContextData;
}

const defaultContext = () => ({
  depositCoin: {},
  receiveCoin: {},
  depositAmount: undefined,
  receiveAmount: undefined,
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
      UPDATE_DEPOSIT_COIN: {
        target: 'updating.routes.run',
        actions: 'setDepositCoin',
      },
      UPDATE_RECEIVE_COIN: {
        target: 'updating.routes.run',
        actions: 'setReceiveCoin',
      },
      UPDATE_DEPOSIT_AMOUNT: {
        target: 'updating.routes.debounce',
        actions: 'setDepositAmount',
      },
      UPDATE_RECEIVE_AMOUNT: {
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
              { target: 'idle', cond: (ctx) => !ctx.depositAmount || !ctx.depositCoin || !ctx.receiveCoin },
              { target: 'pending' },
            ],
          },
          idle: {},
          pending: {
            on: {
              INVALID_INSUFFICIENT_DEPOSIT_AMOUNT: 'invalid.insufficientDepositAmount',
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
        if (!context.depositAmount) {
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
        receiveCoin: (ctx) => {
          if (ctx.depositCoin?.denom) {
            return {
              denom: ctx.depositCoin.denom,
              chain: 'cosmos-hub',
            };
          }
        },
        receiveAmount: (ctx) => ctx.depositAmount,
        depositCoin: (ctx) => ctx.receiveCoin,
        depositAmount: (ctx) => ctx.receiveAmount,
      }),
      setDepositCoin: assign((context, event) => ({
        depositCoin: event.value,
        receiveCoin: event.value?.denom === context.receiveCoin?.denom ? {} : context.receiveCoin,
      })),
      setDepositAmount: assign((context, event) => ({
        depositAmount: event.value,
      })),
      setReceiveAmount: assign((context, event) => ({
        receiveAmount: event.value,
      })),
      setReceiveCoin: assign({
        receiveCoin: (ctx, event) => ({ denom: event.value?.denom, chain: 'cosmos-hub' }),
        depositCoin: (ctx, event) => (event.value?.denom === ctx.depositCoin?.denom ? {} : ctx.depositCoin),
      }),
      setSelectedRoute: assign((context, event) => ({
        selectedRoute: event.value,
      })),
    },
  },
);
