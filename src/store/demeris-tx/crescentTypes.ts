import { MsgClaim } from '@clockwork-projects/crescent-network-crescent-js/crescent-network/crescent/crescent.claim.v1beta1/module/types/crescent/claim/v1beta1/tx';
import {
  MsgHarvest,
  MsgStake,
  MsgUnstake,
} from '@clockwork-projects/crescent-network-crescent-js/crescent-network/crescent/crescent.farming.v1beta1/module/types/crescent/farming/v1beta1/tx';
import {
  MsgDeposit,
  MsgLimitOrder,
  MsgWithdraw,
} from '@clockwork-projects/crescent-network-crescent-js/crescent-network/crescent/crescent.liquidity.v1beta1/module/types/crescent/liquidity/v1beta1/tx';
import {
  MsgLiquidStake,
  MsgLiquidUnstake,
} from '@clockwork-projects/crescent-network-crescent-js/crescent-network/crescent/crescent.liquidstaking.v1beta1/module/types/crescent/liquidstaking/v1beta1/tx';
import { AminoMsg, Coin } from '@cosmjs/amino';
import BigNumber from 'bignumber.js';
import Long from 'long';

export interface AminoMsgClaim extends AminoMsg {
  readonly type: 'liquidstaking/MsgLiquidStake';
  readonly value: {
    airdrop_id: string;
    recipient: string;
    condition_type: number;
  };
}
export interface AminoMsgLiquidStake extends AminoMsg {
  readonly type: 'liquidstaking/MsgLiquidStake';
  readonly value: {
    /** Bech32 account address */
    delegator_address: string;
    amount: Coin | undefined;
  };
}
export interface AminoMsgLiquidUnstake extends AminoMsg {
  readonly type: 'liquidstaking/MsgLiquidUnstake';
  readonly value: {
    /** Bech32 account address */
    delegator_address: string;
    amount: Coin | undefined;
  };
}
// export interface MsgDeposit {
//   /** depositor specifies the bech32-encoded address that makes a deposit to the pool */
//   depositor: string;
//   /** pool_id specifies the pool id */
//   pool_id: string;
//   /** deposit_coins specifies the amount of coins to deposit. */
//   deposit_coins: Coin[];
// }
export interface AminoMsgDeposit extends AminoMsg {
  readonly type: 'liquidity/MsgDeposit';
  readonly value: {
    /** Bech32 account address */
    depositor: string;
    /** pool_id specifies the pool id */
    pool_id: string;
    /** deposit_coins specifies the amount of coins to deposit. */
    deposit_coins: Coin[];
  };
}
export interface AminoMsgWithdraw extends AminoMsg {
  readonly type: 'liquidity/MsgWithdraw';
  readonly value: {
    /** Bech32 account address */
    withdrawer: string;
    /** pool_id specifies the pool id */
    pool_id: string;
    /** deposit_coins specifies the amount of coins to deposit. */
    pool_coin: Coin | undefined;
  };
}
export interface AminoMsgLimitOrder extends AminoMsg {
  readonly type: 'liquidity/MsgLimitOrder';
  readonly value: {
    orderer: string;
    pair_id: string;
    direction: number;
    offer_coin: Coin | undefined;
    demand_coin_denom: string;
    price: string;
    amount: string;
    order_lifespan: string | undefined;
  };
}
export interface AminoMsgStake extends AminoMsg {
  readonly type: 'farming/MsgStake';
  readonly value: {
    farmer: string;
    staking_coins: Coin[];
  };
}
export interface AminoMsgUnstake extends AminoMsg {
  readonly type: 'farming/MsgUnstake';
  readonly value: {
    farmer: string;
    unstaking_coins: Coin[];
  };
}
export interface AminoMsgHarvest extends AminoMsg {
  readonly type: 'farming/MsgHarvest';
  readonly value: {
    farmer: string;
    staking_coin_denoms: string[];
  };
}
function _omitDefault<T extends string | number | Long>(input: T): T | undefined {
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
export const crescentTypes = {
  '/crescent.claim.v1beta1.MsgClaim': {
    aminoType: 'claim/MsgClaim',
    toAmino: ({ airdropId, recipient, conditionType }: MsgClaim): AminoMsgClaim['value'] => ({
      airdrop_id: String(airdropId),
      recipient,
      condition_type: Number(conditionType),
    }),
    fromAmino: ({ airdrop_id, recipient, condition_type }: AminoMsgClaim['value']): MsgClaim => ({
      airdropId: Number(airdrop_id),
      recipient,
      conditionType: condition_type,
    }),
  },
  '/crescent.liquidstaking.v1beta1.MsgLiquidStake': {
    aminoType: 'liquidstaking/MsgLiquidStake',
    toAmino: ({ delegatorAddress, amount }: MsgLiquidStake): AminoMsgLiquidStake['value'] => ({
      delegator_address: delegatorAddress,
      amount,
    }),
    fromAmino: ({ delegator_address, amount }: AminoMsgLiquidStake['value']): MsgLiquidStake => ({
      delegatorAddress: delegator_address,
      amount,
    }),
  },
  '/crescent.liquidstaking.v1beta1.MsgLiquidUnstake': {
    aminoType: 'liquidstaking/MsgLiquidUnstake',
    toAmino: ({ delegatorAddress, amount }: MsgLiquidUnstake): AminoMsgLiquidUnstake['value'] => ({
      delegator_address: delegatorAddress,
      amount,
    }),
    fromAmino: ({ delegator_address, amount }: AminoMsgLiquidUnstake['value']): MsgLiquidUnstake => ({
      delegatorAddress: delegator_address,
      amount,
    }),
  },
  '/crescent.liquidity.v1beta1.MsgDeposit': {
    aminoType: 'liquidity/MsgDeposit',
    toAmino: ({ depositor, depositCoins, poolId }: MsgDeposit): AminoMsgDeposit['value'] => {
      return {
        depositor,
        deposit_coins: depositCoins,
        pool_id: String(poolId),
      };
    },
    fromAmino: ({ depositor, deposit_coins, pool_id }: AminoMsgDeposit['value']): MsgDeposit => {
      return {
        depositor,
        depositCoins: deposit_coins,
        poolId: Number(pool_id),
      };
    },
  },
  '/crescent.liquidity.v1beta1.MsgWithdraw': {
    aminoType: 'liquidity/MsgWithdraw',
    toAmino: ({ withdrawer, poolId, poolCoin }: MsgWithdraw): AminoMsgWithdraw['value'] => {
      return {
        withdrawer,
        pool_id: String(poolId),
        pool_coin: poolCoin,
      };
    },
    fromAmino: ({ withdrawer, pool_id, pool_coin }: AminoMsgWithdraw['value']): MsgWithdraw => {
      return {
        withdrawer,
        poolId: Number(pool_id),
        poolCoin: pool_coin,
      };
    },
  },
  '/crescent.liquidity.v1beta1.MsgLimitOrder': {
    aminoType: 'liquidity/MsgLimitOrder',
    toAmino: ({
      orderer,
      pairId,
      direction,
      offerCoin,
      demandCoinDenom,
      price,
      amount,
      orderLifespan: _orderLifespan,
    }: MsgLimitOrder): AminoMsgLimitOrder['value'] => {
      const priceFixed = `${new BigNumber(price).shiftedBy(-18).toFixed(18)}`;
      return {
        orderer: orderer,
        pair_id: String(pairId),
        direction: Number(direction),
        offer_coin: offerCoin,
        demand_coin_denom: demandCoinDenom,
        price: priceFixed,
        amount: amount,
        order_lifespan: '0',
      };
    },
    fromAmino: ({
      orderer,
      pair_id,
      direction,
      offer_coin,
      demand_coin_denom,
      price,
      amount,
      order_lifespan: _orderLifespan,
    }: AminoMsgLimitOrder['value']): MsgLimitOrder => {
      return {
        orderer: orderer,
        pairId: parseInt(pair_id),
        direction: direction,
        offerCoin: offer_coin,
        demandCoinDenom: demand_coin_denom,
        price: new BigNumber(price).multipliedBy(10 ** 18).toString(),
        amount: amount,
        orderLifespan: { seconds: 0, nanos: 0 },
      };
    },
  },
  '/crescent.farming.v1beta1.MsgStake': {
    aminoType: 'farming/MsgStake',
    toAmino: ({ farmer, stakingCoins }: MsgStake): AminoMsgStake['value'] => {
      return {
        farmer,
        staking_coins: stakingCoins,
      };
    },
    fromAmino: ({ farmer, staking_coins }: AminoMsgStake['value']): MsgStake => {
      return {
        farmer,
        stakingCoins: staking_coins,
      };
    },
  },
  '/crescent.farming.v1beta1.MsgHarvest': {
    aminoType: 'farming/MsgHarvest',
    toAmino: ({ farmer, stakingCoinDenoms }: MsgHarvest): AminoMsgHarvest['value'] => {
      return {
        farmer,
        staking_coin_denoms: stakingCoinDenoms,
      };
    },
    fromAmino: ({ farmer, staking_coin_denoms }: AminoMsgHarvest['value']): MsgHarvest => {
      return {
        farmer,
        stakingCoinDenoms: staking_coin_denoms,
      };
    },
  },
  '/crescent.farming.v1beta1.MsgUnstake': {
    aminoType: 'farming/MsgUnstake',
    toAmino: ({ farmer, unstakingCoins }: MsgUnstake): AminoMsgUnstake['value'] => {
      return {
        farmer,
        unstaking_coins: unstakingCoins,
      };
    },
    fromAmino: ({ farmer, unstaking_coins }: AminoMsgUnstake['value']): MsgUnstake => {
      return {
        farmer,
        unstakingCoins: unstaking_coins,
      };
    },
  },
};
// if (type === 'swap' || type === 'poolDeposit' || type === 'poolWithdraw') {
//   defaultRegistry.register('/squad.liquidity.v1beta1.MsgLimitOrder', MsgLimitOrder);
//   defaultRegistry.register('/squad.liquidity.v1beta1.MsgDeposit', MsgDeposit);
//   defaultRegistry.register('/squad.liquidity.v1beta1.MsgWithdraw', MsgWithdraw);
//   creLiquidityClient = await liquidityTxClient(creOfflineSigner, {
//     addr: `${CLIENT_PROTOCOL}${creChainInfo.wsEndpoint}`,
//   });
// } else if (type === 'farm' || type === 'unfarm' || type === 'claim') {
//   defaultRegistry.register('/squad.farming.v1beta1.MsgStake', MsgStake);
//   defaultRegistry.register('/squad.farming.v1beta1.MsgUnstake', MsgUnstake);
//   defaultRegistry.register('/squad.farming.v1beta1.MsgHarvest', MsgHarvest);
//   creFarmingClient = await farmingTxClient(creOfflineSigner, {
//     addr: `${CLIENT_PROTOCOL}${creChainInfo.wsEndpoint}`,
//   });
// } else {
//   defaultRegistry.register('/squad.liquidstaking.v1beta1.MsgLiquidStake', MsgLiquidStake);
//   defaultRegistry.register('/squad.liquidstaking.v1beta1.MsgLiquidUnstake', MsgLiquidUnstake);
//   creStakingClient = await stakingTxClient(creOfflineSigner, {
//     addr: `${CLIENT_PROTOCOL}${creChainInfo.wsEndpoint}`,
//   });
// }
