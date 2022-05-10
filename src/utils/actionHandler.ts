/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/naming-convention */
import { registry as gaiaRegistry } from '@clockwork-projects/cosmos-gaia-js';
import { registry as crescentRegistry } from '@clockwork-projects/crescent-network-crescent-js';
import { registry as osmosisRegistry } from '@clockwork-projects/osmosis-labs-osmosis-js';
import { AminoMsg } from '@cosmjs/amino';
import mapTransaction from '@emeris/mapper';
import { EmerisAPI, EmerisBase, EmerisDEXInfo, EmerisFees } from '@emeris/types';
import { bech32 } from 'bech32';
import BigNumber from 'bignumber.js';

import { calculateSlippage } from '@/features/swap/logic';
import { GlobalActionTypes, GlobalGetterTypes, RootStoreTyped } from '@/store';
import * as Actions from '@/types/actions';
import { useStore } from '@/utils/useStore';

import {
  generateDenomHash,
  getChannel,
  getDenomHash,
  getOwnAddress,
  isNative,
  keyHashfromAddress,
  parseCoins,
  truncateMiddle,
} from './basic';
import { featureRunning } from './FeatureManager';

// Action-handler / action composing using the blocks above

export async function msgFromStepTransaction(
  stepTx: Actions.StepTransaction,
  gasPriceLevel: EmerisFees.GasPriceLevel,
): Promise<Actions.MsgMeta> {
  const chainName = ['stake', 'swap'].includes(stepTx.type) ? stepTx.data[0].chainName : stepTx.data.chainName;

  const typedstore = useStore() as RootStoreTyped;
  if (stepTx.type == 'transfer') {
    const msg = await (mapTransaction({
      chainName,
      signingAddress: await getOwnAddress({ chain_name: chainName }),
      txs: [stepTx],
    }) as Promise<AminoMsg[]>);
    return { msg: msg, chain_name: chainName, registry: gaiaRegistry };
  }

  if (stepTx.type == 'IBCtransferForward') {
    const msg = await (mapTransaction({
      chainName,
      signingAddress: await getOwnAddress({ chain_name: chainName }),
      txs: [stepTx],
    }) as Promise<AminoMsg[]>);
    return { msg: msg, chain_name: chainName, registry: gaiaRegistry };
  }

  if (stepTx.type == 'IBCtransferBackward') {
    let fromAmount = stepTx.data.amount.amount;
    if (stepTx.addFee) {
      fromAmount = (
        parseInt(fromAmount) +
        Math.ceil(stepTx.feeToAdd[0].amount[gasPriceLevel] * typedstore.getters[GlobalGetterTypes.USER.getGasLimit])
      ).toString();
    }
    stepTx.data.amount.amount = fromAmount;
    const msg = await (mapTransaction({
      chainName,
      signingAddress: await getOwnAddress({ chain_name: chainName }),
      txs: [stepTx],
    }) as Promise<AminoMsg[]>);
    return { msg: msg, chain_name: chainName, registry: gaiaRegistry };
  }
  if (stepTx.type == 'addLiquidity') {
    const msg = await (mapTransaction({
      chainName,
      signingAddress: await getOwnAddress({ chain_name: chainName }),
      txs: [stepTx],
    }) as Promise<AminoMsg[]>);
    return { msg: msg, chain_name: chainName, registry: gaiaRegistry };
  }
  if (stepTx.type == 'withdrawLiquidity') {
    const msg = await (mapTransaction({
      chainName,
      signingAddress: await getOwnAddress({ chain_name: chainName }),
      txs: [stepTx],
    }) as Promise<AminoMsg[]>);
    return { msg: msg, chain_name: chainName, registry: gaiaRegistry };
  }
  if (stepTx.type == 'createPool') {
    const msg = await (mapTransaction({
      chainName,
      signingAddress: await getOwnAddress({ chain_name: chainName }),
      txs: [stepTx],
    }) as Promise<AminoMsg[]>);
    return { msg: msg, chain_name: chainName, registry: gaiaRegistry };
  }
  if (stepTx.type == 'swap') {
    const slippage = (typedstore.getters[GlobalGetterTypes.USER.getSlippagePerc] || 0.5) / 100;

    if (featureRunning('DEX_AGG')) {
      stepTx.data[stepTx.data.length - 1].to.amount = calculateSlippage(
        stepTx.data[stepTx.data.length - 1].to.amount,
        slippage * 100,
      );
    } else {
      let isReverse = false;
      const price = [stepTx.data.from, stepTx.data.to];

      if (stepTx.data.from.denom !== stepTx.data.pool.reserve_coin_denoms?.[0]) {
        isReverse = true;
      }
      price.sort((a, b) => {
        if (a.denom < b.denom) return -1;
        if (a.denom > b.denom) return 1;
        return 0;
      });

      const orderPrice =
        (parseInt(price[0].amount) / parseInt(price[1].amount)) * (isReverse ? 1 - slippage : 1 + slippage);
      const newToAmount =
        price[0].denom == stepTx.data.from.denom
          ? parseInt(stepTx.data.from.amount) / orderPrice
          : parseInt(stepTx.data.from.amount) * orderPrice;

      stepTx.data.to.amount = Math.ceil(newToAmount).toString();
    }

    const msg = await (mapTransaction({
      chainName,
      signingAddress: await getOwnAddress({ chain_name: chainName }),
      txs: [stepTx],
    }) as Promise<AminoMsg[]>);
    if (stepTx.protocol == EmerisDEXInfo.DEX.Osmosis) {
      return { msg: msg, chain_name: chainName, registry: osmosisRegistry };
    } else if (stepTx.protocol == EmerisDEXInfo.DEX.Gravity) {
      return { msg: msg, chain_name: chainName, registry: gaiaRegistry };
    } else {
      return { msg: msg, chain_name: chainName, registry: crescentRegistry };
    }
  }
  if (stepTx.type == 'claim') {
    const msg = await (mapTransaction({
      chainName,
      signingAddress: await getOwnAddress({ chain_name: chainName }),
      txs: [stepTx],
    }) as Promise<AminoMsg[]>);
    return { msg: msg, chain_name: chainName, registry: gaiaRegistry };
  }
  if (stepTx.type == 'stake') {
    const msg = await (mapTransaction({
      chainName,
      signingAddress: await getOwnAddress({ chain_name: chainName }),
      txs: [stepTx],
    }) as Promise<AminoMsg[]>);
    return { msg: msg, chain_name: chainName, registry: gaiaRegistry };
  }
  if (stepTx.type == 'unstake') {
    const msg = await (mapTransaction({
      chainName,
      signingAddress: await getOwnAddress({ chain_name: chainName }),
      txs: [stepTx],
    }) as Promise<AminoMsg[]>);
    return { msg: msg, chain_name: chainName, registry: gaiaRegistry };
  }
  if (stepTx.type == 'switch') {
    const msg = await (mapTransaction({
      chainName,
      signingAddress: await getOwnAddress({ chain_name: chainName }),
      txs: [stepTx],
    }) as Promise<AminoMsg[]>);
    return { msg: msg, chain_name: chainName, registry: gaiaRegistry };
  }
}
// TODO make getter so it out updates on getFeeTokens getter
export async function getFeeForChain(chain_name: string): Promise<Array<Actions.FeeWDenom>> {
  if (!chain_name) return [];

  const typedstore = useStore() as RootStoreTyped;
  const denoms = typedstore.getters[GlobalGetterTypes.API.getFeeTokens]({
    chain_name,
  });
  const fees = [];
  for (const denom of denoms) {
    fees.push({ amount: denom.gas_price_levels, denom: denom.name, chain_name });
  }
  return fees;
}
export function getBaseDenomSync(denom: string) {
  const typedstore = useStore() as RootStoreTyped;
  const traces = typedstore.getters[GlobalGetterTypes.API.getAllVerifiedTraces];
  return traces[denom.split('/')[1]?.toUpperCase()]?.base_denom ?? denom;
}
export async function getBaseDenom(denom: string, chainName = null): Promise<string> {
  const typedstore = useStore() as RootStoreTyped;
  const chain_name = chainName || typedstore.getters[GlobalGetterTypes.API.getDexChain];
  const verifiedDenoms = typedstore.getters[GlobalGetterTypes.API.getVerifiedDenoms];

  if (verifiedDenoms.find((item) => item.name === denom)) {
    return denom;
  }

  const hash = denom.split('/')[1];

  if (!hash) {
    return denom;
  }

  let trace = typedstore.getters[GlobalGetterTypes.API.getVerifyTrace]({ chain_name, hash });

  if (!trace) {
    trace = await typedstore.dispatch(
      GlobalActionTypes.API.GET_VERIFY_TRACE,
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
  const typedstore = useStore() as RootStoreTyped;
  const chain_name = chainName || typedstore.getters[GlobalGetterTypes.API.getDexChain];
  const verifiedDenoms = typedstore.getters[GlobalGetterTypes.API.getVerifiedDenoms];

  const verified = verifiedDenoms.find((item) => item.name === denom);
  if (verified) {
    return verified.chain_name;
  }

  const hash = denom.split('/')[1];

  if (!hash) {
    throw new Error('Denom not verified');
  }

  let trace = typedstore.getters[GlobalGetterTypes.API.getVerifyTrace]({ chain_name, hash });

  if (!trace) {
    trace = await typedstore.dispatch(
      GlobalActionTypes.API.GET_VERIFY_TRACE,
      { subscribe: false, params: { chain_name, hash } },
      { root: true },
    );
  }

  if (trace) {
    return await getNativeChain(trace.base_denom);
  }
  throw new Error('Denom not verified');
}
export function getStepTransactionDetailFromResponse(response: EmerisAPI.TransactionDetailResponse) {
  const typedstore = useStore() as RootStoreTyped;
  const getChainFromAddress = (address: string): EmerisAPI.Chain => {
    const chains = Object.values(typedstore.getters[GlobalGetterTypes.API.getChains]);
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
  const typedstore = useStore() as RootStoreTyped;
  const timeout = 1000;
  const limit = 3;

  let retries = 0;
  let error: Error;

  let denoms = [];
  let chain = transaction.data.chainName ?? typedstore.getters[GlobalGetterTypes.API.getDexChain];

  switch (transaction.type) {
    case 'addLiquidity':
      const transferdata = transaction.data;
      denoms = [transferdata.coinA.denom, transferdata.coinB.denom];
      break;
    case 'createPool':
      const createdata = transaction.data;
      denoms = [createdata.coinA.denom, createdata.coinB.denom];
      break;
    case 'swap':
      chain = transaction.data[0].chainName;
      const swapdata = transaction.data[0];
      denoms = [swapdata.from.denom, swapdata.to.denom];
      break;
    case 'withdrawLiquidity':
      const withdrawdata = transaction.data;
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
      await Promise.all(
        ibcDenoms.map((denom) =>
          typedstore.dispatch(
            GlobalActionTypes.API.GET_VERIFY_TRACE,
            {
              subscribe: false,
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
  return await getTicker(name, chain_name, 'display_name');
}
export async function getTicker(name, chain_name = null, getValue = 'ticker') {
  const typedstore = useStore() as RootStoreTyped;
  if (isNative(name)) {
    const value =
      typedstore.getters[GlobalGetterTypes.API.getVerifiedDenoms]?.find((x) => x.name == name)?.[getValue] ?? null;
    if (value) {
      return value;
    }
    return name;
  } else {
    let verifyTrace;
    try {
      verifyTrace =
        typedstore.getters[GlobalGetterTypes.API.getVerifyTrace]({ chain_name, hash: name.split('/')[1] }) ??
        (await typedstore.dispatch(
          GlobalActionTypes.API.GET_VERIFY_TRACE,
          { subscribe: false, params: { chain_name, hash: name.split('/')[1] } },
          { root: true },
        ));
    } catch (e) {
      if (name && name.startsWith('ibc/')) {
        return `ibc/${truncateMiddle(name.split('/')[1])}(unverified)`;
      }
      return name + '(unverified)';
    }
    return await getTicker(verifyTrace.base_denom);
  }
}

export async function isLive(chain_name) {
  const typedstore = useStore() as RootStoreTyped;
  const status =
    typedstore.getters[GlobalGetterTypes.API.getChainStatus]({
      chain_name,
    }) ??
    (await typedstore.dispatch(
      GlobalActionTypes.API.GET_CHAIN_STATUS,
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
  let chainName: string;
  if (stepTx.type == 'stake') {
    chainName = stepTx.data[0].chainName;
  } else if (stepTx.type == 'swap') {
    chainName = stepTx.data[0].chainName;
  } else {
    chainName = stepTx.data.chainName;
  }
  const fee = await getFeeForChain(chainName);
  return fee;
}
export async function feeForStep(
  step: Actions.Step,
  gasPriceLevel: EmerisFees.GasPriceLevel,
): Promise<Actions.FeeTotals> {
  const feeTotals = {};

  let used: EmerisBase.ChainAmount;
  for (const stepTx of step.transactions) {
    const fees = await feeForStepTransaction(stepTx);

    if (!feeTotals[fees[0].chain_name]) {
      feeTotals[fees[0].chain_name] = {};
    }
    used = getUsedFee(fees, gasPriceLevel);
    feeTotals[used.chain_name][used.denom]
      ? (feeTotals[used.chain_name][used.denom] = feeTotals[used.chain_name][used.denom] + parseFloat(used.amount))
      : (feeTotals[used.chain_name][used.denom] = parseFloat(used.amount));
  }
  return feeTotals;
}

export async function feeForSteps(
  steps: Actions.Step[],
  gasPriceLevel: EmerisFees.GasPriceLevel,
): Promise<Actions.FeeTotals> {
  const feeTotals = {};

  let used: EmerisBase.ChainAmount;
  if (steps) {
    for (const step of steps) {
      for (const stepTx of step.transactions) {
        const fees = await feeForStepTransaction(stepTx);

        if (!feeTotals[fees[0].chain_name]) {
          feeTotals[fees[0].chain_name] = {};
        }
        used = getUsedFee(fees, gasPriceLevel);

        feeTotals[used.chain_name][used.denom]
          ? (feeTotals[used.chain_name][used.denom] = feeTotals[used.chain_name][used.denom] + parseFloat(used.amount))
          : (feeTotals[used.chain_name][used.denom] = parseFloat(used.amount));
      }
    }
  }
  return feeTotals;
}

export function getUsedFee(
  fees: Array<Actions.FeeWDenom>,
  gasPriceLevel: EmerisFees.GasPriceLevel,
): EmerisBase.ChainAmount {
  const typedstore = useStore() as RootStoreTyped;
  const feeOption = fees[0];
  const used = {
    amount: (feeOption.amount[gasPriceLevel] * typedstore.getters[GlobalGetterTypes.USER.getGasLimit]).toString(),
    denom: feeOption.denom,
    chain_name: feeOption.chain_name,
  };
  return used;
}

export async function toRedeem(balances: EmerisAPI.Balances): Promise<EmerisAPI.Balances> {
  const typedstore = useStore() as RootStoreTyped;
  const allValidRedeemableBalances = balances.filter((x) => x.verified && Object.keys(x.ibc).length !== 0);
  const redeemableBalances = [];
  for (const balance of allValidRedeemableBalances) {
    if (balance.ibc.path.split('/').length > 2) {
      redeemableBalances.push(balance);
    } else {
      let verifyTrace;
      try {
        verifyTrace =
          typedstore.getters[GlobalGetterTypes.API.getVerifyTrace]({
            chain_name: balance.on_chain,
            hash: balance.ibc.hash,
          }) ??
          (await typedstore.dispatch(
            GlobalActionTypes.API.GET_VERIFY_TRACE,
            { subscribe: false, params: { chain_name: balance.on_chain, hash: balance.ibc.hash } },
            { root: true },
          ));
      } catch (e) {
        continue;
      }

      const primaryChannel = typedstore.getters[GlobalGetterTypes.API.getPrimaryChannel]({
        chain_name: balance.on_chain,
        destination_chain_name: verifyTrace.trace[0].counterparty_name,
      });
      if (primaryChannel != getChannel(verifyTrace.path, 0)) {
        redeemableBalances.push(balance);
      }
    }
  }
  return redeemableBalances;
}

export async function validBalances(balances: EmerisAPI.Balances): Promise<EmerisAPI.Balances> {
  const typedstore = useStore() as RootStoreTyped;
  const validBalances = [];
  const verifiedDenoms = typedstore.getters[GlobalGetterTypes.API.getVerifiedDenoms];

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
          const verifyTrace = typedstore.getters[GlobalGetterTypes.API.getVerifyTrace]({
            chain_name: balance.on_chain,
            hash: balance.ibc.hash,
          });

          if (!verifyTrace || !verifyTrace.verified) {
            return;
          }

          const primaryChannel = typedstore.getters[GlobalGetterTypes.API.getPrimaryChannel]({
            chain_name: balance.on_chain,
            destination_chain_name: verifyTrace.trace[0].counterparty_name,
          });
          if (primaryChannel == getChannel(verifyTrace.path, 0)) {
            validBalances.push(balance);
          }
        }
      }
    }),
  );
  return validBalances;
}

export async function validPools(pools: Actions.Pool[]): Promise<Actions.Pool[]> {
  const typedstore = useStore() as RootStoreTyped;
  const validPools = [];
  const verifiedDenoms = typedstore.getters[GlobalGetterTypes.API.getVerifiedDenoms];
  const dexChain = typedstore.getters[GlobalGetterTypes.API.getDexChain];

  const chains =
    typedstore.getters[GlobalGetterTypes.API.getChains] ??
    (await typedstore.dispatch(GlobalActionTypes.API.GET_CHAINS, {
      subscribe: false,
    }));
  for (const chain in chains) {
    if (!chains[chain].primary_channel)
      chains[chain] = await typedstore.dispatch(GlobalActionTypes.API.GET_CHAIN, {
        subscribe: true,
        params: {
          chain_name: chain,
        },
      });
  }
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
  return validPools;
}
export async function chainStatusForSteps(steps: Actions.Step[]) {
  const typedstore = useStore() as RootStoreTyped;
  let allClear = true;
  let relayerStatus = true;
  const failedChains = [];
  for (const step of steps) {
    for (const stepTx of step.transactions) {
      if (stepTx.type == 'transfer') {
        const chain_name = stepTx.data.chainName;
        if (!typedstore.getters[GlobalGetterTypes.API.getChainStatus]({ chain_name })) {
          allClear = false;
          if (failedChains.includes(chain_name)) {
            continue;
          } else {
            failedChains.push(chain_name);
          }
        }
      }
      if (stepTx.type == 'IBCtransferBackward') {
        const chain_name = stepTx.data.chainName;
        const dest_chain_name = stepTx.data.toChain;
        if (!typedstore.getters[GlobalGetterTypes.API.getChainStatus]({ chain_name })) {
          allClear = false;
          if (!failedChains.includes(chain_name)) {
            failedChains.push(chain_name);
          }
        }
        if (!typedstore.getters[GlobalGetterTypes.API.getChainStatus]({ chain_name: dest_chain_name })) {
          allClear = false;
          if (failedChains.includes(dest_chain_name)) {
            continue;
          } else {
            failedChains.push(dest_chain_name);
          }
        }

        if (
          !typedstore.getters[GlobalGetterTypes.API.getRelayerChainStatus]({ chain_name }) ||
          !typedstore.getters[GlobalGetterTypes.API.getRelayerChainStatus]({ chain_name: dest_chain_name })
        ) {
          relayerStatus = false;
        }
      }
      if (stepTx.type == 'IBCtransferForward') {
        const chain_name = stepTx.data.chainName;
        const dest_chain_name = stepTx.data.toChain;
        if (!typedstore.getters[GlobalGetterTypes.API.getChainStatus]({ chain_name })) {
          allClear = false;
          if (!failedChains.includes(chain_name)) {
            failedChains.push(chain_name);
          }
        }
        if (!typedstore.getters[GlobalGetterTypes.API.getChainStatus]({ chain_name: dest_chain_name })) {
          allClear = false;
          if (failedChains.includes(dest_chain_name)) {
            continue;
          } else {
            failedChains.push(dest_chain_name);
          }
        }
      }
      if (stepTx.type == 'addLiquidity') {
        const chain_name = stepTx.data.chainName;
        if (!typedstore.getters[GlobalGetterTypes.API.getChainStatus]({ chain_name })) {
          allClear = false;
          if (failedChains.includes(chain_name)) {
            continue;
          } else {
            failedChains.push(chain_name);
          }
        }
      }
      if (stepTx.type == 'withdrawLiquidity') {
        const chain_name = stepTx.data.chainName;
        if (!typedstore.getters[GlobalGetterTypes.API.getChainStatus]({ chain_name })) {
          allClear = false;
          if (failedChains.includes(chain_name)) {
            continue;
          } else {
            failedChains.push(chain_name);
          }
        }
      }
      if (stepTx.type == 'createPool') {
        const chain_name = stepTx.data.chainName;
        if (!typedstore.getters[GlobalGetterTypes.API.getChainStatus]({ chain_name })) {
          allClear = false;
          if (failedChains.includes(chain_name)) {
            continue;
          } else {
            failedChains.push(chain_name);
          }
        }
      }
      if (stepTx.type == 'swap') {
        const chain_name = stepTx.data[0].chainName;
        if (!typedstore.getters[GlobalGetterTypes.API.getChainStatus]({ chain_name })) {
          allClear = false;
          if (failedChains.includes(chain_name)) {
            continue;
          } else {
            failedChains.push(chain_name);
          }
        }
      }
      if (stepTx.type == 'claim' || stepTx.type == 'unstake' || stepTx.type == 'switch') {
        const chain_name = stepTx.data.chainName;
        if (!typedstore.getters[GlobalGetterTypes.API.getChainStatus]({ chain_name })) {
          allClear = false;
          if (failedChains.includes(chain_name)) {
            continue;
          } else {
            failedChains.push(chain_name);
          }
        }
      }
      if (stepTx.type == 'stake') {
        const chain_name = stepTx.data[0].chainName;
        if (!typedstore.getters[GlobalGetterTypes.API.getChainStatus]({ chain_name })) {
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
  balances: EmerisAPI.Balances,
  fees: Actions.FeeTotals,
  gasPriceLevel: EmerisFees.GasPriceLevel,
): Promise<Actions.FeeWarning> {
  const typedstore = useStore() as RootStoreTyped;
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
    if (stepTx.type == 'addLiquidity') {
      const data = stepTx.data;
      const balanceA = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (amount.denom == data.coinA.denom && x.on_chain == data.chainName) {
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
        if (amount.denom == data.coinB.denom && x.on_chain == data.chainName) {
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
    if (stepTx.type == 'createPool') {
      const data = stepTx.data;
      const creationFee = typedstore.getters['tendermint.liquidity.v1beta1/getParams']().params.pool_creation_fee[0];
      const feeBalance = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (amount.denom == creationFee.denom && x.on_chain == data.chainName) {
          return true;
        } else {
          return false;
        }
      });

      const balanceA = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (amount.denom == data.coinA.denom && x.on_chain == data.chainName) {
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
        if (amount.denom == data.coinB.denom && x.on_chain == data.chainName) {
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
            chain_name: data.chainName,
            denom: creationFee.denom,
          });
        }
      } else {
        feeWarning.feeWarning = false;
        feeWarning.missingFees.push({
          amount: '' + creationFee.amount,
          chain_name: data.chainName,
          denom: creationFee.denom,
        });
      }
    }
    if (stepTx.type == 'IBCtransferBackward') {
      const data = stepTx.data;
      const ibcBalance = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (amount.denom == data.amount.denom && x.on_chain == data.chainName) {
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
          if (stepTx.own) {
            const rcptBalance = balances.find((x) => {
              const amount = parseCoins(x.amount)[0];
              if (amount.denom == newDenom && x.on_chain == data.toChain) {
                return true;
              } else {
                return false;
              }
            });
            let additionalFee = 0;
            if (stepTx.addFee) {
              additionalFee =
                stepTx.feeToAdd[0].amount[gasPriceLevel] * typedstore.getters[GlobalGetterTypes.USER.getGasLimit];
            }
            if (rcptBalance) {
              const newIbcAmount =
                parseInt(parseCoins(rcptBalance.amount)[0].amount) + parseInt(data.amount.amount) + additionalFee;
              rcptBalance.amount = newIbcAmount + parseCoins(rcptBalance.amount)[0].denom;
            } else {
              let ibcDetails: EmerisBase.IbcInfo | Record<string, never> = {};
              if (ibcBalance.ibc.path.split('/').length > 2) {
                ibcDetails = {
                  path: ibcBalance.ibc.path.split('/').slice(2).join('/'),
                  hash: newDenom.replace('ibc/', ''),
                };
              }
              const newIbcBalance: EmerisAPI.Balance = {
                address: keyHashfromAddress(await getOwnAddress({ chain_name: data.toChain })),
                base_denom: ibcBalance.base_denom,
                verified: ibcBalance.verified,
                on_chain: data.toChain,
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
    if (stepTx.type == 'IBCtransferForward') {
      const data = stepTx.data;
      const ibcBalance = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (amount.denom == data.amount.denom && x.on_chain == data.chainName) {
          return true;
        } else {
          return false;
        }
      });
      if (ibcBalance) {
        const newAmount = parseInt(parseCoins(ibcBalance.amount)[0].amount) - parseInt(data.amount.amount);
        if (newAmount >= 0) {
          ibcBalance.amount = newAmount + parseCoins(ibcBalance.amount)[0].denom;
          const primaryChannel = typedstore.getters[GlobalGetterTypes.API.getPrimaryChannel]({
            chain_name: data.toChain,
            destination_chain_name: data.chainName,
          });
          const newDenom = generateDenomHash(primaryChannel, ibcBalance.base_denom);

          if (stepTx.own) {
            const rcptBalance = balances.find((x) => {
              const amount = parseCoins(x.amount)[0];
              if (amount.denom == newDenom && x.on_chain == data.toChain) {
                return true;
              } else {
                return false;
              }
            });
            if (rcptBalance) {
              const newIbcAmount = parseInt(parseCoins(rcptBalance.amount)[0].amount) + parseInt(data.amount.amount);
              rcptBalance.amount = newIbcAmount + parseCoins(rcptBalance.amount)[0].denom;
            } else {
              let ibcDetails: EmerisBase.IbcInfo | Record<string, never> = {};
              if (ibcBalance.ibc.path?.split('/').length > 2) {
                ibcDetails = { path: 'transfer/' + data.through, hash: newDenom.replace('ibc/', '') };
              }
              const newIbcBalance: EmerisAPI.Balance = {
                address: keyHashfromAddress(await getOwnAddress({ chain_name: data.toChain })),
                base_denom: ibcBalance.base_denom,
                verified: ibcBalance.verified,
                on_chain: data.toChain,
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
      const chain = typedstore.getters[GlobalGetterTypes.API.getChain]({ chain_name: data.toChain });
      const chainFeeDenom = chain.denoms.find((x) => x.fee_token)?.name;

      const ibcFeeBalance = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (amount.denom == chainFeeDenom && x.on_chain == data.toChain) {
          return true;
        } else {
          return false;
        }
      });
      if (!ibcFeeBalance || parseInt(parseCoins(ibcFeeBalance.amount)[0].amount) == 0) {
        feeWarning.feeWarning = false;
        feeWarning.ibcWarning = true;
        feeWarning.ibcDetails.chain_name = typedstore.getters[GlobalGetterTypes.API.getDisplayChain]({
          name: data.toChain,
        });
        feeWarning.ibcDetails.ibcDenom = await getDisplayName(ibcBalance.base_denom);
        feeWarning.ibcDetails.denom = typedstore.getters[GlobalGetterTypes.API.getChain]({
          chain_name: data.toChain,
        }).denoms.find((x) => x.fee_token == true).display_name;
      }
    }
    if (stepTx.type == 'swap') {
      const data = stepTx.data[0];
      const balance = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (amount.denom == data.from.denom && x.on_chain == data.chainName) {
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
      const swapFeeRate = typedstore.getters['tendermint.liquidity.v1beta1/getParams']().params.swap_fee_rate;
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
          chain_name: data.chainName,
          denom: swapFee.denom,
        });
      }
    }
    if (stepTx.type == 'transfer') {
      const data = stepTx.data;
      if (data.toAddress != (await getOwnAddress({ chain_name: data.chainName }))) {
        const balance = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (amount.denom == data.amount.denom && x.on_chain == data.chainName) {
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
    if (stepTx.type == 'withdrawLiquidity') {
      const data = stepTx.data;

      const balance = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (amount.denom == data.poolCoin.denom && x.on_chain == data.chainName) {
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
    if (stepTx.type == 'stake') {
      const alldata = stepTx.data;
      const data = {
        chain_name: alldata[0].chainName,
        amount: {
          amount: alldata
            .reduce((acc, stakedata) => {
              return parseInt(stakedata.amount.amount) + acc;
            }, 0)
            .toString(),
          denom: alldata[0].amount.denom,
        },
      };
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
  action: string,
  steps: Actions.Step[],
  balances: EmerisAPI.Balances,
  allFees: Actions.FeeTotals[],
  gasPriceLevel: EmerisFees.GasPriceLevel,
): Promise<Actions.FeeWarning> {
  const typedstore = useStore() as RootStoreTyped;
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
    if (action === 'swap' && feeWarning.missingFees.length) break;

    const fees = allFees[i];
    for (const stepTx of step.transactions) {
      if (stepTx.type == 'addLiquidity') {
        const data = stepTx.data;
        const balanceA = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (amount.denom == data.coinA.denom && x.on_chain == data.chainName) {
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
          if (amount.denom == data.coinB.denom && x.on_chain == data.chainName) {
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
      if (stepTx.type == 'createPool') {
        const data = stepTx.data;
        const creationFee = typedstore.getters['tendermint.liquidity.v1beta1/getParams']().params.pool_creation_fee[0];
        const feeBalance = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (amount.denom == creationFee.denom && x.on_chain == data.chainName) {
            return true;
          } else {
            return false;
          }
        });

        const balanceA = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (amount.denom == data.coinA.denom && x.on_chain == data.chainName) {
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
          if (amount.denom == data.coinB.denom && x.on_chain == data.chainName) {
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
              chain_name: data.chainName,
              denom: creationFee.denom,
            });
          }
        } else {
          feeWarning.feeWarning = false;
          feeWarning.missingFees.push({
            amount: '' + creationFee.amount,
            chain_name: typedstore.getters[GlobalGetterTypes.API.getDexChain],
            denom: creationFee.denom,
          });
        }
      }
      if (stepTx.type == 'IBCtransferBackward') {
        const data = stepTx.data;

        if (new BigNumber(stepTx.data.amount.amount).isLessThanOrEqualTo(0)) break;

        const ibcBalance = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (amount.denom == data.amount.denom && x.on_chain == data.chainName) {
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
            if (stepTx.own) {
              const rcptBalance = balances.find((x) => {
                const amount = parseCoins(x.amount)[0];
                if (amount.denom == newDenom && x.on_chain == data.toChain) {
                  return true;
                } else {
                  return false;
                }
              });
              let additionalFee = 0;
              if (stepTx.addFee) {
                additionalFee =
                  stepTx.feeToAdd[0].amount[gasPriceLevel] * typedstore.getters[GlobalGetterTypes.USER.getGasLimit];
              }

              if (rcptBalance) {
                const newIbcAmount =
                  parseInt(parseCoins(rcptBalance.amount)[0].amount) + parseInt(data.amount.amount) + additionalFee;
                rcptBalance.amount = newIbcAmount + parseCoins(rcptBalance.amount)[0].denom;
              } else {
                let ibcDetails: EmerisBase.IbcInfo | Record<string, never> = {};
                if (ibcBalance.ibc.path.split('/').length > 2) {
                  ibcDetails = {
                    path: ibcBalance.ibc.path.split('/').slice(2).join('/'),
                    hash: newDenom.replace('ibc/', ''),
                  };
                }
                const newIbcBalance: EmerisAPI.Balance = {
                  address: keyHashfromAddress(await getOwnAddress({ chain_name: data.toChain })),
                  base_denom: ibcBalance.base_denom,
                  verified: ibcBalance.verified,
                  on_chain: data.toChain,
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
      if (stepTx.type == 'IBCtransferForward') {
        const data = stepTx.data;

        if (new BigNumber(stepTx.data.amount.amount).isLessThanOrEqualTo(0)) break;

        const ibcBalance = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (amount.denom == data.amount.denom && x.on_chain == data.chainName) {
            return true;
          } else {
            return false;
          }
        });
        if (ibcBalance) {
          const newAmount = parseInt(parseCoins(ibcBalance.amount)[0].amount) - parseInt(data.amount.amount);
          if (newAmount >= 0) {
            ibcBalance.amount = newAmount + parseCoins(ibcBalance.amount)[0].denom;
            const primaryChannel = typedstore.getters[GlobalGetterTypes.API.getPrimaryChannel]({
              chain_name: data.toChain,
              destination_chain_name: data.chainName,
            });
            const newDenom = generateDenomHash(primaryChannel, ibcBalance.base_denom);

            if (stepTx.own) {
              const rcptBalance = balances.find((x) => {
                const amount = parseCoins(x.amount)[0];
                if (amount.denom == newDenom && x.on_chain == data.toChain) {
                  return true;
                } else {
                  return false;
                }
              });
              if (rcptBalance) {
                const newIbcAmount = parseInt(parseCoins(rcptBalance.amount)[0].amount) + parseInt(data.amount.amount);
                rcptBalance.amount = newIbcAmount + parseCoins(rcptBalance.amount)[0].denom;
              } else {
                let ibcDetails: EmerisBase.IbcInfo | Record<string, never> = {};
                if (ibcBalance.ibc.path?.split('/').length > 2) {
                  ibcDetails = { path: 'transfer/' + data.through, hash: newDenom.replace('ibc/', '') };
                }
                const newIbcBalance: EmerisAPI.Balance = {
                  address: keyHashfromAddress(await getOwnAddress({ chain_name: data.toChain })),
                  base_denom: ibcBalance.base_denom,
                  verified: ibcBalance.verified,
                  on_chain: data.toChain,
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
        const chain = typedstore.getters[GlobalGetterTypes.API.getChain]({ chain_name: data.toChain });
        const chainFeeDenom = chain.denoms.find((x) => x.fee_token)?.name;

        const ibcFeeBalance = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (amount.denom == chainFeeDenom && x.on_chain == data.toChain) {
            return true;
          } else {
            return false;
          }
        });
        if (!ibcFeeBalance || parseInt(parseCoins(ibcFeeBalance.amount)[0].amount) == 0) {
          feeWarning.feeWarning = false;
          feeWarning.ibcWarning = true;
          feeWarning.ibcDetails.chain_name = typedstore.getters[GlobalGetterTypes.API.getDisplayChain]({
            name: data.toChain,
          });
          feeWarning.ibcDetails.ibcDenom = await getDisplayName(ibcBalance.base_denom);
          feeWarning.ibcDetails.denom = typedstore.getters[GlobalGetterTypes.API.getChain]({
            chain_name: data.toChain,
          }).denoms.find((x) => x.fee_token == true).display_name;
        }
      }
      if (stepTx.type == 'swap') {
        const data = stepTx.data[0];
        const balance = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (amount.denom == data.from.denom && x.on_chain == data.chainName) {
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
        // const swapFeeRate = typedstore.getters['tendermint.liquidity.v1beta1/getParams']().params.swap_fee_rate;
        const swapFee = {
          // amount: Math.ceil((parseInt(data.from.amount) * parseFloat(swapFeeRate)) / 2) + '',
          amount: '0',
          denom: data.from.denom,
        };
        const newSwapAmount = parseInt(parseCoins(balance.amount)[0].amount) - parseInt(swapFee.amount);
        if (newSwapAmount >= 0) {
          balance.amount = newSwapAmount + parseCoins(balance.amount)[0].denom;

          const toBalance = balances.find((x) => {
            const amount = parseCoins(x.amount)[0];
            return amount.denom == data.to.denom && x.on_chain == data.chainName;
          });

          if (toBalance) {
            const newToAmount = parseInt(parseCoins(toBalance.amount)[0].amount) + parseInt(data.to.amount);
            toBalance.amount = newToAmount + data.to.denom;
          } else {
            const newSwapBalance = {
              address: balance.address,
              amount: data.to.amount + data.to.denom,
              base_denom: await getBaseDenom(data.to.denom, data.chainName),
              ibc: {
                path: '',
                hash: data.to.denom.replace('ibc/', ''),
              },
              on_chain: data.chainName,
              verified: true,
            };
            balances.push(newSwapBalance);
          }
        } else {
          feeWarning.feeWarning = false;
          feeWarning.missingFees.push({
            amount: '' + swapFee.amount,
            chain_name: data.chainName,
            denom: swapFee.denom,
          });
        }
      }
      if (stepTx.type == 'transfer') {
        const data = stepTx.data;
        if (data.toAddress != (await getOwnAddress({ chain_name: data.chainName }))) {
          const balance = balances.find((x) => {
            const amount = parseCoins(x.amount)[0];
            if (amount.denom == data.amount.denom && x.on_chain == data.chainName) {
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
      if (stepTx.type == 'withdrawLiquidity') {
        const data = stepTx.data;

        const balance = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (amount.denom == data.poolCoin.denom && x.on_chain == data.chainName) {
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
      if (stepTx.type == 'stake') {
        const data = stepTx.data;

        const balance = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (amount.denom == data[0].amount.denom && x.on_chain == data[0].chainName) {
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
  verifiedDenoms: EmerisAPI.VerifiedDenoms,
): Promise<boolean> {
  const typedstore = useStore() as RootStoreTyped;
  let verifyTrace;

  try {
    verifyTrace =
      typedstore.getters[GlobalGetterTypes.API.getVerifyTrace]({
        chain_name: dexChain,
        hash: denom.split('/')[1],
      }) ??
      (await typedstore.dispatch(
        GlobalActionTypes.API.GET_VERIFY_TRACE,
        { subscribe: false, params: { chain_name: dexChain, hash: denom.split('/')[1] } },
        { root: true },
      ));
  } catch (e) {
    return false;
  }
  if (!verifyTrace || !verifyTrace.verified) {
    return false;
  }
  if (verifyTrace.path.split('/').length > 2) {
    return false;
  }

  if (!verifiedDenoms.find((item) => item.name === verifyTrace.base_denom)) {
    return false;
  }

  const primaryChannel = typedstore.getters[GlobalGetterTypes.API.getPrimaryChannel]({
    chain_name: dexChain,
    destination_chain_name: verifyTrace.trace[0].counterparty_name,
  });

  if (primaryChannel == getChannel(verifyTrace.path, 0)) {
    return true;
  }

  return false;
}
