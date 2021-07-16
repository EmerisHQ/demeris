<script lang="ts">
import { useStore } from '@/store';

export default function () {
  const store = useStore();

  // common setting
  const precisionDigits = 10 ** 6;
  const demomDigits = 6; // example: 1 atom => 1000000uatom

  function getSwapPrice(payCoinAmount: number, fromCoinPoolAmount: number, toCoinPoolAmount: number) {
    const swapPrice =
      ((BigInt(fromCoinPoolAmount) + BigInt(2) * BigInt(payCoinAmount)) * BigInt(precisionDigits)) /
      BigInt(toCoinPoolAmount);
    return swapPrice;
  }

  function getReceiveCoinAmount(
    payCoinAmount: number,
    payCoinPoolAmount: number,
    receiveCoinPoolAmount: number,
    maxDecimal = 2,
  ) {
    if (payCoinAmount) {
      const decimalMaxDigits = 10 ** maxDecimal;
      const swapFeeRate =
        1 - (store.getters['tendermint.liquidity.v1beta1/getParams']().params?.swap_fee_rate ?? 0.003 / 2);
      const swapPrice = Number(getSwapPrice(payCoinAmount, receiveCoinPoolAmount, payCoinPoolAmount));

      const receiveCoinAmount = BigInt(payCoinAmount * precisionDigits) / BigInt(swapPrice);

      return Math.trunc((Number(receiveCoinAmount) / precisionDigits) * decimalMaxDigits) / decimalMaxDigits;
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
    const swapFeeRate =
      1 - (store.getters['tendermint.liquidity.v1beta1/getParams']().params?.swap_fee_rate ?? 0.003 / 2);
    const receiveCoinMinimalDenomAmount = Math.trunc(receiveCoinAmount * 10 ** demomDigits);
    const decimalMaxDigits = 10 ** maxDecimal;
    const payCoinAmount =
      payCoinPoolAmount /
      receiveCoinPoolAmount /
      (swapFeeRate / receiveCoinMinimalDenomAmount - 2 / receiveCoinPoolAmount);

    if (payCoinAmount > 0) {
      return Math.trunc(Number((payCoinAmount / 10 ** demomDigits) * decimalMaxDigits)) / decimalMaxDigits;
    } else {
      return 0;
    }
  }

  function getPrecision(denom) {
    const chains = store.getters['demeris/getChains'];
    const denomPrecisionIndexer = {};

    for (let chain in chains) {
      chains[chain].denoms.forEach((item) => {
        denomPrecisionIndexer[item.name] = item;
      });
    }

    return Number(denomPrecisionIndexer[denom].precision);
  }

  function getPrecisedAmount(denom, amount) {
    try {
      const precision = getPrecision(denom);
      return parseInt(amount) / 10 ** precision;
    } catch {
      return amount;
    }
  }

  function calculateSlippage(swapAmount, poolReserve) {
    let slippage = (2 * swapAmount) / poolReserve;

    if (slippage > 0.997) {
      slippage = 0.997;
    }

    return slippage;
  }

  return {
    calculateSlippage,
    getSwapPrice,
    getPayCoinAmount,
    getReceiveCoinAmount,
    getPrecision,
    getPrecisedAmount,
  };
}
</script>
