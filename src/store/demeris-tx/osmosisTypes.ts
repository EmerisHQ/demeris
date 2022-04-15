import { MsgSwapExactAmountIn } from '@clockwork-projects/osmosis-labs-osmosis-js/osmosis-labs/osmosis/osmosis.gamm.v1beta1/module/types/osmosis/gamm/v1beta1/tx';
import { AminoMsg } from '@cosmjs/amino';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import Long from 'long';
export interface AminoMsgSwapExactAmountIn extends AminoMsg {
  readonly type: 'osmosis/gamm/swap-exact-amount-in';
  readonly value: {
    /** Bech32 account address */
    readonly sender: string;
    readonly routes: Array<{ poolId: string; tokenOutDenom: string }>;
    readonly tokenIn: Coin | undefined;
    readonly tokenOutMinAmount: string;
  };
}

function omitDefault<T extends string | number | Long>(input: T): T | undefined {
  if (typeof input === 'string') {
    return input === '' ? undefined : input;
  }

  if (typeof input === 'number') {
    return input === 0 ? undefined : input;
  }

  if (Long.isLong(input)) {
    return input.isZero() ? undefined : input;
  }

  throw new Error(`Got unsupported type '${typeof input}'`);
}

export const osmosisTypes = {
  '/osmosis.gamm.v1beta1.MsgSwapExactAmountIn': {
    aminoType: 'osmosis/gamm/swap-exact-amount-in',
    toAmino: ({
      sender,
      routes,
      tokenIn,
      tokenOutMinAmount,
    }: MsgSwapExactAmountIn): AminoMsgSwapExactAmountIn['value'] => ({
      sender,
      routes: routes.map((x) => {
        return { poolId: omitDefault(x.poolId)?.toString(), tokenOutDenom: x.tokenOutDenom };
      }),
      tokenIn,
      tokenOutMinAmount,
    }),
    fromAmino: ({
      sender,
      routes,
      tokenIn,
      tokenOutMinAmount,
    }: AminoMsgSwapExactAmountIn['value']): MsgSwapExactAmountIn => ({
      sender,
      routes: routes.map((x) => {
        return { poolId: parseInt(x.poolId) || 0, tokenOutDenom: x.tokenOutDenom };
      }),
      tokenIn,
      tokenOutMinAmount,
    }),
  },
};
