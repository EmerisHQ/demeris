import { EmerisDEXInfo } from '@emeris/types';

const protocolChainMap: Record<string, string> = {
  [EmerisDEXInfo.DEX.Osmosis]: 'osmosis',
  [EmerisDEXInfo.DEX.Gravity]: 'cosmos-hub',
  [EmerisDEXInfo.DEX.Crescent]: 'crescent',
};

export const formatProtocolName = (protocol: string) => {
  const protocols = {
    osmosis: 'Osmosis',
    gravity: 'Gravity Dex',
    crescent: 'Crescent',
  };
  return protocols[protocol] ?? 'Unknown';
};

export const getProtocolFromChain = (chainName: string) => {
  for (const [protocol, chain] of Object.entries(protocolChainMap)) {
    if (chain === chainName) return protocol;
  }
};

export const getChainFromProtocol = (protocol: string) => {
  return protocolChainMap[protocol];
};

export const activeSupportedProtocols = [EmerisDEXInfo.DEX.Osmosis];
export const activeSupportedProtocolChains = activeSupportedProtocols.map(getChainFromProtocol);
