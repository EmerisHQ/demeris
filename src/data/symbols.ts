type SymbolConfig = {
  colors: {
    primary: string;
    secondary: string;
    tertiary?: string;
  };
};

const Cosmos: SymbolConfig = {
  colors: {
    primary: '#A4FAFF',
    secondary: '#375DF1',
    tertiary: '#E88CFE',
  },
};

const Akash: SymbolConfig = {
  colors: {
    primary: '#EC4C4C',
    secondary: '#FB8686',
  },
};

const CryptoOrg: SymbolConfig = {
  colors: {
    primary: '#5044E7',
    secondary: '#5070FF',
  },
};

const Iris: SymbolConfig = {
  colors: {
    primary: '#169DE4',
    secondary: '#7F53BF',
    tertiary: '#E1395D',
  },
};

const Osmosis: SymbolConfig = {
  colors: {
    primary: '#0002E9',
    secondary: '#FF00C7',
  },
};

const Persistence: SymbolConfig = {
  colors: {
    primary: '#1A1A1A',
    secondary: '#626262',
  },
};

const Sentinel: SymbolConfig = {
  colors: {
    primary: '#02182F',
    secondary: '#031D38',
  },
};

const Regen: SymbolConfig = {
  colors: {
    primary: '#4CE16B',
    secondary: '#87EB9C',
    tertiary: '#D7F8DD',
  },
};

const Ion: SymbolConfig = {
  colors: {
    primary: '#3F49D1',
    secondary: '#4199FD',
    tertiary: '#50CCC9',
  },
};

const GravityDex: SymbolConfig = {
  colors: {
    primary: '#E88CFE',
    secondary: '#A4FAFF',
  },
};

const chains: Record<string, SymbolConfig> = {
  'cosmos-hub': Cosmos,
  akash: Akash,
  'crypto-org': CryptoOrg,
  persistence: Persistence,
  sentinel: Sentinel,
  regen: Regen,
};

const denoms: Record<string, SymbolConfig> = {
  udvpn: Sentinel,
  uiris: Iris,
  uosmo: Osmosis,
  uxprt: Persistence,
  uakt: Akash,
  uatom: Cosmos,
  basecro: CryptoOrg,
  uregen: Regen,
  uion: Ion,
};

const protocols: Record<string, SymbolConfig> = {
  gdex: GravityDex,
  osmosis: Osmosis,
};

export default {
  ...chains,
  ...denoms,
  ...protocols,
};
