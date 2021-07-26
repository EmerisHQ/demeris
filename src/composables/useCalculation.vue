<script lang="ts">
import { useStore } from '@/store';

export default function () {
  const store = useStore();

  // precision setting (0.000000 level precision below than this decimal digits will be truncated)
  const precisionDigits = 10 ** 6;

  function getSwapPrice(payCoinAmount: number, payCoinPoolAmount: number, receiveCoinPoolAmount: number) {
    const swapPrice =
      ((BigInt(payCoinPoolAmount) + BigInt(2 * payCoinAmount)) * BigInt(precisionDigits)) /
      BigInt(receiveCoinPoolAmount);
    return swapPrice;
  }

  function getReceiveCoinAmount(
    payCoinData: { base_denom: string; amount: number },
    payCoinPoolAmount: number,
    receiveCoinPoolAmount: number,
    maxDecimal = 2,
  ) {
    if (payCoinData.amount) {
      const swapFeeRate =
        1 - (store.getters['tendermint.liquidity.v1beta1/getParams']().params?.swap_fee_rate ?? 0.003 / 2); // ?? alert('Error: getDenomPrecision');
      const payCoinBaseDenomDecimalDigits =
        store.getters['demeris/getDenomPrecision']({ name: payCoinData.base_denom }) ?? 6;
      const payCoinBaseDenomAmount = Math.trunc(payCoinData.amount * swapFeeRate * 10 ** payCoinBaseDenomDecimalDigits);
      const decimalMaxDigits = 10 ** maxDecimal;

      const swapPrice = Number(getSwapPrice(payCoinBaseDenomAmount, receiveCoinPoolAmount, payCoinPoolAmount));
      const receiveCoinAmount = BigInt(payCoinBaseDenomAmount * precisionDigits) / BigInt(swapPrice);

      return Math.trunc((Number(receiveCoinAmount) / precisionDigits) * decimalMaxDigits) / decimalMaxDigits;
    } else {
      return 0;
    }
  }

  function getPayCoinAmount(
    receiveCoinData: { base_denom: string; amount: number },
    payCoinPoolAmount: number,
    receiveCoinPoolAmount: number,
    maxDecimal = 2,
  ) {
    const swapFeeRate =
      1 - (store.getters['tendermint.liquidity.v1beta1/getParams']().params?.swap_fee_rate ?? 0.003 / 2);
    const receiveCoinBaseDenomDecimalDigits =
      store.getters['demeris/getDenomPrecision']({ name: receiveCoinData.base_denom }) ?? 6; //?? alert('Error: getDenomPrecision');
    const receiveCoinBaseDenomAmount = Math.trunc(receiveCoinData.amount * 10 ** receiveCoinBaseDenomDecimalDigits);

    const payCoinAmount =
      Number(BigInt(payCoinPoolAmount * precisionDigits) / BigInt(receiveCoinPoolAmount)) /
      (swapFeeRate / receiveCoinBaseDenomAmount - 2 / receiveCoinPoolAmount);

    if (payCoinAmount > 0) {
      return parseFloat(
        String(
          Math.ceil((payCoinAmount / 10 ** receiveCoinBaseDenomDecimalDigits / precisionDigits) * 10 ** maxDecimal) /
            10 ** maxDecimal,
        ),
      );
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
