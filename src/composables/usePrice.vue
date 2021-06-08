<script lang="ts">
export default function () {
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

  function getSwapPrice(
    payCoinAmount: number,
    fromCoinPoolAmount: number,
    toCoinPoolAmount: number,
    priceDecimalDigit = 6,
  ) {
    //TODO: get params to get half-half fee
    const swapPrice =
      ((BigInt(fromCoinPoolAmount) + BigInt(2) * BigInt(payCoinAmount)) * BigInt(10 ** priceDecimalDigit)) /
      BigInt(toCoinPoolAmount);
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
      const swapFeeRate = 0.9985;
      const priceDecimalDigit = 6;
      const maxDecimalMultiplier = BigInt(10 ** maxDecimal);
      const swapPrice =
        (Number(getSwapPrice(payCoinAmount, receiveCoinPoolAmount, payCoinPoolAmount, priceDecimalDigit)) /
          10 ** priceDecimalDigit) *
        10 ** 6;
      console.log(swapPrice);
      const receiveCoinAmount =
        ((BigInt(payCoinAmount) * BigInt(10 ** 12)) / BigInt(swapPrice)) * BigInt(maxDecimalMultiplier);
      console.log(swapPrice, receiveCoinAmount);
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
    const swapFeeRate = 0.9985;
    console.log(maxDecimal);
    const payCoinAmount =
      payCoinPoolAmount / receiveCoinPoolAmount / (swapFeeRate / receiveCoinAmount - 2 / receiveCoinPoolAmount);
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
