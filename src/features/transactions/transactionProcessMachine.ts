import { assign, createMachine } from 'xstate';

import { Step } from '@/types/actions';

interface TranscationsMachineContext {
  action: string;
  currentStepIndex: number;
  currentTransactionIndex: number;
  steps: Step[];
  responses: any[];
}

type TransactionsMachineEvents =
  | { type: 'SET_DATA'; steps: any[]; action: string }
  | { type: 'IBC_NOTICE_CONFIRM' }
  | { type: 'PROCEED_FEE' }
  | { type: 'SIGN' }
  | { type: 'ABORT' }
  | { type: 'RETRY' }
  | { type: 'CONTINUE' };

export const transactionProcessMachine = createMachine<TranscationsMachineContext, TransactionsMachineEvents>(
  {
    id: 'transactionProcessMachine',
    initial: 'idle',
    context: {
      action: undefined,
      currentStepIndex: 0,
      currentTransactionIndex: 0,
      steps: [],
      responses: [],
    },
    states: {
      idle: {
        always: [
          { target: 'ibcConfirmation', cond: 'needsTransferToHub' },
          { target: 'validating', cond: 'hasSteps' },
        ],
        on: {
          SET_DATA: {
            target: 'idle',
            actions: ['setData'],
          },
        },
      },
      ibcConfirmation: {
        on: {
          IBC_NOTICE_CONFIRM: 'validating',
        },
      },
      validating: {
        id: 'validating',
        initial: 'fees',
        states: {
          fees: {
            initial: 'pending',
            invoke: {
              src: 'validateFees',
              onDone: '.done',
              onError: '#failed',
            },
            states: {
              pending: {},
              done: {
                always: [
                  { target: '#feeWarning.missingFees', cond: 'hasMissingFees' },
                  { target: '#feeWarning.notRequired', cond: 'hasIBCFeeWarning' },
                  { target: '#chainDown' },
                ],
              },
            },
          },
          chainDown: {
            id: 'chainDown',
            invoke: {
              src: 'validateChainStatus',
              onDone: 'traceChannel',
              onError: '#failed',
            },
          },
          traceChannel: {
            invoke: {
              src: 'validateTraceChannel',
              onDone: '#review',
              onError: '#failed',
            },
          },
          previousTransaction: {
            invoke: {
              src: 'validatePreviousTransaction',
              onDone: '#review',
              onError: '#waitingPreviousTransaction',
            },
          },
        },
      },
      feeWarning: {
        id: 'feeWarning',
        states: {
          notRequired: {
            on: {
              PROCEED_FEE: '#validating.chainDown',
            },
          },
          missingFees: {
            type: 'final',
          },
        },
      },
      waitingPreviousTransaction: {
        id: 'waitingPreviousTransaction',
        on: {
          CONTINUE: '#validating.previousTransaction',
        },
      },
      review: {
        id: 'review',
        on: {
          SIGN: { target: 'signing' },
        },
      },
      signing: {
        id: 'signing',
        initial: 'active',
        after: {
          5000: '.delayed',
        },
        entry: { type: 'logEvent', key: 'confirm_tx' },
        invoke: {
          src: 'signTransaction',
          onDone: 'transacting',
          onError: 'failed.sign',
        },
        states: {
          active: {},
          delayed: {},
        },
      },
      transacting: {
        id: 'transacting',
        entry: { type: 'logEvent', key: 'signed_tx' },
        on: {
          ABORT: { target: 'aborted' },
        },
        initial: 'broadcasting',
        states: {
          broadcasting: {
            invoke: {
              src: 'broadcastTransaction',
              onDone: 'confirming',
            },
          },
          confirming: {
            initial: 'active',
            after: {
              5000: { target: '.pending' },
              10000: { target: '.delayed' },
              50000: { target: '#unknown' },
            },
            on: {
              // @ts-ignore
              GOT_RESPONSE: {
                target: '#next',
                actions: ['addTransactionResponse'],
              },
            },
            invoke: {
              src: 'fetchTransactionResponse',
            },
            states: {
              active: {},
              pending: {},
              delayed: {},
            },
          },
        },
      },
      next: {
        id: 'next',
        always: [
          { target: 'review', cond: 'hasMoreTransactions', actions: ['goNextTransaction'] },
          { target: 'review', cond: 'hasMoreSteps', actions: ['goNextStep'] },
          { target: 'success' },
        ],
      },
      aborted: {
        type: 'final',
      },
      failed: {
        id: 'failed',
        initial: 'default',
        states: {
          default: {},
          sign: {
            on: {
              RETRY: { target: '#signing' },
            },
          },
          confirmations: {
            on: {
              RETRY: { target: '#transacting.confirming' },
            },
          },
          unknown: {
            id: 'unknown',
            type: 'final',
          },
        },
      },
      success: {
        entry: { type: 'logEvent', key: 'completed_tx' },
        type: 'final',
      },
    },
  },
  {
    services: {
      validateFees: () => {
        return Promise.resolve(true);
      },
      validateChainStatus: () => {
        return new Promise((resolve) => setTimeout(resolve, 3000));
      },
      validateTraceChannel: () => {
        return Promise.resolve(true);
      },
      signTransaction: () => {
        return Promise.resolve(true);
      },
      broadcastTransaction: () => {
        return Promise.resolve(true);
      },
      fetchTransactionResponse: (context: TranscationsMachineContext) => (callback) => {
        console.log('fetching');
        let count = 0;
        const request = () => {
          count++;
          if (count === 11) {
            // @ts-ignore
            callback({ type: 'GOT_RESPONSE', data: 'hello' });
          }
        };

        const id = setInterval(request, 1000);
        request();

        return () => clearInterval(id);
      },
    },

    actions: {
      setData: assign({
        steps: (_, event: any) => event.steps || [],
        action: (_, event: any) => event.action,
      }),
      goNextStep: assign({
        currentStepIndex: (context: TranscationsMachineContext) => context.currentStepIndex + 1,
        currentTransactionIndex: 0,
      }),
      goNextTransaction: assign({
        currentTransactionIndex: (context: TranscationsMachineContext) => context.currentTransactionIndex + 1,
      }),
      addTransactionResponse: assign({
        responses: (context, event: any) => [...context.responses, event.data],
      }),
      logEvent: (_, __, meta) => console.log(meta.action),
    },

    guards: {
      hasSteps: (context) => context.steps.length > 0,
      hasMoreSteps: (context) => context.steps.length > context.currentStepIndex + 1,
      hasMoreTransactions: (context) =>
        context.steps[context.currentStepIndex].transactions.length > context.currentTransactionIndex,
      needsTransferToHub: (context) => {
        if (context.action === 'move') {
          return true;
        }
        return false;
      },

      hasMissingFees: (_, event: any) => event.missingFees?.length > 0,
      hasIBCFeeWarning: (_, event: any) => event.ibcWarning === true,
    },
  },
);
