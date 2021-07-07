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
    secondary: '#9EB0F7',
    tertiary: '#E88CFE',
  },
};

const Akash: SymbolConfig = {
  colors: {
    primary: '#EC4C4C',
    secondary: '#FB8686',
  },
};

const CryptoCom: SymbolConfig = {
  colors: {
    primary: '#5044E7',
    secondary: '#5070FF',
  },
};

const chains: Record<string, SymbolConfig> = {
  'cosmos-hub': Cosmos,
  akash: Akash,
  'crypto.com': CryptoCom,
};

const denoms: Record<string, SymbolConfig> = {
  uatom: Cosmos,
  uakt: Akash,
  ucro: CryptoCom,
};

// const protocols: Record<string, SymbolConfig> = {
// 	'gravity': {},
// 	'osmosis': {},
// }

export default {
  ...chains,
  ...denoms,
};
