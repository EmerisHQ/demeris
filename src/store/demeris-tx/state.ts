import * as API from '@/types/api';

export type ChainMeta = {
  verifiedTraces?: Record<string, API.VerifyTrace>;
  primaryChannels?: Record<string, API.PrimaryChannel>;
  relayerBalance?: API.RelayerBalance;
  status?: boolean;
};
export type ChainData = API.Chain & ChainMeta;

export type State = {
  _Subscriptions: Set<string>;
};
export function getDefaultState(): State {
  return {
    _Subscriptions: new Set(),
  };
}
