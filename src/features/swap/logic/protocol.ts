export const formatProtocolName = (protocol: string) => {
  const protocols = {
    osmosis: 'Osmosis',
    gravity: 'Gravity Dex',
    crescent: 'Crescent',
  };
  return protocols[protocol] ?? 'Unknown';
};

export const getChainFromProtocol = (protocol: string) => {
  const protocols = {
    osmosis: 'osmosis',
    gravity: 'cosmos-hub',
    crescent: 'crescent',
  };
  return protocols[protocol];
};
