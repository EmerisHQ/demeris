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
  routeIndex: any;
  balances: any[];
  autoRefreshEnabled?: boolean;
  data: SwapContextData;
}

const defaultContext = () => ({
  depositCoin: {},
  receiveCoin: {},
  depositAmount: undefined,
  receiveAmount: undefined,
  routeIndex: undefined,
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
          onDone: 'idle',
        },
      },
      idle: {
        id: 'idle',
        on: {
          REFRESH: {
            target: 'updating.all',
            actions: [],
          },
          SET_ROUTE_INDEX: {
            actions: 'setRouteIndex',
          },
          SWITCH_COINS: {
            target: 'updating.routes',
            actions: 'switchCoins',
          },
        },
      },
      updating: {
        states: {
          all: {
            invoke: {
              src: 'refreshData',
              onDone: {
                target: '#idle',
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
                    target: '#idle',
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
                target: '#idle',
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
      setRouteIndex: assign((context, event) => ({
        routeIndex: event.value,
      })),
    },
  },
);
