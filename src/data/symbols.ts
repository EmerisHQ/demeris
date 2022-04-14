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

const Terra: SymbolConfig = {
  colors: {
    primary: '#253D77',
    secondary: '#344D8C',
    tertiary: '#FFE14B',
  },
};

const Ixo: SymbolConfig = {
  colors: {
    primary: '#233F88',
    secondary: '#739FE0',
  },
};

const EMoney: SymbolConfig = {
  colors: {
    primary: '#023B40',
    secondary: '#0C919D',
  },
};

const Microtick: SymbolConfig = {
  colors: {
    primary: '#BAE941',
    secondary: '#F3FFE4',
  },
};

const Starname: SymbolConfig = {
  colors: {
    primary: '#FDCC03',
    secondary: '#8FBC9D',
    tertiary: '#00AAFB',
  },
};

const Sifchain: SymbolConfig = {
  colors: {
    primary: '#F9C82A',
    secondary: '#FFF824',
  },
};

const Injective: SymbolConfig = {
  colors: {
    primary: '#1C1E25',
    secondary: '#3D477B',
    tertiary: '#05ACE8',
  },
};

const GravityDex: SymbolConfig = {
  colors: {
    primary: '#E88CFE',
    secondary: '#A4FAFF',
  },
};

const Juno: SymbolConfig = {
  colors: {
    primary: '#FD675C',
    secondary: '#FFBDBA',
  },
};

const LikeCoin: SymbolConfig = {
  colors: {
    primary: '#286A7A',
    secondary: '#60D1E2',
  },
};

const BitCanna: SymbolConfig = {
  colors: {
    primary: '#46DD94',
    secondary: '#77EFE9',
  },
};

const Crescent: SymbolConfig = {
  colors: {
    primary: '#FFC780',
    secondary: '#9B504B',
  },
};

const chains: Record<string, SymbolConfig> = {
  'cosmos-hub': Cosmos,
  akash: Akash,
  'crypto-org': CryptoOrg,
  persistence: Persistence,
  sentinel: Sentinel,
  regen: Regen,
  terra: Terra,
  starname: Starname,
  microtick: Microtick,
  ixo: Ixo,
  emoney: EMoney,
  sifchain: Sifchain,
  injective: Injective,
  juno: Juno,
  likecoin: LikeCoin,
  bitcanna: BitCanna,
  crescent: Crescent,
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
  uiov: Starname,
  utick: Microtick,
  uixo: Ixo,
  ungm: EMoney,
  uluna: Terra,
  uinj: Injective,
  rowan: Sifchain,
  ujuno: Juno,
  nanolike: LikeCoin,
  ubcna: BitCanna,
  ucre: Crescent,
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
