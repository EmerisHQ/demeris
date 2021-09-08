export type WalletType = 'Keplr' | 'Metamask' | 'Terrastation';
export type Account = {
  address: string;
  balanceKey: string;
  chainName: string;
  signingWallets: WalletType[];
};
export type State = {
  accounts: Account[];
  wallets?: Record<WalletType, boolean>;
};
export function getDefaultState(): State {
  return {
    accounts: [],
  };
}
