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

  function getSwapPrice(payCoinAmount: number, fromCoinPoolAmount: number, toCoinPoolAmount: number) {
    //TODO: get params to get half-half fee
    const swapPrice = (fromCoinPoolAmount + 2 * payCoinAmount) / toCoinPoolAmount;
    return swapPrice;
  }
  //TODO: bigInt
  function getReceiveCoinAmount(payCoinAmount: number, payCoinPoolAmount: number, receiveCoinPoolAmount: number) {
    const swapFeeRate = 0.9985;
    const swapPrice = (payCoinPoolAmount + 2 * payCoinAmount) / receiveCoinPoolAmount;
    const receiveCoinAmount = (payCoinAmount / swapPrice) * swapFeeRate;

    return receiveCoinAmount;
  }

  function getPayCoinAmount(receiveCoinAmount: number, payCoinPoolAmount: number, receiveCoinPoolAmount: number) {
    const swapFeeRate = 0.9985;
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
