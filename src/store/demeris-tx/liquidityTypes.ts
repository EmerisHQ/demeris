/* eslint-disable @typescript-eslint/naming-convention */
import {
  MsgCreatePool,
  MsgDepositWithinBatch,
  MsgSwapWithinBatch,
  MsgWithdrawWithinBatch,
} from '@clockwork-projects/cosmos-gaia-js/gravity-devs/liquidity/tendermint.liquidity.v1beta1/module/types/tendermint/liquidity/v1beta1/tx';
import { AminoMsg } from '@cosmjs/amino';
import { AminoMsg } from '@cosmjs/amino';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import Long from 'long';
export interface AminoMsgCreatePool extends AminoMsg {
  readonly type: 'liquidity/MsgCreatePool';
  readonly value: {
    /** Bech32 account address */
    readonly pool_creator_address: string;
    readonly pool_type_id: number;
    readonly deposit_coins: readonly Coin[];
  };
}

export interface AminoMsgSwapWithinBatch extends AminoMsg {
  readonly type: 'liquidity/MsgSwapWithinBatch';
  readonly value: {
    /** Bech32 account address */
    readonly swap_requester_address: string;
    readonly pool_id: string;
    readonly swap_type_id: number;
    readonly offer_coin: Coin;
    readonly demand_coin_denom: string;
    readonly offer_coin_fee: Coin;
    readonly order_price: string;
  };
}

export interface AminoMsgDepositWithinBatch extends AminoMsg {
  readonly type: 'liquidity/MsgDepositWithinBatch';
  readonly value: {
    /** Bech32 account address */
    readonly depositor_address: string;
    readonly pool_id: string;
    readonly deposit_coins: readonly Coin[];
  };
}

export interface AminoMsgWithdrawWithinBatch extends AminoMsg {
  readonly type: 'liquidity/MsgWithdrawWithinBatch';
  readonly value: {
    /** Bech32 account address */
    readonly withdrawer_address: string;
    readonly pool_id: string;
    readonly pool_coin: Coin;
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

export const liquidityTypes = {
  '/tendermint.liquidity.v1beta1.MsgCreatePool': {
    aminoType: 'liquidity/MsgCreatePool',
    toAmino: ({ poolCreatorAddress, poolTypeId, depositCoins }: MsgCreatePool): AminoMsgCreatePool['value'] => ({
      pool_creator_address: poolCreatorAddress,
      pool_type_id: poolTypeId,
      deposit_coins: [...depositCoins],
    }),
    fromAmino: ({ pool_creator_address, pool_type_id, deposit_coins }: AminoMsgCreatePool['value']): MsgCreatePool => ({
      poolCreatorAddress: pool_creator_address,
      poolTypeId: pool_type_id,
      depositCoins: [...deposit_coins],
    }),
  },
  '/tendermint.liquidity.v1beta1.MsgSwapWithinBatch': {
    aminoType: 'liquidity/MsgSwapWithinBatch',
    toAmino: ({
      swapRequesterAddress,
      poolId,
      swapTypeId,
      offerCoin,
      demandCoinDenom,
      offerCoinFee,
      orderPrice,
    }: MsgSwapWithinBatch): AminoMsgSwapWithinBatch['value'] => {
      const order_price = orderPrice.split('');
      while (order_price.length < 19) {
        order_price.unshift('0');
      }
      order_price.splice(order_price.length - 18, 0, '.');
      return {
        swap_requester_address: swapRequesterAddress,
        pool_id: '' + omitDefault(poolId)?.toString(),
        swap_type_id: swapTypeId,
        offer_coin: offerCoin,
        demand_coin_denom: demandCoinDenom,
        offer_coin_fee: offerCoinFee,
        order_price: order_price.join(''),
      };
    },
    fromAmino: ({
      swap_requester_address,
      pool_id,
      swap_type_id,
      offer_coin,
      demand_coin_denom,
      offer_coin_fee,
      order_price,
    }: AminoMsgSwapWithinBatch['value']): MsgSwapWithinBatch => ({
      swapRequesterAddress: swap_requester_address,
      poolId: parseInt(pool_id) || 0,
      swapTypeId: swap_type_id,
      offerCoin: offer_coin,
      demandCoinDenom: demand_coin_denom,
      offerCoinFee: offer_coin_fee,
      orderPrice: parseFloat(order_price).toFixed(18).replace('.', '').replace(/(^0+)/, ''),
    }),
  },
  '/tendermint.liquidity.v1beta1.MsgDepositWithinBatch': {
    aminoType: 'liquidity/MsgDepositWithinBatch',
    toAmino: ({
      depositorAddress,
      poolId,
      depositCoins,
    }: MsgDepositWithinBatch): AminoMsgDepositWithinBatch['value'] => ({
      depositor_address: depositorAddress,
      pool_id: omitDefault(poolId)?.toString(),
      deposit_coins: [...depositCoins],
    }),
    fromAmino: ({
      depositor_address,
      pool_id,
      deposit_coins,
    }: AminoMsgDepositWithinBatch['value']): MsgDepositWithinBatch => ({
      depositorAddress: depositor_address,
      poolId: parseInt(pool_id) || 0,
      depositCoins: [...deposit_coins],
    }),
  },
  '/tendermint.liquidity.v1beta1.MsgWithdrawWithinBatch': {
    aminoType: 'liquidity/MsgWithdrawWithinBatch',
    toAmino: ({
      withdrawerAddress,
      poolId,
      poolCoin,
    }: MsgWithdrawWithinBatch): AminoMsgWithdrawWithinBatch['value'] => ({
      withdrawer_address: withdrawerAddress,
      pool_id: omitDefault(poolId)?.toString(),
      pool_coin: poolCoin,
    }),
    fromAmino: ({
      withdrawer_address,
      pool_id,
      pool_coin,
    }: AminoMsgWithdrawWithinBatch['value']): MsgWithdrawWithinBatch => ({
      withdrawerAddress: withdrawer_address,
      poolId: parseInt(pool_id) || 0,
      poolCoin: pool_coin,
    }),
  },
};
