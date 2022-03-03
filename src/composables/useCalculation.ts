import { useStore } from 'vuex'

import { GlobalDemerisGetterTypes } from '@/store'

export default function useCalculation() {
  // precision setting (0.000000 level precision below than this decimal digits will be truncated)
  const precisionDigits = 10 ** 9
  const store = useStore()

  function getSwapPrice(payCoinAmount: number, payCoinPoolAmount: number, receiveCoinPoolAmount: number) {
    return (payCoinPoolAmount + 2 * payCoinAmount) / receiveCoinPoolAmount
  }

  function getReceiveCoinAmount(
    payCoinData: { base_denom: string; amount: number },
    payCoinPoolAmount: number,
    receiveCoinPoolAmount: number,
  ) {
    if (payCoinData.amount) {
      const feeRate =
        1 - (parseFloat(store.getters['tendermint.liquidity.v1beta1/getParams']().params?.swap_fee_rate) ?? 0.003) / 2

      const payCoinBaseDenomDecimalDigits =
        store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({ name: payCoinData.base_denom }) ?? 6
      const payCoinBaseDenomAmount = Math.trunc(payCoinData.amount * 10 ** payCoinBaseDenomDecimalDigits)
      const swapPrice = getSwapPrice(payCoinBaseDenomAmount, receiveCoinPoolAmount, payCoinPoolAmount)
      const receiveCoinAmount = Number(payCoinBaseDenomAmount / swapPrice) * feeRate

      return Math.trunc(receiveCoinAmount)
    } else {
      return 0
    }
  }

  function getPayCoinAmount(
    receiveCoinData: { base_denom: string; amount: number },
    payCoinPoolAmount: number,
    receiveCoinPoolAmount: number,
    maxDecimal = 4,
  ) {
    const swapFeeRate = 1
    const receiveCoinBaseDenomDecimalDigits =
      store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({ name: receiveCoinData.base_denom }) ?? 6 //?? alert('Error: getDenomPrecision');
    const receiveCoinBaseDenomAmount = Math.trunc(
      receiveCoinData.amount * 10 ** receiveCoinBaseDenomDecimalDigits * 1.00150225,
    )
    const payCoinAmount =
      Number(BigInt(payCoinPoolAmount * precisionDigits) / BigInt(receiveCoinPoolAmount)) /
      (swapFeeRate / receiveCoinBaseDenomAmount - 2 / receiveCoinPoolAmount)

    if (payCoinAmount > 0) {
      return parseFloat(
        String(
          Math.ceil((payCoinAmount / 10 ** receiveCoinBaseDenomDecimalDigits / precisionDigits) * 10 ** maxDecimal) /
            10 ** maxDecimal,
        ),
      )
    } else {
      return 0
    }
  }

  function getPrecision(denom) {
    const chains = store.getters[GlobalDemerisGetterTypes.API.getChains]
    const denomPrecisionIndexer = {}

    for (const chain in chains) {
      chains[chain].denoms.forEach((item) => {
        denomPrecisionIndexer[item.name] = item
      })
    }

    return Number(denomPrecisionIndexer[denom].precision)
  }

  function getPrecisedAmount(denom, amount) {
    try {
      const precision = getPrecision(denom)
      return parseInt(amount) / 10 ** precision
    } catch {
      return amount
    }
  }

  function calculateSlippage(swapAmount, poolReserve) {
    let slippage = (2 * swapAmount) / poolReserve

    if (slippage > 0.997) {
      slippage = 0.997
    }

    return slippage
  }

  return {
    calculateSlippage,
    getSwapPrice,
    getPayCoinAmount,
    getReceiveCoinAmount,
    getPrecision,
    getPrecisedAmount,
  }
}
