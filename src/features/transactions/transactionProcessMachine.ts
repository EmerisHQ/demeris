/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import { EmerisAPI, EmerisFees } from '@emeris/types';
import { assign, createMachine, Interpreter, State } from 'xstate';

import { GlobalActionTypes, GlobalGetterTypes } from '@/store';
import { FeeTotals, FeeWarning, Step, StepTransaction } from '@/types/actions';
import { TxParams, TxResponse } from '@/types/tx';
import {
  chainStatusForSteps,
  ensureTraceChannel,
  feeForStep,
  feeForStepTransaction,
  msgFromStepTransaction,
  validateStepsFeeBalances,
} from '@/utils/actionHandler';
import { event } from '@/utils/analytics';
import { featureRunning } from '@/utils/FeatureManager';
import { useStore } from '@/utils/useStore';

import { resolveSwapResponse, SwapTransactionResult } from '../swap/logic/transaction';
import {
  DoneEventData,
  formatStepsWithFee,
  getCurrentStep,
  getCurrentTransaction,
  getSourceChainFromTransaction,
  logAmountVolume,
} from './transactionProcessHelpers';

interface ContextInputSchema {
  action: string;
  isDemoAccount: boolean;
  gasPriceLevel: EmerisFees.GasPriceLevel;
  gasLimit: number;
  steps: Step[];
  balances: EmerisAPI.Balance[];
}

export interface TransactionProcessContext {
  input: ContextInputSchema;
  formattedSteps: Step[];
  currentStepIndex: number;
  currentTransactionIndex: number;
  cursor: number;
  results: Record<
    string,
    {
      txhash: string;
      chain_name: string;
      status: any;
      endBlock: any;
      transaction: StepTransaction;
      stepIndex: number;
      result?: SwapTransactionResult;
    }
  >;
  fees: {
    totals: FeeTotals[];
    validation: FeeWarning | undefined;
  };
  error: undefined;
}

export type TransactionProcessEvents =
  | ({ type: 'SET_DATA'; balances: EmerisAPI.Balance[] } & ContextInputSchema)
  | { type: 'PROCEED_FEE' }
  | { type: 'SIGN' }
  | { type: 'ABORT' }
  | { type: 'RETRY' }
  | { type: 'CONTINUE' }
  | { type: 'VERIFY_QUEUE' };

export const transactionProcessMachine = createMachine<TransactionProcessContext, TransactionProcessEvents>(
  {
    id: 'transactionProcessMachine',
    initial: 'idle',
    context: {
      input: {
        action: undefined,
        isDemoAccount: undefined,
        gasPriceLevel: undefined,
        gasLimit: undefined,
        steps: [],
        balances: [],
      },
      cursor: 0,
      currentStepIndex: 0,
      currentTransactionIndex: 0,
      results: {},
      formattedSteps: [],
      fees: {
        totals: [],
        validation: undefined,
      },
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
              onDone: {
                target: '.done',
                actions: ['setFees'],
              },
              onError: '#failed',
            },
            states: {
              pending: {},
              done: {
                always: [
                  { target: '#feeWarning.missingFees', cond: 'hasMissingFees' },
                  { target: '#feeWarning.ibcWarning', cond: 'hasIBCFeeWarning' },
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
              onError: {
                target: '#failed.chainStatus',
                actions: { type: 'logEvent', key: 'chain_status_warning' },
              },
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
          ibcWarning: {
            entry: { type: 'logEvent', key: 'ibc_fee_warning' },
            on: {
              ABORT: '#aborted',
              PROCEED_FEE: '#validating.chainDown',
            },
          },
          missingFees: {
            entry: { type: 'logEvent', key: 'fee_warning' },
            on: {
              ABORT: '#aborted',
            },
          },
        },
      },
      waitingPreviousTransaction: {
        id: 'waitingPreviousTransaction',
        on: {
          VERIFY_QUEUE: '#validating.previousTransaction',
          ABORT: '#aborted',
        },
      },
      review: {
        id: 'review',
        on: {
          VERIFY_QUEUE: '#validating.previousTransaction',
          SIGN: { target: 'signing' },
        },
      },
      signing: {
        id: 'signing',
        initial: 'active',
        entry: { type: 'logEvent', key: 'confirm_tx' },
        on: {
          ABORT: 'review',
        },
        after: {
          15000: '.delayed',
        },
        invoke: {
          src: 'signTransaction',
          onDone: {
            target: 'transacting',
            actions: { type: 'logEvent', key: 'signed_tx' },
          },
          onError: [
            {
              target: 'failed.genericError',
              cond: (_, event) => event.data === 'GET_NUMBERS_CHAIN request failed',
            },
            {
              target: 'failed.sign',
              cond: (_, event) => event.data === 'Failed to sign tx',
            },
            {
              target: 'failed.unknown',
            },
          ],
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
        on: {
          ABORT: { target: 'aborted' },
        },
        initial: 'broadcasting',
        states: {
          broadcasting: {
            invoke: {
              src: 'broadcastTransaction',
              onDone: 'confirming',
              onError: '#failed.broadcast',
            },
          },
          confirming: {
            initial: 'active',
            after: {
              5000: { target: '.pending' },
              60000: { target: '.delayed' },
              300000: { target: '#failed.unknown' },
            },
            on: {
              SET_DATA: {
                actions: ['setTransactionResponse'],
              },
              // @ts-ignore
              GOT_RESPONSE: {
                target: '#next',
                actions: ['setTransactionResponse'],
              },
              GOT_UNKNOWN: {
                target: '#failed.unknown',
                actions: ['setTransactionResponse'],
              },
              GOT_FAILURE: {
                target: '#failed.confirmations',
                actions: ['setTransactionResponse'],
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
        entry: { type: 'logEvent', key: 'completed_tx' },
        always: [
          { target: 'receipt', cond: 'hasMoreTransactions' },
          { target: 'receipt', cond: 'hasMoreSteps' },
          { target: 'success' },
        ],
      },
      receipt: {
        on: {
          CONTINUE: {
            target: 'validating.traceChannel',
            actions: 'goNextTransaction',
          },
          SIGN: {
            target: 'signing',
            actions: 'goNextTransaction',
          },
          VERIFY_QUEUE: '#validating.previousTransaction',
        },
      },
      aborted: {
        id: 'aborted',
        type: 'final',
      },
      failed: {
        id: 'failed',
        initial: 'default',
        entry: ['setError', 'logError'],
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
          genericError: {
            on: {
              RETRY: { target: '#signing' },
              ABORT: '#aborted',
            },
          },
          broadcast: {
            entry: { type: 'logEvent', key: 'failed_tx' },
            on: {
              RETRY: { target: '#signing' },
              ABORT: '#aborted',
            },
          },
          confirmations: {
            entry: { type: 'logEvent', key: 'failed_tx' },
            on: {
              RETRY: { target: '#signing' },
              ABORT: '#aborted',
            },
          },
          unknown: {
            type: 'final',
          },
        },
      },
      success: {
        type: 'final',
      },
    },
  },
  {
    services: {
      validateFees: async (context) => {
        const totals = await Promise.all(
          context.input.steps.map((step) => feeForStep(step, context.input.gasPriceLevel)),
        );
        let validation = {};
        if (!context.input.isDemoAccount) {
          validation = await validateStepsFeeBalances(
            context.formattedSteps,
            JSON.parse(JSON.stringify(context.input.balances)),
            totals,
            context.input.gasPriceLevel,
          );
        }
        return { totals, validation };
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
              amount: '' + feeResult[0].amount[context.input.gasPriceLevel] * context.input.gasLimit,
              denom: feeResult[0].denom,
            },
          ],
          gas: '' + context.input.gasLimit,
        };
        try {
          return useStore().dispatch(GlobalActionTypes.TX.SIGN_WITH_KEPLR, {
            msgs: msgResult.msg,
            chain_name: msgResult.chain_name,
            fee,
            registry: msgResult.registry,
            memo: getCurrentStep(context).memo ?? '',
          });
        } catch (ex) {
          console.error('Error while signing with KEPLR', ex);
        }
      },
      broadcastTransaction: async (_, event: DoneEventData<TxParams>) => {
        return useStore().dispatch(GlobalActionTypes.TX.BROADCAST_TX, event.data);
      },
      fetchTransactionResponse: (context, event: DoneEventData<TxResponse>) => (callback) => {
        const currentStep = getCurrentStep(context);
        const currentTransaction = getCurrentTransaction(context);

        const sourceChain = getSourceChainFromTransaction(currentTransaction);

        const responseData = {
          txhash: event.data.ticket,
          chain_name: sourceChain,
          status: undefined,
          endBlock: undefined,
          websocket: undefined,
          result: undefined,
        };

        // @ts-ignore
        callback({ type: 'SET_DATA', data: responseData });

        let shouldRetry = true;

        const fetchEndBlock = async (height: number) => {
          let retries = 0;
          let endBlockEvent = undefined;

          if (['swap', 'addliquidity', 'withdrawliquidity'].includes(currentStep.name)) {
            while (retries < 10 && shouldRetry) {
              try {
                endBlockEvent = await useStore().dispatch(GlobalActionTypes.API.GET_END_BLOCK_EVENTS, {
                  height: height,
                  stepType: currentStep.name,
                  chain_name: sourceChain,
                });
                break;
              } catch {
                retries++;
                await new Promise((r) => setTimeout(r, 2000));
              }
            }

            if (!endBlockEvent) {
              // @ts-ignore
              return callback({ type: 'GOT_UNKNOWN', data: { ...responseData, endBlock: endBlockEvent } });
            }

            if (endBlockEvent.success === 'failure') {
              return callback({
                // @ts-ignore
                type: 'GOT_FAILURE',
                error: 'Failed to find block results',
                data: { ...responseData, endBlock: endBlockEvent },
              });
            }
          }

          responseData.endBlock = endBlockEvent;
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
            resultData = await useStore().getters[GlobalGetterTypes.API.getTxStatus]({
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
            return callback({
              // @ts-ignore
              type: 'GOT_FAILURE',
              error: resultData.error,
              data: responseData,
            });
          }

          if (resultData.status === 'IBC_receive_success') {
            const ticketData = resultData.tx_hashes?.find((item) => item.Status === 'IBC_receive_success');
            responseData.txhash = ticketData.TxHash;
            responseData.chain_name = ticketData.Chain;
          }

          responseData.status = resultData;

          await fetchEndBlock(resultData.height);

          // @ts-ignore
          callback({ type: 'GOT_RESPONSE', data: responseData });
        };

        const findIBCDestHash = async () => {
          if (currentTransaction.type == 'IBCtransferBackward' || currentTransaction.type == 'IBCtransferForward') {
            const { chainName, toChain } = currentTransaction.data;

            let retriesDestCount = 0;
            let destTx;

            while (retriesDestCount < 15 && shouldRetry) {
              try {
                destTx = await useStore().dispatch(GlobalActionTypes.API.GET_TX_DEST_HASH, {
                  from_chain: chainName,
                  to_chain: toChain,
                  txhash: responseData.txhash,
                });

                responseData.chain_name = destTx.dest_chain;
                responseData.txhash = destTx.tx_hash;
                break;
              } catch {
                retriesDestCount++;
                await new Promise((r) => setTimeout(r, 4000));
              }
            }

            if (!destTx) {
              return callback({
                // @ts-ignore
                type: 'GOT_FAILURE',
                error: 'Failed to fetch destination hash',
                data: { ...responseData },
              });
            }
          }
        };

        const traceResponse = async () => {
          try {
            await useStore().dispatch(GlobalActionTypes.API.GET_NEW_BLOCK, { chain_name: responseData.chain_name });
          } catch (e) {
            if (e?.message !== 'ERR_WSS_TIMEOUT') {
              // Fallback when websocket fails
              await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for the block time
            }
          }

          await findIBCDestHash();

          let traceResult;

          try {
            traceResult = await useStore().dispatch(GlobalActionTypes.API.TRACE_TX_RESPONSE, {
              chain_name: responseData.chain_name,
              txhash: responseData.txhash,
            });
          } catch (e) {
            // @ts-ignore
            return callback({ type: 'GOT_FAILURE', error: e.message, data: { ...responseData } });
          }

          responseData.websocket = traceResult;

          if (currentStep.name === 'swap') {
            try {
              const result = await resolveSwapResponse(traceResult, sourceChain);
              responseData.result = result;
            } catch {
              return callback({
                // @ts-ignore
                type: 'GOT_FAILURE',
                error: 'Failed to find swap results',
                data: responseData,
              });
            }
          } else {
            await fetchEndBlock(traceResult.height);
          }

          // @ts-ignore
          callback({ type: 'GOT_RESPONSE', data: responseData });
        };

        if (featureRunning('WEBSOCKET_RESPONSE')) {
          setTimeout(traceResponse, 0);
        } else {
          useStore().dispatch(GlobalActionTypes.API.GET_TX_STATUS, {
            subscribe: true,
            params: { chain_name: sourceChain, ticket: event.data.ticket },
          });

          setTimeout(fetchStatus, 0);
        }

        return () => (shouldRetry = false);
      },
    },

    actions: {
      setData: assign((_, event: ContextInputSchema & { type: string }) => ({
        input: {
          isDemoAccount: event.isDemoAccount,
          steps: event.steps,
          action: event.action,
          gasLimit: event.gasLimit,
          gasPriceLevel: event.gasPriceLevel,
          balances: event.balances,
        },
      })),
      setFees: assign({
        fees: (_, event: DoneEventData<any>) => event.data,
      }),
      formatSteps: assign((context, event: ContextInputSchema & { type: string }) => ({
        formattedSteps: formatStepsWithFee(context, event.balances),
      })),
      setError: assign({
        error: (_, event: any) => event.error || event.data,
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
      setTransactionResponse: assign({
        results: (context, event: DoneEventData<any>) => ({
          ...context.results,
          [event.data.txhash]: {
            ...event.data,
            transaction: getCurrentTransaction(context),
            stepIndex: context.currentStepIndex,
          },
        }),
      }),
      logError: (context, event) => {
        console.error(event);
      },
      logEvent: (context, __, meta) => {
        const key = meta.action.key;
        let data = {};

        switch (key) {
          case 'chain_status_warning':
            data = {
              event_label: 'User got chain down warning',
              event_category: 'transactions',
            };
            break;
          case 'ibc_fee_warning':
            data = { event_label: 'User got IBC fee warning', event_category: 'transactions' };
            break;
          case 'fee_warning':
            data = { event_label: 'User got fee warning', event_category: 'transactions' };
            break;
          case 'confirm_tx':
            data = {
              event_label: 'Confirmed ' + getCurrentTransaction(context).type + ' tx',
              event_category: 'transactions',
            };
            break;
          case 'signed_tx':
            data = {
              event_label: 'Signed ' + getCurrentTransaction(context).type + ' tx',
              event_category: 'transactions',
            };
            break;
          case 'completed_tx':
            data = {
              event_label: 'Completed ' + getCurrentTransaction(context).type + ' tx',
              event_category: 'transactions',
            };
            logAmountVolume(context);
            break;
        }

        event(key, data);
      },
    },

    guards: {
      hasSteps: (context) => context.input.steps.length > 0,
      hasMoreSteps: (context) => context.input.steps.length > context.currentStepIndex + 1,
      hasMoreTransactions: (context) =>
        getCurrentStep(context).transactions.length > context.currentTransactionIndex + 1,
      needsTransferToHub: (context) => {
        if (featureRunning('DEX_AGG')) return false;

        if (context.input.action === 'move') {
          return true;
        }

        if (context.input.action === 'transfer') {
          if (
            getCurrentStep(context).transactions[0].type == 'IBCtransferBackward' ||
            getCurrentStep(context).transactions[0].type == 'IBCtransferForward'
          ) {
            return true;
          }
        }

        if (
          ['swap', 'addliquidity', 'stake', 'multistake'].includes(context.input.action) &&
          context.input.steps.length > 1
        ) {
          return true;
        }

        return false;
      },
      hasMissingFees: (context) => context.fees?.validation?.missingFees?.length > 0,
      hasIBCFeeWarning: (context) => context.fees?.validation?.ibcWarning === true,
    },
  },
);

export type TransactionProcessState = State<TransactionProcessContext, TransactionProcessEvents>;
export type TransactionProcessService = Interpreter<
  TransactionProcessContext,
  TransactionProcessState,
  TransactionProcessEvents
>;
