import { MsgSwapExactAmountIn } from '@clockwork-projects/osmosis-labs-osmosis-js/osmosis-labs/osmosis/osmosis.gamm.v1beta1/module/types/osmosis/gamm/v1beta1/tx';
import { AminoMsg } from '@cosmjs/amino';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';

export interface AminoMsgSwapExactAmountIn extends AminoMsg {
  readonly type: 'osmosis/gamm/swap-exact-amount-in';
  readonly value: {
    /** Bech32 account address */
    readonly sender: string;
    readonly routes: Array<{ poolId: number; tokenOutDenom: string }>;
    readonly tokenIn: Coin | undefined;
    readonly tokenOutMinAmount: string;
  };
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
      routes,
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
      routes,
      tokenIn,
      tokenOutMinAmount,
    }),
  },
};
