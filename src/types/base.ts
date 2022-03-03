export type Amount = {
  denom: string
  amount: string
  chain_name?: string
}
export type ChainAmount = {
  amount: Amount
  chain_name: string
}

export type AmountWithMeta = Amount & {
  coinDenom: string
  coinMinimalDenom: string
  coinDecimals: number
}
