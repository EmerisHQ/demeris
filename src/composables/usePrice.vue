<script lang="ts">
export default function () {
  // common setting
  const priceDecimalDigit = 6;

  //TODO: get price
  function getCoinPrice(coin: string) {
    if (coin) {
      return 2;
    } else {
      return 0;
    }
  }

  function getCoinDollarValue(coin: string, amount: number, prefix = '') {
    if (coin && amount) {
      const price = getCoinPrice(coin);
      return `${prefix}$${(amount * price).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    } else {
      return '';
    }
  }

  function getPoolPrice(payCoin: string, receiveCoin: string) {
    //TODO
    if (payCoin && receiveCoin) {
      return 2;
    } else {
      return null;
    }
  }

  function getSwapPrice(payCoinAmount: number, fromCoinPoolAmount: number, toCoinPoolAmount: number) {
    //TODO: get params to get half-half fee, pay coin amount should be modified
    const swapPrice =
      ((BigInt(fromCoinPoolAmount) + BigInt(2) * BigInt(payCoinAmount)) * BigInt(10 ** priceDecimalDigit)) /
      BigInt(toCoinPoolAmount);
    console.log('function swapPrice', swapPrice);
    return swapPrice;
  }
  //TODO: bigInt
  function getReceiveCoinAmount(
    payCoinAmount: number,
    payCoinPoolAmount: number,
    receiveCoinPoolAmount: number,
    maxDecimal = 2,
  ) {
    if (payCoinAmount !== null) {
      const swapFeeRate = 0.9985; // TODO: get params

      const maxDecimalMultiplier = BigInt(10 ** maxDecimal);
      const swapPrice = Number(getSwapPrice(payCoinAmount, receiveCoinPoolAmount, payCoinPoolAmount));

      const receiveCoinAmount =
        ((BigInt(payCoinAmount) * BigInt(10 ** 12)) / BigInt(swapPrice)) * BigInt(maxDecimalMultiplier);

      return (Number(receiveCoinAmount) / 10 ** 8) * swapFeeRate;
    } else {
      return 0;
    }
  }

  function getPayCoinAmount(
    receiveCoinAmount: number,
    payCoinPoolAmount: number,
    receiveCoinPoolAmount: number,
    maxDecimal = 2,
  ) {
    const swapFeeRate = 0.9985; // TODO: get params

    const payCoinAmount =
      payCoinPoolAmount / receiveCoinPoolAmount / (swapFeeRate / receiveCoinAmount - 2 / receiveCoinPoolAmount);
    console.log('payCoinAmount', payCoinAmount);
    return payCoinAmount;
  }

  return {
    getCoinPrice,
    getCoinDollarValue,
    getPoolPrice,
    getSwapPrice,
    getPayCoinAmount,
    getReceiveCoinAmount,
  };
}
</script>
