import BigNumber from 'bignumber.js';

import { GasPriceLevel } from '@/types/actions';
import { getFeeForChain } from '@/utils/actionHandler';

import { SwapContext } from '../state';
import { amountToHuman } from './amount';
import { getVerifiedDenoms } from './denom';
import { activeSupportedProtocolChains } from './protocol';

export const calculateInputAmountWithTransactionFees = (
  context: SwapContext,
  inputAmount: string,
  gasLimit: number,
  gasPriceLevel = GasPriceLevel.AVERAGE,
): string => {
  if (!context.inputCoin?.chain) return;
  if (!inputAmount) return;

  const { chain: sourceChain, denom, baseDenom } = context.inputCoin;

  // If the input chain is a DEX, we don't need to calculate transaction fee
  if (activeSupportedProtocolChains.some((protocolChain) => protocolChain === sourceChain)) {
    return inputAmount;
  }

  // Calculate fee to move from source chain > native chain > DEX chain
  const nativeChain = getVerifiedDenoms().find((chain) => chain.denom === baseDenom)?.chain;
  if (!nativeChain) return inputAmount;

  const chainFees = getFeeForChain(nativeChain);

  const denomFee = chainFees.find((fee) => fee.denom === baseDenom);

  if (!denomFee) return inputAmount;

  const feeLevel = denomFee.amount[gasPriceLevel];
  const requiredFee = new BigNumber(feeLevel).times(gasLimit);

  if (requiredFee.isZero()) return inputAmount;

  const fee = amountToHuman({ amount: requiredFee.toString(), denom });

  return new BigNumber(inputAmount).minus(fee.amount).toString();
};
