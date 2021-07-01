import { Decimal, Uint53 } from '@cosmjs/math';

export default function useSwapCalculation() {
  const test = (amount) => {
    const fractionalDigits = 18;
    const decimalAmount = Decimal.fromUserInput(amount, fractionalDigits);
    return decimalAmount.multiply(new Uint53(100)).toFloatApproximation();
  };

  return { test };
}
