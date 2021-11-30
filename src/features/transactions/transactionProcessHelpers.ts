import { ComputedRef, InjectionKey, Ref } from 'vue';
import { Sender } from 'xstate';

import { store as globalStore } from '@/store';
import { IBCBackwardsData, IBCForwardsData, Step, StepTransaction, TransferData } from '@/types/actions';
import { Balance } from '@/types/api';
import { parseCoins } from '@/utils/basic';

import {
  TransactionProcessContext,
  TransactionProcessEvents,
  TransactionProcessState,
} from './transactionProcessMachine';

export const getCurrentStep = (context: TransactionProcessContext): Step => {
  return context.formattedSteps[context.currentStepIndex];
};

export const getCurrentTransaction = (context: TransactionProcessContext): StepTransaction => {
  return context.formattedSteps[context.currentStepIndex].transactions[context.currentTransactionIndex];
};

export const getTransactionsLength = (context: TransactionProcessContext): number => {
  return context.formattedSteps.reduce((acc, item) => acc + item.transactions.length, 0);
};

export const getTransactionOffset = (context: TransactionProcessContext) => {
  if (getTransactionsLength(context) <= 1) {
    return undefined;
  }

  return { offset: context.cursor + 1, total: context.formattedSteps.length };
};

export const getSourceChainFromTransaction = (transaction: StepTransaction): string => {
  const dexChain = globalStore.getters['demeris/getDexChain'];

  switch (transaction.name) {
    case 'transfer':
      return (transaction.data as TransferData).chain_name;
    case 'ibc_forward':
      return (transaction.data as IBCForwardsData).from_chain;
    case 'ibc_backward':
      return (transaction.data as IBCForwardsData).from_chain;
    default:
      return dexChain;
  }
};

export const getTransactionFromAction = (context: TransactionProcessContext): StepTransaction => {
  if (context.input.action === 'move') {
    return context.formattedSteps[0].transactions[0];
  }

  return context.formattedSteps.find((item) => item.name === context.input.action).transactions[0];
};

export const isSwapAction = (context: TransactionProcessContext) => {
  return context.input.action === 'swap';
};

export const formatStepsWithFee = (context: TransactionProcessContext, balances: Balance[]): Step[] => {
  return context.input.steps.map((step) => {
    return {
      ...step,
      transactions: step.transactions.map((transaction) => {
        if (transaction.addFee) {
          const sourceBalance = balances.find((balance) => {
            const amount = parseCoins(balance.amount)[0];
            return (
              amount.denom === (transaction.data as IBCBackwardsData).amount.denom &&
              balance.base_denom === transaction.feeToAdd[0].denom
            );
          });

          if (sourceBalance) {
            const amount = parseInt(parseCoins(sourceBalance.amount)[0].amount);
            const fee = parseInt(transaction.feeToAdd[0].amount[context.input.gasPriceLevel]);
            const txAmount = parseInt((transaction.data as IBCBackwardsData).amount.amount);
            if (txAmount + fee > amount) {
              if (txAmount === amount) {
                transaction.feeToAdd = [];
                transaction.addFee = false;
              } else {
                transaction.feeToAdd[0].amount[context.input.gasPriceLevel] = amount - fee + '';
              }
            }
          }

          const baseDenomBalance = balances.find((balance) => {
            const amount = parseCoins(balance.amount)[0];
            return amount.denom == balance.base_denom && balance.base_denom == transaction.feeToAdd[0].denom;
          });

          if (baseDenomBalance) {
            const amount = parseCoins(baseDenomBalance.amount)[0];
            if (parseInt(transaction.feeToAdd[0].amount[context.input.gasPriceLevel]) < parseInt(amount.amount)) {
              transaction.feeToAdd = [];
              transaction.addFee = false;
            }
          }
        }

        if (transaction.name == 'ibc_forward') {
          const baseDenomBalance = balances.find((x) => {
            const amount = parseCoins(x.amount)[0];
            return amount.denom == x.base_denom && x.base_denom == (transaction.data as IBCForwardsData).amount.denom;
          });

          const fee =
            parseInt((transaction.data as IBCForwardsData).chain_fee[0].amount[context.input.gasPriceLevel]) *
            context.input.gasLimit;
          const txAmount = parseInt((transaction.data as IBCForwardsData).amount.amount);
          if (baseDenomBalance) {
            const amount = parseCoins(baseDenomBalance.amount)[0];
            if (parseInt(amount.amount) - txAmount < fee) {
              (transaction.data as IBCForwardsData).amount.amount = parseInt(amount.amount) - fee + '';
            }
          } else {
            (transaction.data as IBCForwardsData).amount.amount = txAmount - fee + '';
          }
        }
        return transaction;
      }),
    };
  });
};

export const matchesObject = <T>(obj: Record<string, T>, callback: (key: string) => boolean) => {
  return Object.entries(obj).find(([key, value]) => {
    if (callback(key)) {
      return value;
    }
  })?.[1];
};

export const getExplorerLink = (chainName: string) => {
  const chainMintScanMap = {
    'cosmos-hub': 'cosmos',
    akash: 'akash',
    'crypto-org': 'crypto-org',
    iris: 'iris',
    osmosis: 'osmosis',
    persistence: 'persistence',
    sentinel: 'sentinel',
  };
  const chain = chainMintScanMap[chainName];

  if (!chain) {
    return;
  }

  return `https://www.mintscan.io/${chain}`;
};

export const getExplorerTx = (tx: { txhash: string; chain_name: string }) => {
  return `${getExplorerLink(tx.chain_name)}/txs/${tx.txhash}`;
};

export type ProvideViewerSchema = {
  actor: {
    state: Ref<TransactionProcessState>;
    send: Sender<TransactionProcessEvents>;
  };
  isSwapComponent: ComputedRef<boolean>;
  stepId: string;
  removeTransactionAndClose: () => void;
  closeModal: () => void;
};

export const ProvideViewerKey: InjectionKey<ProvideViewerSchema> = Symbol('processViewer');

export type DoneEventData<T> = { type: string; data: T };
