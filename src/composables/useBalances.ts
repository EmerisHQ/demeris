import { QueryClient, setupIbcExtension } from '@cosmjs/stargate';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';

import { chainAddressfromKeyhash } from '../utils/basic';

export default function useBalances() {
  const traces = JSON.parse(localStorage.getItem('traces') || '{}');
  const channels = JSON.parse(localStorage.getItem('channels') || '{}');
  const clients = {};

  async function getIbcClient(chainConfig) {
    if (clients[chainConfig.id]) {
      return clients[chainConfig.id];
    }
    const tmClient = await Tendermint34Client.connect(chainConfig.rpcUrl);
    const ibcClient = QueryClient.withExtensions(tmClient, setupIbcExtension);
    clients[chainConfig.id] = ibcClient;
    return ibcClient;
  }

  const safeTraces = () => {
    localStorage.setItem('traces', JSON.stringify(traces));
  };
  const safeChannels = () => {
    localStorage.setItem('channels', JSON.stringify(channels));
  };

  const getTrace = async (ibcDenom, chainConfig) => {
    if (traces[chainConfig.id] && traces[chainConfig.id][ibcDenom]) {
      return traces[chainConfig.id][ibcDenom];
    }
    const hash = ibcDenom.substring(4);
    const ibcClient = await getIbcClient(chainConfig);
    const { denomTrace } = await ibcClient.ibc.transfer.denomTrace(hash);
    // const { denom_trace } = await fetch(chainConfig.apiUrl + `/ibc/apps/transfer/v1/denom_traces/${hash}`).then((res) =>
    //     res.json(),
    // );
    traces[chainConfig.id] = traces[chainConfig.id] || {};
    traces[chainConfig.id][ibcDenom] = denomTrace;
    safeTraces();
    return denomTrace;
  };

  const chainConfigs = {
    'cosmoshub-4': {
      id: 'cosmos-hub',
      prefix: 'cosmos',
      stakingDenom: 'uatom',
      apiUrl: 'https://api.cosmos.network',
      rpcUrl: 'https://rpc.cosmos.network',
    },
    osmosis: {
      id: 'osmosis',
      prefix: 'osmo',
      stakingDenom: 'uosmo',
      apiUrl: 'https://lcd-osmosis.blockapsis.com',
      rpcUrl: 'https://rpc-osmosis.blockapsis.com',
    },
    'iov-mainnet-ibc': {
      id: 'iov',
      prefix: 'star',
      stakingDenom: 'iov',
      apiUrl: 'https://lcd-iov.keplr.app',
      rpcUrl: 'https://rpc-iov.keplr.app',
    },
    // 'akash-testnet': {
    //     prefix: 'akash',
    //     // rpcUrl: 'https://rpc.cosmos.network',
    //     apiUrl: 'https://api.akash-emeris.app.alpha.starport.cloud/'
    // }
  };
  const getChainConfig = (chainId) => {
    const chainConfig = chainConfigs[chainId];
    if (!chainConfig) throw new Error('Cant trace ibc denom as there is no config for chain' + chainId);
    return chainConfig;
  };
  const getIbcTokenChain = async (ibcDenom, chainConfig) => {
    // try {
    const trace = await getTrace(ibcDenom, chainConfig);
    const chainId = await getIbcTokenChainFromPath(trace.path, chainConfig);
    return { baseDenom: trace.baseDenom, chainId };
    // } catch (err) {
    //     console.log('failed to get ibc token chain', ibcDenom, 'on', chainConfig.id);
    //     return {};
    // }
  };
  const getIbcTokenChainFromPath = async (path, chainConfig) => {
    if (channels[chainConfig.id] && channels[chainConfig.id][path]) {
      return channels[chainConfig.id][path];
    }

    // const ibcClient = (await getChainClients(chainConfig)).ibcClient
    const splitDenomTrace = path.split('/');
    const ibcClient = await getIbcClient(chainConfig);
    const { identifiedClientState } = await ibcClient.ibc.channel.clientState(splitDenomTrace[0], splitDenomTrace[1]);
    const clientId = identifiedClientState.clientId;
    const { chainId: currentChainId } = await ibcClient.ibc.client.stateTm(clientId);
    // const { identified_client_state } = await fetch(
    //     chainConfig.apiUrl +
    //     `/ibc/core/channel/v1/channels/${splitDenomTrace[1]}/ports/${splitDenomTrace[0]}/client_state`,
    // ).then((res) => res.json());
    // if the trace is longer then 2 there is more then 1 hop so we do a recursive search
    let chainId;
    if (splitDenomTrace.length > 2) {
      chainId = await getIbcTokenChainFromPath(splitDenomTrace.slice(2).join('/'), getChainConfig(currentChainId));
    } else {
      chainId = currentChainId;
    }

    channels[chainConfig.id] = channels[chainConfig.id] || {};
    channels[chainConfig.id][path] = chainId;
    safeChannels();

    return chainId;
  };
  const getDelegations = async (address, chainConfig) => {
    try {
      const { delegation_responses } = await fetch(
        chainConfig.apiUrl + `/cosmos/staking/v1beta1/delegations/${address}`,
      ).then((res) => res.json());
      return delegation_responses.map(({ balance }) => balance);
    } catch (err) {
      return [];
    }
  };
  const getUndelegations = async (address, chainConfig) => {
    const { unbonding_responses } = await fetch(
      chainConfig.apiUrl + `/cosmos/staking/v1beta1/delegators/${address}/unbonding_delegations`,
    ).then((res) => res.json());
    return [
      ...unbonding_responses.reduce((all, { entries }) => {
        return all.concat(
          ...entries.map((entry) => ({ denom: chainConfig.stakingDenom, amount: Number(entry.balance) })),
        );
      }, []),
    ];
  };
  const getRedelegations = async (address, chainConfig) => {
    const { redelegation_responses } = await fetch(
      chainConfig.apiUrl + `/cosmos/staking/v1beta1/delegators/${address}/redelegations`,
    ).then((res) => res.json());
    return [
      ...redelegation_responses.map(({ entries }) =>
        entries.map((entry) => ({ denom: chainConfig.stakingDenom, amount: Number(entry.balance) })),
      ),
    ];
  };
  const getStakingBalances = async (address, chainConfig) => {
    const [delegations, undelegations, redelegations] = await Promise.all([
      getDelegations(address, chainConfig),
      getUndelegations(address, chainConfig),
      getRedelegations(address, chainConfig),
    ]);
    return [...delegations, ...undelegations, ...redelegations];
  };
  const aggregateBalances = (balances) => {
    const allBalances = {};
    balances.forEach(({ denom, amount }) => {
      allBalances[denom] = (allBalances[denom] || 0) + Number(amount);
    });
    return Object.entries(allBalances).map(([key, value]) => ({ denom: key, amount: value }));
  };
  const getBalances = async (keyHash) => {
    // const { pools } = await fetch(process.env.VUE_APP_EMERIS_PROD_LIQUIDITY_ENDPOINT + '/cosmos/liquidity/v1beta1/pools').then(res => res.json())
    console.time('all');
    await Promise.all(
      Object.values(chainConfigs).map(async (chainConfig) => {
        console.time(chainConfig.prefix);
        const address = chainAddressfromKeyhash(chainConfig.prefix, keyHash); // 'cosmos1ttm76wws8lct6ua09c2jz463jweelhy2c0m6r0'
        // const { client } = await getChainClients(chainConfig)
        // const balances = await client.getAllBalances(address)
        const [{ balances }, stakingBalances] = await Promise.all([
          fetch(chainConfig.apiUrl + `/cosmos/bank/v1beta1/balances/${address}`).then((res) => res.json()),
          getStakingBalances(address, chainConfig),
        ]);
        const allBalances = aggregateBalances([...stakingBalances, ...balances]);

        const ibcTraces = await Promise.all(
          allBalances
            .filter((balance) => balance.denom.startsWith('ibc/'))
            .map(async (ibcBalance) => {
              return {
                ibcDenom: ibcBalance.denom,
                ...(await getIbcTokenChain(ibcBalance.denom, chainConfig)),
              };
            }),
        );
        const resolvedBalances = allBalances.map((balance) => {
          if (balance.denom.startsWith('ibc/')) {
            // @ts-ignore
            const { chainId, baseDenom } = ibcTraces.find((trace) => trace.ibcDenom === balance.denom);
            return {
              ...balance,
              baseDenom,
              chainId,
            };
          }
          // if (balance.denom.startsWith('pool')) {
          //     const pool = pools.find(({ pool_coin_denom }) => pool_coin_denom === balance.denom)
          //     return {
          //         ...balance,
          //         pool
          //     }
          // }
          return balance;
        });
        console.log(chainConfig.prefix, resolvedBalances);
        console.timeEnd(chainConfig.prefix);
      }),
    );
    console.timeEnd('all');
  };

  return {
    getBalances,
  };
}

useBalances().getBalances('d990be2d42c20d603e6f3fbc70c594eaf4d6d322');
