type DenomColor = {
  hex: string;
  rgb: string;
};

type DenomExtraConfig = {
  defaultChainName;
  colors: {
    primary: DenomColor;
    secondary: DenomColor;
  };
};

export const denomsExtraConfig: Record<string, DenomExtraConfig> = {
  uatom: {
    defaultChainName: 'cosmos-hub',
    colors: {
      primary: {
        hex: '#A4FAFF',
        rgb: '164, 250, 255',
      },
      secondary: {
        hex: '#E88CFE',
        rgb: '232, 140, 254',
      },
    },
  },
  uakt: {
    defaultChainName: 'akash',
    colors: {
      primary: {
        hex: '#EC4C4C',
        rgb: '236, 76, 76',
      },
      secondary: {
        hex: '#FB8686',
        rgb: '251, 134, 134',
      },
    },
  },
  ucro: {
    defaultChainName: 'crypto.com',
    colors: {
      primary: {
        hex: '#5044E7',
        rgb: '80, 68, 231',
      },
      secondary: {
        hex: '#5070FF',
        rgb: '80, 112, 255',
      },
    },
  },
};
