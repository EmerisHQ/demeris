import { MsgSwapWithinBatch } from '@starport/tendermint-liquidity-js/gravity-devs/liquidity/tendermint.liquidity.v1beta1/module/types/tendermint/liquidity/v1beta1/tx';
import { bech32 } from 'bech32';
import Long from 'long';

import {
  GlobalDemerisActionTypes,
  GlobalDemerisGetterTypes,
  RootStoreType,
  TypedAPIStore,
  TypedUSERStore,
} from '@/store';
import { ChainData } from '@/store/demeris-api/state';
import * as Actions from '@/types/actions';
import * as API from '@/types/api';
import { Balance, Balances, Denom, IbcInfo } from '@/types/api';
import { ChainAmount } from '@/types/base';
import { useStore } from '@/utils/useStore';

import {
  generateDenomHash,
  getChannel,
  getDenomHash,
  getOwnAddress,
  isNative,
  keyHashfromAddress,
  parseCoins,
} from './basic';
import { featureRunning } from './FeatureManager';

// Action-handler / action composing using the blocks above

export async function msgFromStepTransaction(
  stepTx: Actions.StepTransaction,
  gasPriceLevel: Actions.GasPriceLevel,
): Promise<Actions.MsgMeta> {
  const libStore = useStore();
  const apistore = useStore() as TypedAPIStore;
  const userstore = useStore() as TypedUSERStore;
  if (stepTx.name == 'transfer') {
    const data = stepTx.data as Actions.TransferData;
    const msg = await libStore.dispatch('cosmos.bank.v1beta1/MsgSend', {
      value: {
        amount: [data.amount],
        toAddress: data.to_address,
        fromAddress: await getOwnAddress({ chain_name: data.chain_name }),
      },
    });
    const registry = libStore.getters['cosmos.bank.v1beta1/getRegistry'];
    return { msg: [msg], chain_name: data.chain_name, registry };
  }

  if (stepTx.name == 'ibc_forward') {
    const data = stepTx.data as Actions.IBCForwardsData;
    let receiver;
    if (data.to_address) {
      receiver = data.to_address;
    } else {
      receiver = await getOwnAddress({ chain_name: data.to_chain });
    }
    const msg = await libStore.dispatch('ibc.applications.transfer.v1/MsgTransfer', {
      value: {
        sourcePort: 'transfer',
        sourceChannel: data.through,
        sender: await getOwnAddress({ chain_name: data.from_chain }),
        receiver,
        timeoutTimestamp: Long.fromString(new Date().getTime() + 300000 + '000000'),
        //timeoutHeight: { revisionHeight: "10000000000",revisionNumber:"0"},
        token: { ...data.amount },
      },
    });
    const registry = libStore.getters['ibc.applications.transfer.v1/getRegistry'];
    return { msg: [msg], chain_name: data.from_chain, registry };
  }

  if (stepTx.name == 'ibc_backward') {
    const data = stepTx.data as Actions.IBCBackwardsData;
    let receiver;
    if (data.to_address) {
      receiver = data.to_address;
    } else {
      receiver = await getOwnAddress({ chain_name: data.to_chain });
    }
    let fromAmount = data.amount.amount;
    if (stepTx.addFee) {
      fromAmount = (
        parseInt(fromAmount) +
        parseFloat(stepTx.feeToAdd[0].amount[gasPriceLevel]) *
          userstore.getters[GlobalDemerisGetterTypes.USER.getGasLimit]
      ).toString();
    }
    const msg = await libStore.dispatch('ibc.applications.transfer.v1/MsgTransfer', {
      value: {
        sourcePort: 'transfer',
        sourceChannel: data.through,
        sender: await getOwnAddress({ chain_name: data.from_chain }),
        receiver,
        timeoutTimestamp: Long.fromString(new Date().getTime() + 300000 + '000000'),
        token: { amount: fromAmount, denom: data.amount.denom },
      },
    });
    const registry = libStore.getters['ibc.applications.transfer.v1/getRegistry'];
    return { msg: [msg], chain_name: data.from_chain, registry };
  }
  if (stepTx.name == 'addliquidity') {
    const chain_name = apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];
    const data = stepTx.data as Actions.AddLiquidityData;
    let depositCoins;
    if (data.coinA.denom > data.coinB.denom) {
      depositCoins = [data.coinB, data.coinA];
    } else {
      depositCoins = [data.coinA, data.coinB];
    }
    const msg = await libStore.dispatch('tendermint.liquidity.v1beta1/MsgDepositWithinBatch', {
      value: {
        depositorAddress: await getOwnAddress({ chain_name }), // TODO: change to liq module chain
        poolId: data.pool.id,
        depositCoins,
      },
    });
    const registry = libStore.getters['tendermint.liquidity.v1beta1/getRegistry'];
    return { msg: [msg], chain_name, registry };
  }
  if (stepTx.name == 'withdrawliquidity') {
    const chain_name = apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];
    const data = stepTx.data as Actions.WithdrawLiquidityData;
    const msg = await libStore.dispatch('tendermint.liquidity.v1beta1/MsgWithdrawWithinBatch', {
      value: {
        withdrawerAddress: await getOwnAddress({ chain_name }), // TODO: change to liq module chain
        poolId: data.pool.id,
        poolCoin: { ...data.poolCoin },
      },
    });
    const registry = libStore.getters['tendermint.liquidity.v1beta1/getRegistry'];
    return { msg: [msg], chain_name, registry };
  }
  if (stepTx.name == 'createpool') {
    const chain_name = apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];
    const data = stepTx.data as Actions.CreatePoolData;
    let depositCoins;
    if (data.coinA.denom > data.coinB.denom) {
      depositCoins = [data.coinB, data.coinA];
    } else {
      depositCoins = [data.coinA, data.coinB];
    }
    const msg = await libStore.dispatch('tendermint.liquidity.v1beta1/MsgCreatePool', {
      value: {
        poolCreatorAddress: await getOwnAddress({ chain_name }), // TODO: change to liq module chain
        poolTypeId: 1,
        depositCoins: depositCoins,
      },
    });
    const registry = libStore.getters['tendermint.liquidity.v1beta1/getRegistry'];
    return { msg: [msg], chain_name, registry };
  }
  if (stepTx.name == 'swap') {
    const data = stepTx.data as Actions.SwapData;
    const chain_name = apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];
    const slippage = (userstore.getters[GlobalDemerisGetterTypes.USER.getSlippagePerc] || 0.5) / 100;
    const swapFeeRate = libStore.getters['tendermint.liquidity.v1beta1/getParams']().params.swap_fee_rate;
    let isReverse = false;
    if (data.from.denom !== data.pool.reserve_coin_denoms[0]) {
      isReverse = true;
    }
    const price = [data.from, data.to].sort((a, b) => {
      if (a.denom < b.denom) return -1;
      if (a.denom > b.denom) return 1;
      return 0;
    });
    const msg = await libStore.dispatch('tendermint.liquidity.v1beta1/MsgSwapWithinBatch', {
      value: MsgSwapWithinBatch.fromPartial({
        swapRequesterAddress: await getOwnAddress({ chain_name }), // TODO: change to liq module chain
        poolId: parseInt(data.pool.id),
        swapTypeId: data.pool.type_id,
        offerCoin: { amount: data.from.amount, denom: data.from.denom },
        demandCoinDenom: data.to.denom,
        offerCoinFee: { amount: String(Math.ceil(+data.from.amount * (swapFeeRate / 2))), denom: data.from.denom },
        orderPrice: (
          (parseInt(price[0].amount) / parseInt(price[1].amount)) *
          (isReverse ? 1 - slippage : 1 + slippage)
        )
          .toFixed(18)
          .replace('.', '')
          .replace(/(^0+)/, ''),
      }),
    });
    const registry = libStore.getters['tendermint.liquidity.v1beta1/getRegistry'];
    return { msg: [msg], chain_name, registry };
  }
  if (stepTx.name == 'claim') {
    const data = stepTx.data as Actions.ClaimData;
    const delegatorAddress = await getOwnAddress({ chain_name: data.chain_name });
    const msgs = await Promise.all(
      data.rewards.map(async (rewardData) => {
        return await libStore.dispatch('cosmos.distribution.v1beta1/MsgWithdrawDelegatorReward', {
          value: {
            delegatorAddress,
            validatorAddress: rewardData.validator_address,
          },
        });
      }),
    );
    const registry = libStore.getters['cosmos.distribution.v1beta1/getRegistry'];
    return { msg: msgs, chain_name: data.chain_name, registry };
  }
  if (stepTx.name == 'stake') {
    const data = stepTx.data as Actions.StakeData[];
    const delegatorAddress = await getOwnAddress({ chain_name: data[0].chain_name });
    const msgs = await Promise.all(
      data.map(
        async (x) =>
          await libStore.dispatch('cosmos.staking.v1beta1/MsgDelegate', {
            value: {
              delegatorAddress,
              validatorAddress: x.validatorAddress,
              amount: x.amount,
            },
          }),
      ),
    );
    const registry = libStore.getters['cosmos.staking.v1beta1/getRegistry'];
    return { msg: msgs, chain_name: data[0].chain_name, registry };
  }
  if (stepTx.name == 'unstake') {
    const data = stepTx.data as Actions.UnstakeData;
    const delegatorAddress = await getOwnAddress({ chain_name: data.chain_name });
    const msg = await libStore.dispatch('cosmos.staking.v1beta1/MsgUndelegate', {
      value: {
        delegatorAddress,
        validatorAddress: data.validatorAddress,
        amount: data.amount,
      },
    });
    const registry = libStore.getters['cosmos.staking.v1beta1/getRegistry'];
    return { msg: [msg], chain_name: data.chain_name, registry };
  }
  if (stepTx.name == 'switch') {
    const data = stepTx.data as Actions.RestakeData;
    const delegatorAddress = await getOwnAddress({ chain_name: data.chain_name });
    const msg = await libStore.dispatch('cosmos.staking.v1beta1/MsgBeginRedelegate', {
      value: {
        delegatorAddress,
        validatorSrcAddress: data.validatorSrcAddress,
        validatorDstAddress: data.validatorDstAddress,
        amount: data.amount,
      },
    });
    const registry = libStore.getters['cosmos.staking.v1beta1/getRegistry'];
    return { msg: [msg], chain_name: data.chain_name, registry };
  }
}
// TODO make getter so it out updates on getFeeTokens getter
export async function getFeeForChain(chain_name: string): Promise<Array<Actions.FeeWDenom>> {
  if (!chain_name) return [];

  const apistore = useStore() as TypedAPIStore;
  const denoms = apistore.getters[GlobalDemerisGetterTypes.API.getFeeTokens]({
    chain_name,
  }) as Array<Denom>;
  const fees = [];
  for (const denom of denoms) {
    fees.push({ amount: denom.gas_price_levels, denom: denom.name, chain_name });
  }
  return fees;
}
export function getBaseDenomSync(denom: string) {
  const apistore = useStore() as TypedAPIStore;
  const traces = apistore.getters[GlobalDemerisGetterTypes.API.getAllVerifiedTraces];
  return traces[denom.split('/')[1]]?.base_denom ?? denom;
}
export async function getBaseDenom(denom: string, chainName = null): Promise<string> {
  const apistore = useStore() as TypedAPIStore;
  const chain_name = chainName || apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];
  const verifiedDenoms = apistore.getters[GlobalDemerisGetterTypes.API.getVerifiedDenoms];

  if (verifiedDenoms.find((item) => item.name === denom)) {
    return denom;
  }

  const hash = denom.split('/')[1];

  if (!hash) {
    return denom;
  }

  let trace = apistore.getters[GlobalDemerisGetterTypes.API.getVerifyTrace]({ chain_name, hash });

  if (!trace) {
    trace = await apistore.dispatch(
      GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
      { subscribe: false, params: { chain_name, hash } },
      { root: true },
    );
  }

  if (trace) {
    return trace.base_denom;
  }

  return denom;
}

export async function getNativeChain(denom: string, chainName = null): Promise<string> {
  const apistore = useStore() as TypedAPIStore;
  const chain_name = chainName || apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];
  const verifiedDenoms = apistore.getters[GlobalDemerisGetterTypes.API.getVerifiedDenoms];

  const verified = verifiedDenoms.find((item) => item.name === denom);
  if (verified) {
    return verified.chain_name;
  }

  const hash = denom.split('/')[1];

  if (!hash) {
    throw new Error('Denom not verified');
  }

  let trace = apistore.getters[GlobalDemerisGetterTypes.API.getVerifyTrace]({ chain_name, hash });

  if (!trace) {
    trace = await apistore.dispatch(
      GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
      { subscribe: false, params: { chain_name, hash } },
      { root: true },
    );
  }

  if (trace) {
    return await getNativeChain(trace.base_denom);
  }
  throw new Error('Denom not verified');
}
export function getStepTransactionDetailFromResponse(response: API.TransactionDetailResponse) {
  const apistore = useStore() as TypedAPIStore;
  const getChainFromAddress = (address: string): API.Chain => {
    const chains = Object.values(apistore.getters[GlobalDemerisGetterTypes.API.getChains]);
    const prefix = bech32.decode(address).prefix;
    // @ts-ignore
    return chains.find((item) => item.node_info.bech32_config.prefix_account == prefix);
  };

  for (const message of response.tx_response.tx.body.messages) {
    if (message['@type'] === '/ibc.core.channel.v1.MsgRecvPacket') {
      const packetData: {
        amount: string;
        denom: string;
        receiver: string;
        sender: string;
      } = JSON.parse(atob(message.packet.data));

      const senderChain = getChainFromAddress(packetData.sender);
      const receiverChain = getChainFromAddress(packetData.receiver);

      const counterpartySource = Object.entries(senderChain.primary_channel).find(
        (item) => item[1] === message.packet.source_channel,
      )?.[0];
      const counterpartyDestination = Object.entries(receiverChain.primary_channel).find(
        (item) => item[1] === message.packet.destination_channel,
      )?.[0];
      const denoms = packetData.denom.split('/');

      const data: Actions.IBCForwardsData = {
        amount: {
          amount: packetData.amount,
          denom: denoms[denoms.length - 1],
        },
        from_chain: counterpartyDestination,
        to_chain: counterpartySource,
        to_address: packetData.receiver,
        through: message.packet.source_channel,
      };

      return data;
    }

    if (message['@type'] === '/cosmos.bank.v1beta1.MsgSend') {
      const data: Actions.TransferData = {
        amount: Array.isArray(message.amount) ? message.amount[0] : message.amount,
        to_address: message.to_address,
        chain_name: getChainFromAddress(message.from_address).chain_name,
      };

      return data;
    }

    if (message['@type'] === '/tendermint.liquidity.v1beta1.MsgCreatePool') {
      const data: Actions.CreatePoolData = {
        coinA: message.deposit_coins[0],
        coinB: message.deposit_coins[1],
      };

      return data;
    }
  }
}

export async function ensureTraceChannel(transaction: Actions.StepTransaction) {
  const apistore = useStore() as TypedAPIStore;
  const timeout = 1000;
  const limit = 3;

  let retries = 0;
  let error: Error;

  let denoms = [];
  const chain = apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];

  switch (transaction.name) {
    case 'addliquidity':
      const transferdata = transaction.data as Actions.AddLiquidityData;
      denoms = [transferdata.coinA.denom, transferdata.coinB.denom];
      break;
    case 'createpool':
      const createdata = transaction.data as Actions.CreatePoolData;
      denoms = [createdata.coinA.denom, createdata.coinB.denom];
      break;
    case 'swap':
      const swapdata = transaction.data as Actions.SwapData;
      denoms = [swapdata.from.denom, swapdata.to.denom];
      break;
    case 'withdrawliquidity':
      const withdrawdata = transaction.data as Actions.WithdrawLiquidityData;
      denoms = [withdrawdata.poolCoin.denom];
      break;
    default:
      return;
  }

  const ibcDenoms = denoms.filter((item) => !!item.split('/')[1]);

  if (!ibcDenoms.length) {
    return;
  }

  while (limit > retries) {
    try {
      if (featureRunning('REQUEST_PARALLELIZATION')) {
        await Promise.all(
          ibcDenoms.map((denom) =>
            apistore.dispatch(
              GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
              {
                subscribe: false,
                cache: false,
                params: {
                  chain_name: chain,
                  hash: denom.split('/')[1],
                },
              },
              { root: true },
            ),
          ),
        );
        break;
      } else {
        for (const denom of ibcDenoms) {
          await apistore.dispatch(
            GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
            {
              subscribe: false,
              cache: false,
              params: {
                chain_name: chain,
                hash: denom.split('/')[1],
              },
            },
            { root: true },
          );
        }
        break;
      }
    } catch (e) {
      error = e;
      retries++;
      // Sleep
      await new Promise((resolve) => setTimeout(resolve, timeout));
    }
  }

  if (error) {
    throw new Error(`Failed to verify path of "${ibcDenoms.join(', ')}" on "${chain}."`);
  }
}

export async function getDisplayName(name, chain_name = null) {
  const apistore = useStore() as TypedAPIStore;
  if (isNative(name)) {
    const displayName =
      apistore.getters[GlobalDemerisGetterTypes.API.getVerifiedDenoms]?.find((x) => x.name == name)?.display_name ??
      null;
    if (displayName) {
      return displayName;
    }

    return name;
  } else {
    let verifyTrace;
    try {
      verifyTrace =
        apistore.getters[GlobalDemerisGetterTypes.API.getVerifyTrace]({ chain_name, hash: name.split('/')[1] }) ??
        (await apistore.dispatch(
          GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
          { subscribe: false, params: { chain_name, hash: name.split('/')[1] } },
          { root: true },
        ));
    } catch (e) {
      //console.error(e);
      return name + '(unverified)';
    }

    return await getDisplayName(verifyTrace.base_denom);
  }
}
export async function getTicker(name, chain_name = null) {
  const apistore = useStore() as TypedAPIStore;
  if (isNative(name)) {
    const ticker =
      apistore.getters[GlobalDemerisGetterTypes.API.getVerifiedDenoms]?.find((x) => x.name == name)?.ticker ?? null;
    if (ticker) {
      return ticker;
    }
    return name;
  } else {
    let verifyTrace;
    try {
      verifyTrace =
        apistore.getters[GlobalDemerisGetterTypes.API.getVerifyTrace]({ chain_name, hash: name.split('/')[1] }) ??
        (await apistore.dispatch(
          GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
          { subscribe: false, params: { chain_name, hash: name.split('/')[1] } },
          { root: true },
        ));
      return await getTicker(verifyTrace.base_denom);
    } catch (e) {
      return name + '(unverified)';
    }
  }
}

export async function isLive(chain_name) {
  const apistore = useStore() as TypedAPIStore;
  const status =
    apistore.getters[GlobalDemerisGetterTypes.API.getChainStatus]({
      chain_name,
    }) ??
    (await apistore.dispatch(
      GlobalDemerisActionTypes.API.GET_CHAIN_STATUS,
      {
        subscribe: false,
        params: {
          chain_name,
        },
      },
      { root: true },
    ));
  return status;
}

export async function feeForStepTransaction(stepTx: Actions.StepTransaction): Promise<Array<Actions.FeeWDenom>> {
  const apistore = useStore() as TypedAPIStore;
  if (stepTx.name == 'transfer') {
    const chain_name = (stepTx.data as Actions.TransferData).chain_name;
    const fee = await getFeeForChain(chain_name);
    return fee;
  }
  if (stepTx.name == 'ibc_backward') {
    const chain_name = (stepTx.data as Actions.IBCBackwardsData).from_chain;
    const fee = await getFeeForChain(chain_name);
    return fee;
  }
  if (stepTx.name == 'ibc_forward') {
    const chain_name = (stepTx.data as Actions.IBCForwardsData).from_chain;
    const fee = await getFeeForChain(chain_name);
    return fee;
  }
  if (stepTx.name == 'addliquidity') {
    const chain_name = apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];
    const fee = await getFeeForChain(chain_name);
    return fee;
  }
  if (stepTx.name == 'withdrawliquidity') {
    const chain_name = apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];
    const fee = await getFeeForChain(chain_name);
    return fee;
  }
  if (stepTx.name == 'createpool') {
    const chain_name = apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];
    const fee = await getFeeForChain(chain_name);
    return fee;
  }
  if (stepTx.name == 'swap') {
    const chain_name = apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];
    const fee = await getFeeForChain(chain_name);
    return fee;
  }
  if (stepTx.name == 'claim') {
    const chain_name = (stepTx.data as Actions.ClaimData).chain_name;
    const fee = await getFeeForChain(chain_name);
    return fee;
  }
  if (stepTx.name == 'stake') {
    const chain_name = (stepTx.data as Actions.StakeData[])[0].chain_name;
    const fee = await getFeeForChain(chain_name);
    return fee;
  }
  if (stepTx.name == 'unstake') {
    const chain_name = (stepTx.data as Actions.UnstakeData).chain_name;
    const fee = await getFeeForChain(chain_name);
    return fee;
  }
  if (stepTx.name == 'switch') {
    const chain_name = (stepTx.data as Actions.RestakeData).chain_name;
    const fee = await getFeeForChain(chain_name);
    return fee;
  }
}
export async function feeForStep(step: Actions.Step, gasPriceLevel: Actions.GasPriceLevel): Promise<Actions.FeeTotals> {
  const feeTotals = {};

  let used;
  for (const stepTx of step.transactions) {
    const fees = await feeForStepTransaction(stepTx);

    if (!feeTotals[fees[0].chain_name]) {
      feeTotals[fees[0].chain_name] = {};
    }
    used = getUsedFee(fees, gasPriceLevel);
    feeTotals[used.chain_name][used.amount.denom]
      ? (feeTotals[used.chain_name][used.amount.denom] =
          feeTotals[used.chain_name][used.amount.denom] + parseFloat(used.amount.amount))
      : (feeTotals[used.chain_name][used.amount.denom] = parseFloat(used.amount.amount));
  }
  return feeTotals;
}

export async function feeForSteps(
  steps: Actions.Step[],
  gasPriceLevel: Actions.GasPriceLevel,
): Promise<Actions.FeeTotals> {
  const feeTotals = {};

  let used;
  if (steps) {
    for (const step of steps) {
      for (const stepTx of step.transactions) {
        const fees = await feeForStepTransaction(stepTx);

        if (!feeTotals[fees[0].chain_name]) {
          feeTotals[fees[0].chain_name] = {};
        }
        used = getUsedFee(fees, gasPriceLevel);

        feeTotals[used.chain_name][used.amount.denom]
          ? (feeTotals[used.chain_name][used.amount.denom] =
              feeTotals[used.chain_name][used.amount.denom] + parseFloat(used.amount.amount))
          : (feeTotals[used.chain_name][used.amount.denom] = parseFloat(used.amount.amount));
      }
    }
  }
  return feeTotals;
}

export function getUsedFee(fees: Array<Actions.FeeWDenom>, gasPriceLevel: Actions.GasPriceLevel): ChainAmount {
  const userstore = useStore() as TypedUSERStore;
  const feeOption = fees[0];
  const used = {
    amount: {
      amount: (
        parseFloat(feeOption.amount[gasPriceLevel]) * userstore.getters[GlobalDemerisGetterTypes.USER.getGasLimit]
      ).toString(),
      denom: feeOption.denom,
    },
    chain_name: feeOption.chain_name,
  };
  return used;
}

export async function toRedeem(balances: Balances): Promise<Balances> {
  const apistore = useStore() as TypedAPIStore;
  const allValidRedeemableBalances = balances.filter((x) => x.verified && Object.keys(x.ibc).length !== 0);
  const redeemableBalances = [];
  for (const balance of allValidRedeemableBalances) {
    if (balance.ibc.path.split('/').length > 2) {
      redeemableBalances.push(balance);
    } else {
      let verifyTrace;
      try {
        verifyTrace =
          apistore.getters[GlobalDemerisGetterTypes.API.getVerifyTrace]({
            chain_name: balance.on_chain,
            hash: balance.ibc.hash,
          }) ??
          (await apistore.dispatch(
            GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
            { subscribe: false, params: { chain_name: balance.on_chain, hash: balance.ibc.hash } },
            { root: true },
          ));
      } catch (e) {
        continue;
      }

      const primaryChannel =
        apistore.getters[GlobalDemerisGetterTypes.API.getPrimaryChannel]({
          chain_name: balance.on_chain,
          destination_chain_name: verifyTrace.trace[0].counterparty_name,
        }) ??
        (await apistore.dispatch(
          GlobalDemerisActionTypes.API.GET_PRIMARY_CHANNEL,
          {
            subscribe: true,
            params: { chain_name: balance.on_chain, destination_chain_name: verifyTrace.trace[0].counterparty_name },
          },
          { root: true },
        ));
      if (primaryChannel != getChannel(verifyTrace.path, 0)) {
        redeemableBalances.push(balance);
      }
    }
  }
  return redeemableBalances;
}

export async function validBalances(balances: Balances): Promise<Balances> {
  const apistore = useStore() as RootStoreType;
  const validBalances = [];
  const verifiedDenoms = apistore.getters[GlobalDemerisGetterTypes.API.getVerifiedDenoms];

  if (featureRunning('REQUEST_PARALLELIZATION')) {
    await Promise.all(
      balances.map(async (balance) => {
        // TODO: refactor this into something prettier.
        const ownAddress = await getOwnAddress({ chain_name: balance.on_chain });
        if (ownAddress) {
          const hashAddress = keyHashfromAddress(ownAddress);

          if (balance.address !== hashAddress) {
            return;
          }

          if (Object.keys(balance.ibc).length == 0) {
            if (verifiedDenoms.find((item) => item.name === balance.base_denom)) {
              validBalances.push(balance);
            }
          } else {
            if (!balance.ibc.path || balance.ibc.path.split('/').length > 2) {
              return;
            }
            let verifyTrace;
            try {
              verifyTrace =
                apistore.getters[GlobalDemerisGetterTypes.API.getVerifyTrace]({
                  chain_name: balance.on_chain,
                  hash: balance.ibc.hash,
                }) ??
                (await apistore.dispatch(
                  GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
                  { subscribe: false, params: { chain_name: balance.on_chain, hash: balance.ibc.hash } },
                  { root: true },
                ));
            } catch (e) {
              return;
            }

            if (!verifyTrace || !verifyTrace.verified) {
              return;
            }

            const primaryChannel =
              apistore.getters[GlobalDemerisGetterTypes.API.getPrimaryChannel]({
                chain_name: balance.on_chain,
                destination_chain_name: verifyTrace.trace[0].counterparty_name,
              }) ??
              (await apistore.dispatch(
                GlobalDemerisActionTypes.API.GET_PRIMARY_CHANNEL,
                {
                  subscribe: false,
                  params: {
                    chain_name: balance.on_chain,
                    destination_chain_name: verifyTrace.trace[0].counterparty_name,
                  },
                },
                { root: true },
              ));
            if (primaryChannel == getChannel(verifyTrace.path, 0)) {
              validBalances.push(balance);
            }
          }
        }
      }),
    );
  } else {
    for (const balance of balances) {
      const ownAddress = await getOwnAddress({ chain_name: balance.on_chain });
      if (!ownAddress) continue;
      const hashAddress = keyHashfromAddress(ownAddress);

      if (balance.address !== hashAddress) {
        continue;
      }

      if (Object.keys(balance.ibc).length == 0) {
        if (verifiedDenoms.find((item) => item.name === balance.base_denom)) {
          validBalances.push(balance);
        }
      } else {
        if (!balance.ibc.path || balance.ibc.path.split('/').length > 2) {
          continue;
        }
        let verifyTrace;
        try {
          verifyTrace =
            apistore.getters[GlobalDemerisGetterTypes.API.getVerifyTrace]({
              chain_name: balance.on_chain,
              hash: balance.ibc.hash,
            }) ??
            (await apistore.dispatch(
              GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
              { subscribe: false, params: { chain_name: balance.on_chain, hash: balance.ibc.hash } },
              { root: true },
            ));
        } catch (e) {
          continue;
        }

        if (!verifyTrace || !verifyTrace.verified) {
          continue;
        }

        const primaryChannel =
          apistore.getters[GlobalDemerisGetterTypes.API.getPrimaryChannel]({
            chain_name: balance.on_chain,
            destination_chain_name: verifyTrace.trace[0].counterparty_name,
          }) ??
          (await apistore.dispatch(
            GlobalDemerisActionTypes.API.GET_PRIMARY_CHANNEL,
            {
              subscribe: false,
              params: { chain_name: balance.on_chain, destination_chain_name: verifyTrace.trace[0].counterparty_name },
            },
            { root: true },
          ));
        if (primaryChannel == getChannel(verifyTrace.path, 0)) {
          validBalances.push(balance);
        }
      }
    }
  }
  return validBalances;
}

export async function validPools(pools: Actions.Pool[]): Promise<Actions.Pool[]> {
  const apistore = useStore() as TypedAPIStore;
  const validPools = [];
  const verifiedDenoms = apistore.getters[GlobalDemerisGetterTypes.API.getVerifiedDenoms];
  const dexChain = apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];

  if (featureRunning('REQUEST_PARALLELIZATION')) {
    await Promise.all(
      pools.map(async (pool) => {
        const firstDenom = pool.reserve_coin_denoms[0];
        const secondDenom = pool.reserve_coin_denoms[1];

        if (!firstDenom.includes('ibc')) {
          if (verifiedDenoms.find((item) => item.name === firstDenom)) {
            // first denom is base denom and valid, check second denom
            if (!secondDenom.includes('ibc')) {
              if (verifiedDenoms.find((item) => item.name === secondDenom)) {
                // first denom is base denom and valid, second denom is base denom and valid

                validPools.push(pool);
              } else {
                return;
              }
            } else {
              if (await isValidIBCReserveDenom(secondDenom, dexChain, verifiedDenoms)) {
                // first denom is base and valid, second denom is IBC and valid
                validPools.push(pool);
              } else {
                return;
              }
            }
          } else {
            return;
          }
        } else {
          if (await isValidIBCReserveDenom(firstDenom, dexChain, verifiedDenoms)) {
            if (!secondDenom.includes('ibc')) {
              // second denom is not IBC denom
              if (verifiedDenoms.find((item) => item.name === secondDenom)) {
                // first denom is IBC and valid, second denom is base and valid
                validPools.push(pool);
              } else {
                return;
              }
            } else {
              // second denom is IBC denom, check if it goes through primary channel
              if (await isValidIBCReserveDenom(secondDenom, dexChain, verifiedDenoms)) {
                validPools.push(pool);
              } else {
                return;
              }
            }
          } else {
            return;
          }
        }
      }),
    );
  } else {
    for (const pool of pools) {
      const firstDenom = pool.reserve_coin_denoms[0];
      const secondDenom = pool.reserve_coin_denoms[1];

      if (!firstDenom.includes('ibc')) {
        if (verifiedDenoms.find((item) => item.name === firstDenom)) {
          // first denom is base denom and valid, check second denom
          if (!secondDenom.includes('ibc')) {
            if (verifiedDenoms.find((item) => item.name === secondDenom)) {
              // first denom is base denom and valid, second denom is base denom and valid

              validPools.push(pool);
            } else {
              continue;
            }
          } else {
            if (await isValidIBCReserveDenom(secondDenom, dexChain, verifiedDenoms)) {
              // first denom is base and valid, second denom is IBC and valid
              validPools.push(pool);
            } else {
              continue;
            }
          }
        } else {
          continue;
        }
      } else {
        if (await isValidIBCReserveDenom(firstDenom, dexChain, verifiedDenoms)) {
          if (!secondDenom.includes('ibc')) {
            // second denom is not IBC denom
            if (verifiedDenoms.find((item) => item.name === secondDenom)) {
              // first denom is IBC and valid, second denom is base and valid
              validPools.push(pool);
            } else {
              continue;
            }
          } else {
            // second denom is IBC denom, check if it goes through primary channel
            if (await isValidIBCReserveDenom(secondDenom, dexChain, verifiedDenoms)) {
              validPools.push(pool);
            } else {
              continue;
            }
          }
        } else {
          continue;
        }
      }
    }
  }
  return validPools;
}
export async function chainStatusForSteps(steps: Actions.Step[]) {
  const apistore = useStore() as TypedAPIStore;
  let allClear = true;
  let relayerStatus = true;
  const failedChains = [];
  for (const step of steps) {
    for (const stepTx of step.transactions) {
      if (stepTx.name == 'transfer') {
        const chain_name = (stepTx.data as Actions.TransferData).chain_name;
        if (!apistore.getters[GlobalDemerisGetterTypes.API.getChainStatus]({ chain_name })) {
          allClear = false;
          if (failedChains.includes(chain_name)) {
            continue;
          } else {
            failedChains.push(chain_name);
          }
        }
      }
      if (stepTx.name == 'ibc_backward') {
        const chain_name = (stepTx.data as Actions.IBCBackwardsData).from_chain;
        const dest_chain_name = (stepTx.data as Actions.IBCBackwardsData).to_chain;
        if (!apistore.getters[GlobalDemerisGetterTypes.API.getChainStatus]({ chain_name })) {
          allClear = false;
          if (!failedChains.includes(chain_name)) {
            failedChains.push(chain_name);
          }
        }
        if (!apistore.getters[GlobalDemerisGetterTypes.API.getChainStatus]({ chain_name: dest_chain_name })) {
          allClear = false;
          if (failedChains.includes(dest_chain_name)) {
            continue;
          } else {
            failedChains.push(dest_chain_name);
          }
        }

        await apistore.dispatch(GlobalDemerisActionTypes.API.GET_RELAYER_STATUS, {
          subscribe: false,
        });
        await apistore.dispatch(GlobalDemerisActionTypes.API.GET_RELAYER_BALANCES, {
          subscribe: false,
        });
        if (
          !apistore.getters[GlobalDemerisGetterTypes.API.getRelayerChainStatus]({ chain_name }) ||
          !apistore.getters[GlobalDemerisGetterTypes.API.getRelayerChainStatus]({ chain_name: dest_chain_name })
        ) {
          relayerStatus = false;
        }
      }
      if (stepTx.name == 'ibc_forward') {
        const chain_name = (stepTx.data as Actions.IBCBackwardsData).from_chain;
        const dest_chain_name = (stepTx.data as Actions.IBCBackwardsData).to_chain;
        if (!apistore.getters[GlobalDemerisGetterTypes.API.getChainStatus]({ chain_name })) {
          allClear = false;
          if (!failedChains.includes(chain_name)) {
            failedChains.push(chain_name);
          }
        }
        if (!apistore.getters[GlobalDemerisGetterTypes.API.getChainStatus]({ chain_name: dest_chain_name })) {
          allClear = false;
          if (failedChains.includes(dest_chain_name)) {
            continue;
          } else {
            failedChains.push(dest_chain_name);
          }
        }
        await apistore.dispatch(GlobalDemerisActionTypes.API.GET_RELAYER_STATUS, {
          subscribe: false,
        });
        await apistore.dispatch(GlobalDemerisActionTypes.API.GET_RELAYER_BALANCES, {
          subscribe: false,
        });
        if (
          !apistore.getters[GlobalDemerisGetterTypes.API.getRelayerChainStatus]({ chain_name }) ||
          !apistore.getters[GlobalDemerisGetterTypes.API.getRelayerChainStatus]({ chain_name: dest_chain_name })
        ) {
          relayerStatus = false;
        }
      }
      if (stepTx.name == 'addliquidity') {
        const chain_name = apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];
        if (!apistore.getters[GlobalDemerisGetterTypes.API.getChainStatus]({ chain_name })) {
          allClear = false;
          if (failedChains.includes(chain_name)) {
            continue;
          } else {
            failedChains.push(chain_name);
          }
        }
      }
      if (stepTx.name == 'withdrawliquidity') {
        const chain_name = apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];
        if (!apistore.getters[GlobalDemerisGetterTypes.API.getChainStatus]({ chain_name })) {
          allClear = false;
          if (failedChains.includes(chain_name)) {
            continue;
          } else {
            failedChains.push(chain_name);
          }
        }
      }
      if (stepTx.name == 'createpool') {
        const chain_name = apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];
        if (!apistore.getters[GlobalDemerisGetterTypes.API.getChainStatus]({ chain_name })) {
          allClear = false;
          if (failedChains.includes(chain_name)) {
            continue;
          } else {
            failedChains.push(chain_name);
          }
        }
      }
      if (stepTx.name == 'swap') {
        const chain_name = apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];
        if (!apistore.getters[GlobalDemerisGetterTypes.API.getChainStatus]({ chain_name })) {
          allClear = false;
          if (failedChains.includes(chain_name)) {
            continue;
          } else {
            failedChains.push(chain_name);
          }
        }
      }
      if (stepTx.name == 'claim' || stepTx.name == 'unstake' || stepTx.name == 'switch') {
        const chain_name = (stepTx.data as Actions.ClaimData).chain_name;
        if (!apistore.getters[GlobalDemerisGetterTypes.API.getChainStatus]({ chain_name })) {
          allClear = false;
          if (failedChains.includes(chain_name)) {
            continue;
          } else {
            failedChains.push(chain_name);
          }
        }
      }
      if (stepTx.name == 'stake') {
        const chain_name = (stepTx.data as Actions.StakeData[])[0].chain_name;
        if (!apistore.getters[GlobalDemerisGetterTypes.API.getChainStatus]({ chain_name })) {
          allClear = false;
          if (failedChains.includes(chain_name)) {
            continue;
          } else {
            failedChains.push(chain_name);
          }
        }
      }
    }
  }
  return { status: allClear, failed: failedChains, relayer: relayerStatus };
}
export async function validateStepFeeBalances(
  step: Actions.Step,
  balances: Balances,
  fees: Actions.FeeTotals,
  gasPriceLevel: Actions.GasPriceLevel,
): Promise<Actions.FeeWarning> {
  const apistore = useStore() as TypedAPIStore;
  const userstore = useStore() as TypedUSERStore;
  const feeWarning: Actions.FeeWarning = {
    missingFees: [],
    ibcWarning: false,
    feeWarning: false,
    ibcDetails: {
      ibcDenom: '',
      chain_name: '',
      denom: '',
    },
  };
  for (const stepTx of step.transactions) {
    if (stepTx.name == 'addliquidity') {
      const data = stepTx.data as Actions.AddLiquidityData;
      const balanceA = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (
          amount.denom == data.coinA.denom &&
          x.on_chain == apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]
        ) {
          return true;
        } else {
          return false;
        }
      });

      if (balanceA) {
        const newAmount = parseInt(parseCoins(balanceA.amount)[0].amount) - parseInt(data.coinA.amount);
        if (newAmount >= 0) {
          balanceA.amount = newAmount + parseCoins(balanceA.amount)[0].denom;
        } else {
          throw new Error('Insufficient balance: ' + data.coinA.denom);
        }
      } else {
        throw new Error('Insufficient balance: ' + data.coinA.denom);
      }
      const balanceB = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (
          amount.denom == data.coinB.denom &&
          x.on_chain == apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]
        ) {
          return true;
        } else {
          return false;
        }
      });
      if (balanceB) {
        const newAmount = parseInt(parseCoins(balanceB.amount)[0].amount) - parseInt(data.coinB.amount);
        if (newAmount >= 0) {
          balanceB.amount = newAmount + parseCoins(balanceB.amount)[0].denom;
        } else {
          throw new Error('Insufficient balance: ' + data.coinB.denom);
        }
      } else {
        throw new Error('Insufficient balance: ' + data.coinB.denom);
      }
    }
    if (stepTx.name == 'createpool') {
      const data = stepTx.data as Actions.CreatePoolData;
      const creationFee = apistore.getters['tendermint.liquidity.v1beta1/getParams']().params.pool_creation_fee[0];
      const feeBalance = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (
          amount.denom == creationFee.denom &&
          x.on_chain == apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]
        ) {
          return true;
        } else {
          return false;
        }
      });

      const balanceA = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (
          amount.denom == data.coinA.denom &&
          x.on_chain == apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]
        ) {
          return true;
        } else {
          return false;
        }
      });

      if (balanceA) {
        const newAmount = parseInt(parseCoins(balanceA.amount)[0].amount) - parseInt(data.coinA.amount);
        if (newAmount >= 0) {
          balanceA.amount = newAmount + parseCoins(balanceA.amount)[0].denom;
        } else {
          throw new Error('Insufficient balance: ' + data.coinA.denom);
        }
      } else {
        throw new Error('Insufficient balance: ' + data.coinA.denom);
      }
      const balanceB = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (
          amount.denom == data.coinB.denom &&
          x.on_chain == apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]
        ) {
          return true;
        } else {
          return false;
        }
      });
      if (balanceB) {
        const newAmount = parseInt(parseCoins(balanceB.amount)[0].amount) - parseInt(data.coinB.amount);
        if (newAmount >= 0) {
          balanceB.amount = newAmount + parseCoins(balanceB.amount)[0].denom;
        } else {
          throw new Error('Insufficient balance: ' + data.coinB.denom);
        }
      } else {
        throw new Error('Insufficient balance: ' + data.coinB.denom);
      }
      if (feeBalance) {
        const newAmount = parseInt(parseCoins(feeBalance.amount)[0].amount) - parseInt(creationFee.amount);
        if (newAmount >= 0) {
          feeBalance.amount = newAmount + parseCoins(feeBalance.amount)[0].denom;
        } else {
          feeWarning.feeWarning = false;
          feeWarning.missingFees.push({
            amount: '' + creationFee.amount,
            chain_name: apistore.getters[GlobalDemerisGetterTypes.API.getDexChain],
            denom: creationFee.denom,
          });
        }
      } else {
        feeWarning.feeWarning = false;
        feeWarning.missingFees.push({
          amount: '' + creationFee.amount,
          chain_name: apistore.getters[GlobalDemerisGetterTypes.API.getDexChain],
          denom: creationFee.denom,
        });
      }
    }
    if (stepTx.name == 'ibc_backward') {
      const data = stepTx.data as Actions.IBCBackwardsData;
      const ibcBalance = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (amount.denom == data.amount.denom && x.on_chain == data.from_chain) {
          return true;
        } else {
          return false;
        }
      });
      if (ibcBalance) {
        const newAmount = parseInt(parseCoins(ibcBalance.amount)[0].amount) - parseInt(data.amount.amount);
        if (newAmount >= 0) {
          ibcBalance.amount = newAmount + parseCoins(ibcBalance.amount)[0].denom;
          let newDenom;
          if (ibcBalance.ibc.path.split('/').length > 2) {
            newDenom = getDenomHash(ibcBalance.ibc.path, ibcBalance.base_denom, 1);
          } else {
            newDenom = ibcBalance.base_denom;
          }
          if (!data.to_address) {
            const rcptBalance = balances.find((x) => {
              const amount = parseCoins(x.amount)[0];
              if (amount.denom == newDenom && x.on_chain == data.to_chain) {
                return true;
              } else {
                return false;
              }
            });
            let additionalFee = 0;
            if (stepTx.addFee) {
              additionalFee =
                parseFloat(stepTx.feeToAdd[0].amount[gasPriceLevel]) *
                userstore.getters[GlobalDemerisGetterTypes.USER.getGasLimit];
            }
            if (rcptBalance) {
              const newIbcAmount =
                parseInt(parseCoins(rcptBalance.amount)[0].amount) + parseInt(data.amount.amount) + additionalFee;
              rcptBalance.amount = newIbcAmount + parseCoins(rcptBalance.amount)[0].denom;
            } else {
              const ibcDetails: IbcInfo = {};
              if (ibcBalance.ibc.path.split('/').length > 2) {
                ibcDetails.path = ibcBalance.ibc.path.split('/').slice(2).join('/');
                ibcDetails.hash = newDenom.replace('ibc/', '');
              }
              const newIbcBalance: Balance = {
                address: keyHashfromAddress(await getOwnAddress({ chain_name: data.to_chain })),
                base_denom: ibcBalance.base_denom,
                verified: ibcBalance.verified,
                on_chain: data.to_chain,
                amount: data.amount.amount + newDenom,
                ibc: ibcDetails,
              };
              balances.push(newIbcBalance);
            }
          }
        } else {
          throw new Error('Insufficient balance: ' + data.amount.denom);
        }
      } else {
        throw new Error('Insufficient balance: ' + data.amount.denom);
      }
    }
    if (stepTx.name == 'ibc_forward') {
      const data = stepTx.data as Actions.IBCForwardsData;
      const ibcBalance = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (amount.denom == data.amount.denom && x.on_chain == data.from_chain) {
          return true;
        } else {
          return false;
        }
      });
      if (ibcBalance) {
        const newAmount = parseInt(parseCoins(ibcBalance.amount)[0].amount) - parseInt(data.amount.amount);
        if (newAmount >= 0) {
          ibcBalance.amount = newAmount + parseCoins(ibcBalance.amount)[0].denom;
          const newDenom = generateDenomHash(data.through, ibcBalance.base_denom);

          if (!data.to_address) {
            const rcptBalance = balances.find((x) => {
              const amount = parseCoins(x.amount)[0];
              if (amount.denom == newDenom && x.on_chain == data.to_chain) {
                return true;
              } else {
                return false;
              }
            });
            if (rcptBalance) {
              const newIbcAmount = parseInt(parseCoins(rcptBalance.amount)[0].amount) + parseInt(data.amount.amount);
              rcptBalance.amount = newIbcAmount + parseCoins(rcptBalance.amount)[0].denom;
            } else {
              const ibcDetails: IbcInfo = {};
              if (ibcBalance.ibc.path?.split('/').length > 2) {
                ibcDetails.path = 'transfer/' + data.through;
                ibcDetails.hash = newDenom.replace('ibc/', '');
              }
              const newIbcBalance: Balance = {
                address: keyHashfromAddress(await getOwnAddress({ chain_name: data.to_chain })),
                base_denom: ibcBalance.base_denom,
                verified: ibcBalance.verified,
                on_chain: data.to_chain,
                amount: data.amount.amount + newDenom,
                ibc: ibcDetails,
              };
              balances.push(newIbcBalance);
            }
          }
        } else {
          throw new Error('Insufficient balance: ' + data.amount.denom);
        }
      } else {
        throw new Error('Insufficient balance: ' + data.amount.denom);
      }
      const chain = apistore.getters[GlobalDemerisGetterTypes.API.getChain]({ chain_name: data.to_chain });
      const chainFeeDenom = (chain as ChainData).denoms.find((x) => x.fee_token)?.name;

      const ibcFeeBalance = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (amount.denom == chainFeeDenom && x.on_chain == data.to_chain) {
          return true;
        } else {
          return false;
        }
      });
      if (!ibcFeeBalance || parseInt(parseCoins(ibcFeeBalance.amount)[0].amount) == 0) {
        feeWarning.feeWarning = false;
        feeWarning.ibcWarning = true;
        feeWarning.ibcDetails.chain_name = apistore.getters[GlobalDemerisGetterTypes.API.getDisplayChain]({
          name: data.to_chain,
        });
        feeWarning.ibcDetails.ibcDenom = await getDisplayName(ibcBalance.base_denom);
        feeWarning.ibcDetails.denom = apistore.getters[GlobalDemerisGetterTypes.API.getChain]({
          chain_name: data.to_chain,
        }).denoms.find((x) => x.fee_token == true).display_name;
      }
    }
    if (stepTx.name == 'swap') {
      const data = stepTx.data as Actions.SwapData;
      const balance = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (
          amount.denom == data.from.denom &&
          x.on_chain == apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]
        ) {
          return true;
        } else {
          return false;
        }
      });

      if (balance) {
        const newAmount = parseInt(parseCoins(balance.amount)[0].amount) - parseInt(data.from.amount);
        if (newAmount >= 0) {
          balance.amount = newAmount + parseCoins(balance.amount)[0].denom;
        } else {
          throw new Error('Insufficient balance: ' + data.from.denom);
        }
      } else {
        throw new Error('Insufficient balance: ' + data.from.denom);
      }
      const swapFeeRate = apistore.getters['tendermint.liquidity.v1beta1/getParams']().params.swap_fee_rate;
      const swapFee = {
        amount: Math.ceil((parseInt(data.from.amount) * parseFloat(swapFeeRate)) / 2) + '',
        denom: data.from.denom,
      };
      const newSwapAmount = parseInt(parseCoins(balance.amount)[0].amount) - parseInt(swapFee.amount);
      if (newSwapAmount >= 0) {
        balance.amount = newSwapAmount + parseCoins(balance.amount)[0].denom;
      } else {
        feeWarning.feeWarning = false;
        feeWarning.missingFees.push({
          amount: '' + swapFee.amount,
          chain_name: apistore.getters[GlobalDemerisGetterTypes.API.getDexChain],
          denom: swapFee.denom,
        });
      }
    }
    if (stepTx.name == 'transfer') {
      const data = stepTx.data as Actions.TransferData;
      if (data.to_address != (await getOwnAddress({ chain_name: data.chain_name }))) {
        const balance = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (amount.denom == data.amount.denom && x.on_chain == data.chain_name) {
            return true;
          } else {
            return false;
          }
        });
        if (balance) {
          const newAmount = parseInt(parseCoins(balance.amount)[0].amount) - parseInt(data.amount.amount);
          if (newAmount >= 0) {
            balance.amount = newAmount + parseCoins(balance.amount)[0].denom;
          } else {
            throw new Error('Insufficient balance: ' + data.amount.denom);
          }
        } else {
          throw new Error('Insufficient balance: ' + data.amount.denom);
        }
      }
    }
    if (stepTx.name == 'withdrawliquidity') {
      const data = stepTx.data as Actions.WithdrawLiquidityData;

      const balance = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (
          amount.denom == data.poolCoin.denom &&
          x.on_chain == apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]
        ) {
          return true;
        } else {
          return false;
        }
      });
      if (balance) {
        const newAmount = parseInt(parseCoins(balance.amount)[0].amount) - parseInt(data.poolCoin.amount);
        if (newAmount >= 0) {
          balance.amount = newAmount + parseCoins(balance.amount)[0].denom;
        } else {
          throw new Error('Insufficient balance: ' + data.poolCoin.denom);
        }
      }
    }
    if (stepTx.name == 'stake') {
      const data = stepTx.data as Actions.StakeData;

      const balance = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (amount.denom == data.amount.denom && x.on_chain == data.chain_name) {
          return true;
        } else {
          return false;
        }
      });
      if (balance) {
        const newAmount = parseInt(parseCoins(balance.amount)[0].amount) - parseInt(data.amount.amount);
        if (newAmount >= 0) {
          balance.amount = newAmount + parseCoins(balance.amount)[0].denom;
        } else {
          throw new Error('Insufficient balance: ' + data.amount.denom);
        }
      }
    }
  }
  for (const chain_name in fees) {
    for (const denom in fees[chain_name]) {
      const feeBalance = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];

        if (amount.denom == denom && x.on_chain == chain_name) {
          return true;
        } else {
          return false;
        }
      });
      if (feeBalance) {
        const newAmount = parseInt(parseCoins(feeBalance.amount)[0].amount) - fees[chain_name][denom];
        if (newAmount >= 0) {
          feeBalance.amount = newAmount + parseCoins(feeBalance.amount)[0].denom;
        } else {
          feeWarning.feeWarning = false;
          feeWarning.missingFees.push({
            amount: '' + fees[chain_name][denom],
            chain_name: chain_name,
            denom: denom,
          });
        }
      } else {
        feeWarning.feeWarning = false;
        feeWarning.missingFees.push({
          amount: '' + fees[chain_name][denom],
          chain_name: chain_name,
          denom: denom,
        });
      }
    }
  }
  return feeWarning;
}

export async function validateStepsFeeBalances(
  steps: Actions.Step[],
  balances: Balances,
  allFees: Actions.FeeTotals[],
  gasPriceLevel: Actions.GasPriceLevel,
): Promise<Actions.FeeWarning> {
  const apistore = useStore() as TypedAPIStore;
  const userstore = useStore() as TypedUSERStore;
  const feeWarning: Actions.FeeWarning = {
    missingFees: [],
    ibcWarning: false,
    feeWarning: false,
    ibcDetails: {
      ibcDenom: '',
      chain_name: '',
      denom: '',
    },
  };
  let i = 0;
  for (const step of steps) {
    const fees = allFees[i];
    for (const stepTx of step.transactions) {
      if (stepTx.name == 'addliquidity') {
        const data = stepTx.data as Actions.AddLiquidityData;
        const balanceA = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (
            amount.denom == data.coinA.denom &&
            x.on_chain == apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]
          ) {
            return true;
          } else {
            return false;
          }
        });

        if (balanceA) {
          const newAmount = parseInt(parseCoins(balanceA.amount)[0].amount) - parseInt(data.coinA.amount);
          if (newAmount >= 0) {
            balanceA.amount = newAmount + parseCoins(balanceA.amount)[0].denom;
          } else {
            throw new Error('Insufficient balance: ' + data.coinA.denom);
          }
        } else {
          throw new Error('Insufficient balance: ' + data.coinA.denom);
        }
        const balanceB = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (
            amount.denom == data.coinB.denom &&
            x.on_chain == apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]
          ) {
            return true;
          } else {
            return false;
          }
        });
        if (balanceB) {
          const newAmount = parseInt(parseCoins(balanceB.amount)[0].amount) - parseInt(data.coinB.amount);
          if (newAmount >= 0) {
            balanceB.amount = newAmount + parseCoins(balanceB.amount)[0].denom;
          } else {
            throw new Error('Insufficient balance: ' + data.coinB.denom);
          }
        } else {
          throw new Error('Insufficient balance: ' + data.coinB.denom);
        }
      }
      if (stepTx.name == 'createpool') {
        const data = stepTx.data as Actions.CreatePoolData;
        const creationFee = apistore.getters['tendermint.liquidity.v1beta1/getParams']().params.pool_creation_fee[0];
        const feeBalance = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (
            amount.denom == creationFee.denom &&
            x.on_chain == apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]
          ) {
            return true;
          } else {
            return false;
          }
        });

        const balanceA = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (
            amount.denom == data.coinA.denom &&
            x.on_chain == apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]
          ) {
            return true;
          } else {
            return false;
          }
        });

        if (balanceA) {
          const newAmount = parseInt(parseCoins(balanceA.amount)[0].amount) - parseInt(data.coinA.amount);
          if (newAmount >= 0) {
            balanceA.amount = newAmount + parseCoins(balanceA.amount)[0].denom;
          } else {
            throw new Error('Insufficient balance: ' + data.coinA.denom);
          }
        } else {
          throw new Error('Insufficient balance: ' + data.coinA.denom);
        }
        const balanceB = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (
            amount.denom == data.coinB.denom &&
            x.on_chain == apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]
          ) {
            return true;
          } else {
            return false;
          }
        });
        if (balanceB) {
          const newAmount = parseInt(parseCoins(balanceB.amount)[0].amount) - parseInt(data.coinB.amount);
          if (newAmount >= 0) {
            balanceB.amount = newAmount + parseCoins(balanceB.amount)[0].denom;
          } else {
            throw new Error('Insufficient balance: ' + data.coinB.denom);
          }
        } else {
          throw new Error('Insufficient balance: ' + data.coinB.denom);
        }
        if (feeBalance) {
          const newAmount = parseInt(parseCoins(feeBalance.amount)[0].amount) - parseInt(creationFee.amount);
          if (newAmount >= 0) {
            feeBalance.amount = newAmount + parseCoins(feeBalance.amount)[0].denom;
          } else {
            feeWarning.feeWarning = false;
            feeWarning.missingFees.push({
              amount: '' + creationFee.amount,
              chain_name: apistore.getters[GlobalDemerisGetterTypes.API.getDexChain],
              denom: creationFee.denom,
            });
          }
        } else {
          feeWarning.feeWarning = false;
          feeWarning.missingFees.push({
            amount: '' + creationFee.amount,
            chain_name: apistore.getters[GlobalDemerisGetterTypes.API.getDexChain],
            denom: creationFee.denom,
          });
        }
      }
      if (stepTx.name == 'ibc_backward') {
        const data = stepTx.data as Actions.IBCBackwardsData;
        const ibcBalance = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (amount.denom == data.amount.denom && x.on_chain == data.from_chain) {
            return true;
          } else {
            return false;
          }
        });
        if (ibcBalance) {
          const newAmount = parseInt(parseCoins(ibcBalance.amount)[0].amount) - parseInt(data.amount.amount);
          if (newAmount >= 0) {
            ibcBalance.amount = newAmount + parseCoins(ibcBalance.amount)[0].denom;
            let newDenom;
            if (ibcBalance.ibc.path.split('/').length > 2) {
              newDenom = getDenomHash(ibcBalance.ibc.path, ibcBalance.base_denom, 1);
            } else {
              newDenom = ibcBalance.base_denom;
            }
            if (!data.to_address) {
              const rcptBalance = balances.find((x) => {
                const amount = parseCoins(x.amount)[0];
                if (amount.denom == newDenom && x.on_chain == data.to_chain) {
                  return true;
                } else {
                  return false;
                }
              });
              let additionalFee = 0;
              if (stepTx.addFee) {
                additionalFee =
                  parseFloat(stepTx.feeToAdd[0].amount[gasPriceLevel]) *
                  userstore.getters[GlobalDemerisGetterTypes.USER.getGasLimit];
              }

              if (rcptBalance) {
                const newIbcAmount =
                  parseInt(parseCoins(rcptBalance.amount)[0].amount) + parseInt(data.amount.amount) + additionalFee;
                rcptBalance.amount = newIbcAmount + parseCoins(rcptBalance.amount)[0].denom;
              } else {
                const ibcDetails: IbcInfo = {};
                if (ibcBalance.ibc.path.split('/').length > 2) {
                  ibcDetails.path = ibcBalance.ibc.path.split('/').slice(2).join('/');
                  ibcDetails.hash = newDenom.replace('ibc/', '');
                }
                const newIbcBalance: Balance = {
                  address: keyHashfromAddress(await getOwnAddress({ chain_name: data.to_chain })),
                  base_denom: ibcBalance.base_denom,
                  verified: ibcBalance.verified,
                  on_chain: data.to_chain,
                  amount: parseInt(data.amount.amount) + additionalFee + newDenom,
                  ibc: ibcDetails,
                };
                balances.push(newIbcBalance);
              }
            }
          } else {
            throw new Error('Insufficient balance: ' + data.amount.denom);
          }
        } else {
          throw new Error('Insufficient balance: ' + data.amount.denom);
        }
      }
      if (stepTx.name == 'ibc_forward') {
        const data = stepTx.data as Actions.IBCForwardsData;
        const ibcBalance = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (amount.denom == data.amount.denom && x.on_chain == data.from_chain) {
            return true;
          } else {
            return false;
          }
        });
        if (ibcBalance) {
          const newAmount = parseInt(parseCoins(ibcBalance.amount)[0].amount) - parseInt(data.amount.amount);
          if (newAmount >= 0) {
            ibcBalance.amount = newAmount + parseCoins(ibcBalance.amount)[0].denom;
            const newDenom = generateDenomHash(data.through, ibcBalance.base_denom);

            if (!data.to_address) {
              const rcptBalance = balances.find((x) => {
                const amount = parseCoins(x.amount)[0];
                if (amount.denom == newDenom && x.on_chain == data.to_chain) {
                  return true;
                } else {
                  return false;
                }
              });
              if (rcptBalance) {
                const newIbcAmount = parseInt(parseCoins(rcptBalance.amount)[0].amount) + parseInt(data.amount.amount);
                rcptBalance.amount = newIbcAmount + parseCoins(rcptBalance.amount)[0].denom;
              } else {
                const ibcDetails: IbcInfo = {};
                if (ibcBalance.ibc.path?.split('/').length > 2) {
                  ibcDetails.path = 'transfer/' + data.through;
                  ibcDetails.hash = newDenom.replace('ibc/', '');
                }
                const newIbcBalance: Balance = {
                  address: keyHashfromAddress(await getOwnAddress({ chain_name: data.to_chain })),
                  base_denom: ibcBalance.base_denom,
                  verified: ibcBalance.verified,
                  on_chain: data.to_chain,
                  amount: data.amount.amount + newDenom,
                  ibc: ibcDetails,
                };
                balances.push(newIbcBalance);
              }
            }
          } else {
            throw new Error('Insufficient balance: ' + data.amount.denom);
          }
        } else {
          throw new Error('Insufficient balance: ' + data.amount.denom);
        }
        const chain = apistore.getters[GlobalDemerisGetterTypes.API.getChain]({ chain_name: data.to_chain });
        const chainFeeDenom = (chain as ChainData).denoms.find((x) => x.fee_token)?.name;

        const ibcFeeBalance = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (amount.denom == chainFeeDenom && x.on_chain == data.to_chain) {
            return true;
          } else {
            return false;
          }
        });
        if (!ibcFeeBalance || parseInt(parseCoins(ibcFeeBalance.amount)[0].amount) == 0) {
          feeWarning.feeWarning = false;
          feeWarning.ibcWarning = true;
          feeWarning.ibcDetails.chain_name = apistore.getters[GlobalDemerisGetterTypes.API.getDisplayChain]({
            name: data.to_chain,
          });
          feeWarning.ibcDetails.ibcDenom = await getDisplayName(ibcBalance.base_denom);
          feeWarning.ibcDetails.denom = apistore.getters[GlobalDemerisGetterTypes.API.getChain]({
            chain_name: data.to_chain,
          }).denoms.find((x) => x.fee_token == true).display_name;
        }
      }
      if (stepTx.name == 'swap') {
        const data = stepTx.data as Actions.SwapData;
        const balance = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (
            amount.denom == data.from.denom &&
            x.on_chain == apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]
          ) {
            return true;
          } else {
            return false;
          }
        });

        if (balance) {
          const newAmount = parseInt(parseCoins(balance.amount)[0].amount) - parseInt(data.from.amount);
          if (newAmount >= 0) {
            balance.amount = newAmount + parseCoins(balance.amount)[0].denom;
          } else {
            throw new Error('Insufficient balance: ' + data.from.denom);
          }
        } else {
          throw new Error('Insufficient balance: ' + data.from.denom);
        }
        const swapFeeRate = apistore.getters['tendermint.liquidity.v1beta1/getParams']().params.swap_fee_rate;
        const swapFee = {
          amount: Math.ceil((parseInt(data.from.amount) * parseFloat(swapFeeRate)) / 2) + '',
          denom: data.from.denom,
        };
        const newSwapAmount = parseInt(parseCoins(balance.amount)[0].amount) - parseInt(swapFee.amount);
        if (newSwapAmount >= 0) {
          balance.amount = newSwapAmount + parseCoins(balance.amount)[0].denom;
        } else {
          feeWarning.feeWarning = false;
          feeWarning.missingFees.push({
            amount: '' + swapFee.amount,
            chain_name: apistore.getters[GlobalDemerisGetterTypes.API.getDexChain],
            denom: swapFee.denom,
          });
        }
      }
      if (stepTx.name == 'transfer') {
        const data = stepTx.data as Actions.TransferData;
        if (data.to_address != (await getOwnAddress({ chain_name: data.chain_name }))) {
          const balance = balances.find((x) => {
            const amount = parseCoins(x.amount)[0];
            if (amount.denom == data.amount.denom && x.on_chain == data.chain_name) {
              return true;
            } else {
              return false;
            }
          });
          if (balance) {
            const newAmount = parseInt(parseCoins(balance.amount)[0].amount) - parseInt(data.amount.amount);
            if (newAmount >= 0) {
              balance.amount = newAmount + parseCoins(balance.amount)[0].denom;
            } else {
              throw new Error('Insufficient balance: ' + data.amount.denom);
            }
          } else {
            throw new Error('Insufficient balance: ' + data.amount.denom);
          }
        }
      }
      if (stepTx.name == 'withdrawliquidity') {
        const data = stepTx.data as Actions.WithdrawLiquidityData;

        const balance = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (
            amount.denom == data.poolCoin.denom &&
            x.on_chain == apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]
          ) {
            return true;
          } else {
            return false;
          }
        });
        if (balance) {
          const newAmount = parseInt(parseCoins(balance.amount)[0].amount) - parseInt(data.poolCoin.amount);
          if (newAmount >= 0) {
            balance.amount = newAmount + parseCoins(balance.amount)[0].denom;
          } else {
            throw new Error('Insufficient balance: ' + data.poolCoin.denom);
          }
        }
      }
      if (stepTx.name == 'stake') {
        const data = stepTx.data as Actions.StakeData[];

        const balance = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (amount.denom == data[0].amount.denom && x.on_chain == data[0].chain_name) {
            return true;
          } else {
            return false;
          }
        });
        if (balance) {
          const newAmount =
            parseInt(parseCoins(balance.amount)[0].amount) -
            data.reduce((acc, txdata) => {
              return acc + parseInt(txdata.amount.amount);
            }, 0);
          if (newAmount >= 0) {
            balance.amount = newAmount + parseCoins(balance.amount)[0].denom;
          } else {
            throw new Error(
              'Insufficient balance: ' +
                data.reduce((acc, txdata) => {
                  return acc + parseInt(txdata.amount.amount);
                }, 0),
            );
          }
        }
      }
    }
    for (const chain_name in fees) {
      for (const denom in fees[chain_name]) {
        const feeBalance = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];

          if (amount.denom == denom && x.on_chain == chain_name) {
            return true;
          } else {
            return false;
          }
        });
        if (feeBalance) {
          const newAmount = parseInt(parseCoins(feeBalance.amount)[0].amount) - fees[chain_name][denom];
          if (newAmount >= 0) {
            feeBalance.amount = newAmount + parseCoins(feeBalance.amount)[0].denom;
          } else {
            feeWarning.feeWarning = false;
            feeWarning.missingFees.push({
              amount: '' + fees[chain_name][denom],
              chain_name: chain_name,
              denom: denom,
            });
          }
        } else {
          if (fees[chain_name][denom] > 0) {
            feeWarning.feeWarning = false;
            feeWarning.missingFees.push({
              amount: '' + fees[chain_name][denom],
              chain_name: chain_name,
              denom: denom,
            });
          }
        }
      }
    }
    i++;
  }
  return feeWarning;
}
export async function isValidIBCReserveDenom(
  denom: string,
  dexChain: string,
  verifiedDenoms: API.VerifiedDenoms,
): Promise<boolean> {
  const apistore = useStore() as TypedAPIStore;
  let verifyTrace;

  try {
    verifyTrace =
      apistore.getters[GlobalDemerisGetterTypes.API.getVerifyTrace]({
        chain_name: dexChain,
        hash: denom.split('/')[1],
      }) ??
      (await apistore.dispatch(
        GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
        { subscribe: false, params: { chain_name: dexChain, hash: denom.split('/')[1] } },
        { root: true },
      ));
  } catch (e) {
    return false;
  }
  if (!verifyTrace || !verifyTrace.verified) {
    console.error("Couldn't verify trace for", JSON.stringify(verifyTrace));
    return false;
  }
  if (verifyTrace.path.split('/').length > 2) {
    return false;
  }

  if (!verifiedDenoms.find((item) => item.name === verifyTrace.base_denom)) {
    return false;
  }

  const primaryChannel =
    apistore.getters[GlobalDemerisGetterTypes.API.getPrimaryChannel]({
      chain_name: dexChain,
      destination_chain_name: verifyTrace.trace[0].counterparty_name,
    }) ??
    (await apistore.dispatch(
      GlobalDemerisActionTypes.API.GET_PRIMARY_CHANNEL,
      {
        subscribe: false,
        params: { chain_name: dexChain, destination_chain_name: verifyTrace.trace[0].counterparty_name },
      },
      { root: true },
    ));

  if (primaryChannel == getChannel(verifyTrace.path, 0)) {
    return true;
  }

  return false;
}
