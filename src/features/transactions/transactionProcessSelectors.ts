import { StepTransaction } from '@/types/actions';

import { TransactionProcessContext } from './transactionProcessMachine';

export const getCurrentTransaction = (context: TransactionProcessContext): StepTransaction => {
  return context.steps[context.currentStepIndex].transactions[context.currentTransactionIndex];
};

export const getTransactionsLength = (context: TransactionProcessContext): number => {
  return context.steps.reduce((acc, item) => acc + item.transactions.length, 0);
};

export const getCurrentTransactionOffset = (context: TransactionProcessContext) => {
  return Math.ceil(
    context.currentStepIndex + context.currentStepIndex / context.steps.length + context.currentTransactionIndex,
  );
};
