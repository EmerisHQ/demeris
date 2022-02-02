import { assign, createMachine } from 'xstate';

interface SwapContextData {
  pools: any[];
  routes: any[];
}

interface SwapContext {
  depositCoin: any;
  receiveCoin: any;
  depositAmount: number;
  receiveAmount: number;
  selectedRoute: any;
  balances: any[];
  autoRefreshEnabled?: boolean;
  data: SwapContextData;
}

const defaultContext = () => ({
  depositCoin: {},
  receiveCoin: {},
  depositAmount: undefined,
  receiveAmount: undefined,
  selectedRoute: undefined,
  balances: [],
  autoRefreshEnabled: true,
  data: {
    pools: [],
    routes: [],
  },
});

export const swapMachine = createMachine<SwapContext>(
  {
    id: 'swap',
    initial: 'booting',
    context: defaultContext(),
    invoke: {
      src: 'autoRefreshData',
    },
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
    },
    states: {
      booting: {
        invoke: {
          src: 'fetchData',
          onDone: 'active.idle',
        },
      },
      active: {
        id: 'active',
        initial: 'pending',
        on: {
          REFRESH: {
            target: 'updating.all',
            actions: [],
          },
          SELECT_ROUTE: {
            actions: 'setSelectedRoute',
          },
          SWITCH_COINS: {
            target: 'updating.routes',
            actions: 'switchCoins',
          },
        },
        states: {
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
              unknown: {},
            },
          },
        },
      },
      updating: {
        states: {
          all: {
            invoke: {
              src: 'refreshData',
              onDone: {
                target: '#active',
                actions: 'assignData',
              },
            },
          },
          routes: {
            initial: 'run',
            states: {
              run: {
                invoke: {
                  src: 'getRoutes',
                  onDone: {
                    target: '#active',
                    actions: 'assignRoutes',
                  },
                },
              },
              debounce: {
                after: {
                  2000: 'run',
                },
              },
            },
          },
          pools: {
            invoke: {
              src: 'getPools',
              onDone: {
                target: '#active',
                actions: 'assignPools',
              },
            },
          },
        },
      },
    },
  },
  {
    services: {
      autoRefreshData: (context) => (send) => {
        const refreshId = setInterval(() => {
          if (context.autoRefreshEnabled) {
            send('REFRESH');
          }
        }, 300 * 100);

        return () => {
          clearInterval(refreshId);
        };
      },
      performValidation: (context) => (send) => {
        if (!context.depositAmount) {
          return send('INVALID');
        }

        return Promise.resolve(true);
      },
      fetchData: () => {
        return Promise.resolve(true);
      },
      refreshData: () => {
        return Promise.resolve(true);
      },
      getRoutes: () => {
        return Promise.resolve(true);
      },
    },
    actions: {
      assignData: assign((_, event) => ({
        data: {
          routes: event.data.routes,
          pools: event.data.pools,
        },
      })),
      assignPools: assign((context, event) => ({
        data: {
          pools: event.data,
          ...context.data,
        },
      })),
      assignRoutes: assign((context, event) => ({
        data: {
          routes: event.data,
          ...context.data,
        },
      })),
      switchCoins: assign((context) => ({
        receiveCoin: context.depositCoin,
        receiveAmount: context.depositAmount,
        depositCoin: context.receiveCoin,
        depositAmount: context.receiveAmount,
      })),
      setDepositCoin: assign((context, event) => ({
        depositCoin: event.value,
      })),
      setDepositAmount: assign((context, event) => ({
        depositAmount: event.value,
      })),
      setReceiveCoin: assign((context, event) => ({
        receiveCoin: event.value,
      })),
      setSelectedRoute: assign((context, event) => ({
        selectedRoute: event.value,
      })),
    },
  },
);
