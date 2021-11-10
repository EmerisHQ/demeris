import { store as globalStore } from '@/store';
import { IBCForwardsData, Step, StepTransaction, TransferData } from '@/types/actions';

import { TransactionProcessContext } from './transactionProcessMachine';

export const getCurrentStep = (context: TransactionProcessContext): Step => {
  return context.steps[context.currentStepIndex];
};

export const getCurrentTransaction = (context: TransactionProcessContext): StepTransaction => {
  return context.steps[context.currentStepIndex].transactions[context.currentTransactionIndex];
};

export const getTransactionsLength = (context: TransactionProcessContext): number => {
  return context.steps.reduce((acc, item) => acc + item.transactions.length, 0);
};

export const getOffsetFromCurrentTransaction = (context: TransactionProcessContext) => {
  return Math.ceil(
    context.currentStepIndex + context.currentStepIndex / context.steps.length + context.currentTransactionIndex,
  );
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
