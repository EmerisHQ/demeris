import BigNumber from 'bignumber.js';
import { ComputedRef, InjectionKey, Ref } from 'vue';
import { Sender } from 'xstate';

import { GlobalDemerisGetterTypes } from '@/store';
import {
  CreatePoolData,
  IBCBackwardsData,
  IBCForwardsData,
  Step,
  StepTransaction,
  SwapData,
  TransferData,
  WithdrawLiquidityData,
} from '@/types/actions';
import { Balance, SwapEndBlockResponse } from '@/types/api';
import { getBaseDenomSync } from '@/utils/actionHandler';
import { event } from '@/utils/analytics';
import { parseCoins } from '@/utils/basic';
import { useStore } from '@/utils/useStore';

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

  return { offset: context.cursor + 1, total: getTransactionsLength(context) };
};

export const getSourceChainFromTransaction = (transaction: StepTransaction): string => {
  const dexChain = useStore().getters[GlobalDemerisGetterTypes.API.getDexChain];

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

export const getSwappedPercent = (endBlock: SwapEndBlockResponse) => {
  return (
    (Number(endBlock.exchanged_offer_coin_amount) /
      (Number(endBlock.remaining_offer_coin_amount) + Number(endBlock.exchanged_offer_coin_amount))) *
    100
  );
};

export const logAmountVolume = (context: TransactionProcessContext) => {
  let baseDenom: string;
  let denomAmount: string;
  let usdAmount: number;

  const lastResult = Object.values(context.results).slice(-1)[0];
  const stepTx = getCurrentTransaction(context);

  const getDisplayPrice = (denom: string, amount: string) => {
    const price = useStore().getters[GlobalDemerisGetterTypes.API.getPrice]({ denom: denom });
    const precision = useStore().getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({ name: denom }) ?? '6';

    return (price * parseInt(amount)) / Math.pow(10, precision);
  };

  switch (stepTx.name) {
    case 'ibc_forward':
      baseDenom = getBaseDenomSync((stepTx.data as IBCForwardsData).amount.denom);
      denomAmount = (stepTx.data as IBCForwardsData).amount.amount;
      usdAmount = getDisplayPrice(baseDenom, denomAmount);

      event('usd_volume', {
        event_label: 'IBC transfer USD volume',
        event_category: 'volume',
        value: usdAmount,
      });
      event('denom_volume', {
        event_label: 'IBC transfer ' + baseDenom + ' volume',
        event_category: 'volume',
        value: denomAmount,
      });
      break;
    case 'ibc_backward':
      baseDenom = getBaseDenomSync((stepTx.data as IBCBackwardsData).amount.denom);
      denomAmount = (stepTx.data as IBCBackwardsData).amount.amount;
      usdAmount = getDisplayPrice(baseDenom, denomAmount);

      event('usd_volume', {
        event_label: 'IBC transfer USD volume',
        event_category: 'volume',
        value: usdAmount,
      });
      event('denom_volume', {
        event_label: 'IBC transfer ' + baseDenom + ' volume',
        event_category: 'volume',
        value: denomAmount,
      });
      break;
    case 'swap':
      baseDenom = getBaseDenomSync((stepTx.data as SwapData).from.denom);
      denomAmount = (stepTx.data as SwapData).from.amount;
      usdAmount = getDisplayPrice(baseDenom, denomAmount);

      const toDenom = getBaseDenomSync((stepTx.data as SwapData).to.denom);

      event('usd_volume', {
        event_label: 'Swap USD volume',
        event_category: 'volume',
        value: usdAmount,
      });
      event('denom_volume', {
        event_label: 'Swap ' + baseDenom + ' volume',
        event_category: 'volume',
        value: Math.floor(
          (parseInt((stepTx.data as SwapData).from.amount) * getSwappedPercent(lastResult.endBlock)) / 100,
        ),
      });
      event('denom_volume', {
        event_label: 'Swap ' + baseDenom + ' -> ' + toDenom + ' volume',
        event_category: 'volume',
        value: Math.floor(
          (parseInt((stepTx.data as SwapData).from.amount) * getSwappedPercent(lastResult.endBlock)) / 100,
        ),
      });
      break;
    case 'createpool':
      baseDenom = getBaseDenomSync((stepTx.data as CreatePoolData).coinA.denom);
      denomAmount = (stepTx.data as CreatePoolData).coinA.amount;
      usdAmount = getDisplayPrice(baseDenom, denomAmount);

      const baseDenomB = getBaseDenomSync((stepTx.data as CreatePoolData).coinB.denom);
      const denomAmountB = (stepTx.data as CreatePoolData).coinB.amount;
      const usdAmountB = getDisplayPrice(baseDenomB, denomAmountB);

      event('usd_volume', {
        event_label: 'Create Pool USD volume',
        event_category: 'volume',
        value: usdAmount + usdAmountB,
      });
      event('denom_volume', {
        event_label: 'Create Pool ' + baseDenom + ' volume',
        event_category: 'volume',
        value: denomAmount,
      });
      event('denom_volume', {
        event_label: 'Create Pool ' + baseDenomB + ' volume',
        event_category: 'volume',
        value: denomAmountB,
      });
      break;
    case 'addliquidity':
      const coins = parseCoins(lastResult.endBlock.accepted_coins);

      baseDenom = getBaseDenomSync(coins[0].denom);
      denomAmount = coins[0].amount;
      usdAmount = getDisplayPrice(baseDenom, denomAmount);

      const baseDenom2 = getBaseDenomSync(coins[1].denom);
      const denomAmount2 = coins[1].amount;
      const usdAmount2 = getDisplayPrice(baseDenom2, denomAmount2);

      event('usd_volume', {
        event_label: 'Add Liquidity USD volume',
        event_category: 'volume',
        value: usdAmount + usdAmount2,
      });
      event('denom_volume', {
        event_label: 'Add Liquidity ' + baseDenom + ' volume',
        event_category: 'volume',
        value: denomAmount,
      });
      event('denom_volume', {
        event_label: 'Add Liquidity ' + baseDenom2 + ' volume',
        event_category: 'volume',
        value: denomAmount2,
      });
      break;
    case 'withdrawliquidity':
      const amounts = parseCoins(lastResult.endBlock.withdraw_coins);

      baseDenom = getBaseDenomSync(amounts[0].denom);
      denomAmount = amounts[0].amount;
      usdAmount = getDisplayPrice(baseDenom, denomAmount);

      const usdAmountWithdraw = getDisplayPrice(getBaseDenomSync(amounts[1].denom), amounts[1].amount);

      const poolCoin = (stepTx.data as WithdrawLiquidityData).poolCoin.denom;
      const displayName =
        useStore().getters[GlobalDemerisGetterTypes.API.getVerifiedDenoms]?.find((x) => x.name == poolCoin)
          ?.display_name ?? null;

      event('usd_volume', {
        event_label: 'Withdraw Liquidity USD volume',
        event_category: 'volume',
        value: usdAmount + usdAmountWithdraw,
      });
      event('denom_volume', {
        event_label: 'Withdraw Liquidity ' + displayName + ' volume',
        event_category: 'volume',
        value: new BigNumber((stepTx.data as WithdrawLiquidityData).poolCoin.amount).shiftedBy(-6),
      });
      break;
    case 'transfer':
      baseDenom = getBaseDenomSync((stepTx.data as TransferData).amount.denom);
      denomAmount = (stepTx.data as TransferData).amount.amount;
      usdAmount = getDisplayPrice(baseDenom, denomAmount);

      event('usd_volume', {
        event_label: 'Transfer USD volume',
        event_category: 'volume',
        value: usdAmount,
      });
      event('denom_volume', {
        event_label: 'Transfer ' + baseDenom + ' volume',
        event_category: 'volume',
        value: denomAmount,
      });
      break;
  }
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
  minimizeModal: () => void;
};

export const ProvideViewerKey: InjectionKey<ProvideViewerSchema> = Symbol('processViewer');

export type DoneEventData<T> = { type: string; data: T };
