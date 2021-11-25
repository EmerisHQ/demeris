import { assign, createMachine, Interpreter, State } from 'xstate';

import { store as globalStore } from '@/store';
import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';
import { DemerisTxParams, TicketResponse } from '@/store/demeris/actions';
import { GasPriceLevel, Step, StepTransaction } from '@/types/actions';
import { Balance } from '@/types/api';
import {
  chainStatusForSteps,
  ensureTraceChannel,
  feeForStepTransaction,
  msgFromStepTransaction,
} from '@/utils/actionHandler';

import {
  DoneEventData,
  formatStepsWithFee,
  getCurrentStep,
  getCurrentTransaction,
  getSourceChainFromTransaction,
} from './transactionProcessHelpers';

interface ContextInputSchema {
  action: string;
  gasPriceLevel: GasPriceLevel;
  gasLimit: number;
  steps: Step[];
}

export interface TransactionProcessContext {
  input: ContextInputSchema;
  formattedSteps: Step[];
  currentStepIndex: number;
  currentTransactionIndex: number;
  cursor: number;
  results: {
    txhash: string;
    chain_name: string;
    status: any;
    endBlock: any;
    transaction: StepTransaction;
    stepIndex: number;
  }[];
  error: undefined;
}

export type TransactionProcessEvents =
  | ({ type: 'SET_DATA'; balances: Balance[] } & ContextInputSchema)
  | { type: 'PROCEED_FEE' }
  | { type: 'SIGN' }
  | { type: 'ABORT' }
  | { type: 'RETRY' }
  | { type: 'CONTINUE' };

export const transactionProcessMachine = createMachine<TransactionProcessContext, TransactionProcessEvents>(
  {
    id: 'transactionProcessMachine',
    initial: 'idle',
    context: {
      input: {
        action: undefined,
        gasPriceLevel: undefined,
        gasLimit: undefined,
        steps: [],
      },
      cursor: 0,
      currentStepIndex: 0,
      currentTransactionIndex: 0,
      results: [],
      formattedSteps: [],
      error: undefined,
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
            actions: ['setData', 'formatSteps'],
          },
        },
      },
      ibcConfirmation: {
        on: {
          CONTINUE: 'validating',
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
              onError: '#failed.chainStatus',
            },
          },
          traceChannel: {
            invoke: {
              src: 'validateTraceChannel',
              onDone: 'previousTransaction',
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
          ABORT: '#aborted',
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
        entry: { type: 'logEvent', key: 'confirm_tx' },
        on: {
          ABORT: 'failed.sign',
        },
        after: {
          15000: '.delayed',
        },
        invoke: {
          src: 'signTransaction',
          onDone: 'transacting',
          onError: 'failed.sign',
        },
        states: {
          active: {},
          delayed: {
            on: {
              SIGN: '#signing.delayed',
            },
          },
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
              onError: '#failed',
            },
          },
          confirming: {
            initial: 'active',
            after: {
              5000: { target: '.pending' },
              60000: { target: '.delayed' },
              600000: { target: '#failed.unknown' },
            },
            on: {
              // @ts-ignore
              GOT_RESPONSE: {
                target: '#next',
                actions: ['addTransactionResponse'],
              },
              GOT_UNKNOWN: {
                target: '#failed.unknown',
                actions: ['addTransactionResponse'],
              },
            },
            invoke: {
              src: 'fetchTransactionResponse',
              onError: '#failed.confirmations',
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
          { target: 'receipt', cond: 'hasMoreTransactions' },
          { target: 'receipt', cond: 'hasMoreSteps' },
          { target: 'success' },
        ],
      },
      receipt: {
        on: {
          CONTINUE: {
            target: 'review',
            actions: 'goNextTransaction',
          },
          SIGN: {
            target: 'signing',
            actions: 'goNextTransaction',
          },
        },
      },
      aborted: {
        id: 'aborted',
        type: 'final',
      },
      failed: {
        id: 'failed',
        initial: 'default',
        entry: ['setError'],
        states: {
          default: {
            on: {
              ABORT: '#aborted',
            },
          },
          chainStatus: {
            on: {
              RETRY: '#validating',
              ABORT: '#aborted',
            },
          },
          sign: {
            on: {
              RETRY: { target: '#signing' },
              ABORT: '#aborted',
            },
          },
          confirmations: {
            on: {
              RETRY: { target: '#transacting.confirming' },
              ABORT: '#aborted',
            },
          },
          unknown: {
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
      validateFees: async (context) => {
        return Promise.resolve(true);
      },
      validateChainStatus: async (context) => {
        const result = await chainStatusForSteps(context.formattedSteps);
        if (!result.status) {
          throw result;
        }
        return result;
      },
      validateTraceChannel: (context) => {
        return ensureTraceChannel(getCurrentTransaction(context));
      },
      signTransaction: async (context) => {
        const currentTransaction = getCurrentTransaction(context);
        const msgResult = await msgFromStepTransaction(currentTransaction, context.input.gasPriceLevel);
        const feeResult = await feeForStepTransaction(currentTransaction);
        const fee = {
          amount: [
            {
              amount: '' + parseFloat(feeResult[0].amount[context.input.gasPriceLevel]) * context.input.gasLimit,
              denom: feeResult[0].denom,
            },
          ],
          gas: '' + context.input.gasLimit,
        };

        return globalStore.dispatch(GlobalDemerisActionTypes.SIGN_WITH_KEPLR, {
          msgs: [msgResult.msg],
          chain_name: msgResult.chain_name,
          fee,
          registry: msgResult.registry,
          memo: getCurrentStep(context).memo ?? '',
        });
      },
      broadcastTransaction: (_, event: DoneEventData<DemerisTxParams>) => {
        if (event.type !== 'done.invoke.signTransaction') {
          throw new Error('Needs to be signed first');
        }

        return globalStore.dispatch(GlobalDemerisActionTypes.BROADCAST_TX, event.data);
      },
      fetchTransactionResponse: (context, event: DoneEventData<TicketResponse>) => (callback) => {
        const currentStep = getCurrentStep(context);
        const currentTransaction = getCurrentTransaction(context);

        const sourceChain = getSourceChainFromTransaction(currentTransaction);

        const responseData = {
          txhash: event.data.ticket,
          chain_name: sourceChain,
          status: undefined,
          endBlock: undefined,
        };

        globalStore.dispatch(GlobalDemerisActionTypes.GET_TX_STATUS, {
          subscribe: true,
          params: { chain_name: sourceChain, ticket: event.data.ticket },
        });

        let shouldRetry = true;

        const fetchEndBlock = async (height: number) => {
          let retries = 0;
          let endBlockEvent = undefined;

          if (['swap', 'addliquidity', 'withdrawliquidity'].includes(currentStep.name)) {
            while (retries < 10 && shouldRetry) {
              try {
                endBlockEvent = await globalStore.dispatch(GlobalDemerisActionTypes.GET_END_BLOCK_EVENTS, {
                  height: height,
                  stepType: currentStep.name,
                });
                break;
              } catch {
                retries++;
                await new Promise((r) => setTimeout(r, 2000));
              }
            }

            if (!endBlockEvent) {
              // @ts-ignore
              return callback({ type: 'GOT_UNKNOWN', data: responseData });
            }
          }

          return endBlockEvent;
        };

        const fetchStatus = async () => {
          let resultData = undefined;
          const breakStatuses = [
            'complete',
            'failed',
            'stuck',
            'IBC_receive_failed',
            'IBC_receive_success',
            'Tokens_unlocked_timeout',
            'Tokens_unlocked_ack',
          ];

          while (!breakStatuses.includes(resultData?.status) && shouldRetry) {
            resultData = await globalStore.getters['demeris/getTxStatus']({
              chain_name: sourceChain,
              ticket: event.data.ticket,
            });
            await new Promise((resolve) => setTimeout(resolve, 750));
          }

          if (resultData.status === 'stuck') {
            // @ts-ignore
            return callback({ type: 'GOT_UNKNOWN', data: responseData });
          }

          if (!['IBC_receive_success', 'complete'].includes(resultData.status) || resultData.error) {
            throw new Error(resultData.error || 'error');
          }

          if (resultData.status === 'IBC_receive_success') {
            const ticketData = resultData.tx_hashes?.find((item) => item.Status === 'IBC_receive_success');
            responseData.txhash = ticketData.TxHash;
            responseData.chain_name = ticketData.Chain;
          }

          const endBlockResult = await fetchEndBlock(resultData.height);
          responseData.status = resultData;
          responseData.endBlock = endBlockResult;

          // @ts-ignore
          callback({ type: 'GOT_RESPONSE', data: responseData });
        };

        setTimeout(fetchStatus, 0);

        return () => (shouldRetry = false);
      },
    },

    actions: {
      setData: assign((_, event: ContextInputSchema & { type: string }) => ({
        input: {
          steps: event.steps,
          action: event.action,
          gasLimit: event.gasLimit,
          gasPriceLevel: event.gasPriceLevel,
        },
      })),
      formatSteps: assign((context, event: { type: string; balances: Balance[] }) => ({
        formattedSteps: formatStepsWithFee(context, event.balances),
      })),
      setError: assign({
        error: (_, event: any) => event,
      }),
      goNextTransaction: assign((context: TransactionProcessContext) => {
        const hasCompletedStep =
          context.currentTransactionIndex + 1 >= context.input.steps[context.currentStepIndex].transactions.length;
        return {
          cursor: context.cursor + 1,
          currentStepIndex: hasCompletedStep ? context.currentStepIndex + 1 : context.currentStepIndex,
          currentTransactionIndex: hasCompletedStep ? 0 : context.currentTransactionIndex + 1,
        };
      }),
      addTransactionResponse: assign({
        results: (context, event: DoneEventData<any>) => [
          ...context.results,
          { ...event.data, transaction: getCurrentTransaction(context), stepIndex: context.currentStepIndex },
        ],
      }),
      logEvent: (_, __, meta) => console.log(meta.action),
    },

    guards: {
      hasSteps: (context) => context.input.steps.length > 0,
      hasMoreSteps: (context) => context.input.steps.length > context.currentStepIndex + 1,
      hasMoreTransactions: (context) =>
        getCurrentStep(context).transactions.length > context.currentTransactionIndex + 1,
      needsTransferToHub: (context) => {
        if (context.input.action === 'move') {
          return true;
        }

        if (context.input.action === 'transfer') {
          if (getCurrentStep(context).transactions[0].name.includes('ibc')) {
            return true;
          }
        }

        if (['swap', 'addliquidity'].includes(context.input.action) && context.input.steps.length > 1) {
          return true;
        }

        return false;
      },

      hasMissingFees: (_, event: any) => event.missingFees?.length > 0,
      hasIBCFeeWarning: (_, event: any) => event.ibcWarning === true,
    },
  },
);

export type TransactionProcessState = State<TransactionProcessContext, TransactionProcessEvents>;
export type TransactionProcessService = Interpreter<
  TransactionProcessContext,
  TransactionProcessState,
  TransactionProcessEvents
>;
