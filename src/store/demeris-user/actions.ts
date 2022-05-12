/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines */
import { Secp256k1HdWallet } from '@cosmjs/amino';
import { stringToPath } from '@cosmjs/crypto';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { EmerisAPI, EmerisFees } from '@emeris/types';
import { ActionTree, DispatchOptions } from 'vuex';

import { SupportedWallet } from '@/features/extension/types';
import { walletActionHandler } from '@/features/extension/WalletActionHandler';
import { GlobalActionTypes, GlobalGetterTypes, RootState, RootStoreTyped } from '@/store';
import { SessionParams } from '@/types/user';
import { Namespaced } from '@/types/util';
import { config as analyticsConfig, event } from '@/utils/analytics';
import { fromHexString, hashObject, keyHashfromAddress } from '@/utils/basic';
import EmerisError from '@/utils/EmerisError';
import { featureRunning } from '@/utils/FeatureManager';
import { addChain } from '@/utils/keplr';

import { USERStore } from '.';
import { ActionTypes } from './action-types';
import { demoAccount } from './demo-account';
import { MutationTypes } from './mutation-types';
import { USERState } from './state';

type walletActions = 'common/wallet/signIn';
type walletDispatch = {
  dispatch<K extends walletActions>(key: K, payload?: { keplr: OfflineSigner }, options?: DispatchOptions): void;
};
type UserActionContext = {
  dispatch: Pick<USERStore<USERState>, 'dispatch'>['dispatch'] &
    Pick<RootStoreTyped, 'dispatch'>['dispatch'] &
    walletDispatch['dispatch'];
  commit: Pick<USERStore<USERState>, 'commit'>['commit'];
  state: USERState;
  getters: Pick<USERStore<USERState>, 'getters'>['getters'];
  rootState: RootState;
  rootGetters: Pick<RootStoreTyped, 'getters'>['getters'];
};
export type Subscription<K extends keyof Actions> = {
  action: K;
  payload?: Parameters<Actions[K]>[1];
};
export type Subscriptions = Subscription<keyof Actions>;
export interface Actions {
  [ActionTypes.REDEEM_GET_HAS_SEEN](context: UserActionContext): Promise<boolean>;
  [ActionTypes.REDEEM_SET_HAS_SEEN](context: UserActionContext, seen: boolean): Promise<void>;
  [ActionTypes.BALANCES_LOADED](context: UserActionContext): Promise<void>;
  [ActionTypes.STAKING_BALANCES_LOADED](context: UserActionContext): Promise<void>;
  [ActionTypes.PRICES_LOADED](context: UserActionContext): Promise<void>;
  [ActionTypes.SET_SESSION_DATA](context: UserActionContext, { data: UserData }: SessionParams): Promise<void>;
  [ActionTypes.LOAD_SESSION_DATA](
    context: UserActionContext,
    { walletName, isDemoAccount }: { walletName: string; isDemoAccount: boolean },
  ): Promise<void>;
  [ActionTypes.SIGN_IN](context: UserActionContext): Promise<boolean>;
  [ActionTypes.SIGN_IN_NEW](context: UserActionContext, data: { walletType: SupportedWallet }): Promise<boolean>;
  [ActionTypes.SIGN_IN_WITH_WATCHER](context: UserActionContext): Promise<boolean>;
  // Internal module actions
  [ActionTypes.SET_GAS_LIMIT](context: UserActionContext, { gasLimit }: { gasLimit: number }): Promise<void>;
  [ActionTypes.SIGN_OUT](context: UserActionContext): Promise<void>;
  [ActionTypes.RESET_STATE](context: UserActionContext): void;
  [ActionTypes.UNSUBSCRIBE](context: UserActionContext, subscription: Subscriptions): void;
  [ActionTypes.STORE_UPDATE](context: UserActionContext): void;
}

export type GlobalActions = Namespaced<Actions, 'demerisUSER'>;

export const actions: ActionTree<USERState, RootState> & Actions = {
  async [ActionTypes.REDEEM_GET_HAS_SEEN]() {
    const redeem = window.localStorage.getItem('redeem');
    return redeem === 'true' ? true : false;
  },
  async [ActionTypes.REDEEM_SET_HAS_SEEN]({}, seen) {
    seen ? window.localStorage.setItem('redeem', 'true') : window.localStorage.setItem('redeem', 'false');
  },
  async [ActionTypes.PRICES_LOADED]({ commit }) {
    commit(MutationTypes.SET_PRICES_FIRST_LOAD, false);
  },
  async [ActionTypes.BALANCES_LOADED]({ commit }) {
    commit(MutationTypes.SET_BALANCES_FIRST_LOAD, false);
  },
  async [ActionTypes.STAKING_BALANCES_LOADED]({ commit }) {
    commit(MutationTypes.SET_STAKING_BALANCES_FIRST_LOAD, false);
  },
  async [ActionTypes.LOAD_SESSION_DATA]({ commit }, { walletName, isDemoAccount = false }) {
    const data = window.localStorage.getItem(walletName);
    if (data) {
      const newData = { ...JSON.parse(data), updateDT: Date.now() };
      window.localStorage.setItem(walletName, JSON.stringify(newData));
      commit(MutationTypes.SET_SESSION_DATA, newData);
    } else {
      const newData = {
        allowCustomSlippage: false,
        viewUnverified: false,
        viewLPAssetPools: false,
        gasPriceLevel: EmerisFees.GasPriceLevel.Average,
        hasSeenRedeem: false,
        slippagePerc: 0.1,
        updateDT: Date.now(),
        isDemoAccount,
      };
      window.localStorage.setItem(walletName, JSON.stringify(newData));
      commit(MutationTypes.SET_SESSION_DATA, newData);
    }
    commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.SET_SESSION_DATA, payload: { data: null } });
  },
  async [ActionTypes.SET_SESSION_DATA]({ commit, getters, state }, { data }: SessionParams) {
    if (data) {
      window.localStorage.setItem(
        getters['getKeplrAccountName'],
        JSON.stringify({ ...state._Session, ...data, updateDT: Date.now() }),
      );
      commit(MutationTypes.SET_SESSION_DATA, { ...data, updateDT: Date.now() });
    } else {
      window.localStorage.setItem(
        getters['getKeplrAccountName'],
        JSON.stringify({ ...state._Session, updateDT: Date.now() }),
      );
      commit(MutationTypes.SET_SESSION_DATA, { updateDT: Date.now() });
    }
  },
  async [ActionTypes.SIGN_IN]({ commit, dispatch, rootGetters }) {
    try {
      await dispatch(ActionTypes.SIGN_OUT);
      // Prior to signing in with a new account we must SIGN_OUT to remove all account related data from the store
      // i.e. balances/staking_balances/subscriptions to those endpoints etc.
      // We could call global reset_state but then we'd have to reload all non user-specific data (pools, chains, denoms etc.)
      commit(MutationTypes.SET_BALANCES_FIRST_LOAD, true);
      commit(MutationTypes.SET_STAKING_BALANCES_FIRST_LOAD, true);
      commit(MutationTypes.SET_PRICES_FIRST_LOAD, true);
      // All *_FIRST_LOAD booleans indicate that the app is in the process of doing an initial load of the items in question
      // This status is used for displaying skeleton loaders appropriately

      const isCypress = !!window['Cypress'];
      const chains =
        rootGetters[GlobalGetterTypes.API.getChains] ??
        (await dispatch(
          GlobalActionTypes.API.GET_CHAINS,
          {
            subscribe: featureRunning('USE_NEW_CHAINS_API'),
          },
          { root: true },
        ));
      if (!featureRunning('USE_NEW_CHAINS_API')) {
        for (const chain in chains) {
          if (!chains[chain].node_info)
            chains[chain] = await dispatch(
              GlobalActionTypes.API.GET_CHAIN,
              {
                subscribe: true,
                params: {
                  chain_name: chain,
                },
              },
              { root: true },
            );
        }
      }
      // The only case where the getChains getter would not return full data for a chain
      // is if the app hasn't finished initializing yet (i.e. GET_CHAIN actions have been dispatched but not returned yet)
      // This happens with the autoLogin feature or if the user clicks on connect_wallet as soon as it appears
      // Since their async load has already been initiated this does not make new requests but makes use of the _InProgress
      // caching and just waits for the previous ones to be resolved (hence it's a threading...or lack thereof issue since
      // no actual requests are involved)

      window.keplr.defaultOptions = {
        sign: { preferNoSetFee: true, preferNoSetMemo: true, disableBalanceCheck: true },
      };
      if (!isCypress) {
        for (const chain in chains) {
          await addChain(chain);
        }

        await window.keplr['enable'](
          (Object.values(chains) as Array<EmerisAPI.Chain>).map((x) => x.node_info.chain_id),
        );
      }
      const paths = new Set();
      const toQuery = [];
      for (const chain_name in chains) {
        const chain = chains[chain_name];
        if (paths.has(chain.derivation_path)) {
          continue;
        }
        paths.add(chain.derivation_path);
        toQuery.push(chain);
      }
      const dexchain = rootGetters[GlobalGetterTypes.API.getChain]({
        chain_name: rootGetters[GlobalGetterTypes.API.getDexChain],
      });
      let keyData;
      let signer;
      if (!isCypress) {
        await window.keplr.enable(dexchain.node_info.chain_id);
        keyData = await window.keplr.getKey(dexchain.node_info.chain_id);
      } else {
        signer = await Secp256k1HdWallet.fromMnemonic(import.meta.env.VITE_EMERIS_MNEMONIC as string, {
          prefix: dexchain.node_info.bech32_config.main_prefix,
          hdPaths: [stringToPath(dexchain.derivation_path)],
        });
        const [account] = await signer.getAccounts();
        keyData = {
          name: 'Cypress Test',
          algo: account.algo,
          pubKey: account.pubkey,
          bech32Address: account.address,
          isNanoLedger: false,
          address: fromHexString(keyHashfromAddress(account.address)),
        };
      }
      const encryptedUID = hashObject(keyHashfromAddress(keyData.bech32Address));
      commit(MutationTypes.SET_CORRELATION_ID, encryptedUID);
      commit(MutationTypes.SET_KEPLR, keyData);
      event('sign_in', { event_label: 'Sign in with Keplr', event_category: 'authentication' });
      analyticsConfig({ user_id: encryptedUID });

      await dispatch(ActionTypes.LOAD_SESSION_DATA, { walletName: keyData.name, isDemoAccount: false });
      for (const chain of toQuery) {
        if (!isCypress) {
          await window.keplr.enable(chain.node_info.chain_id);
          const otherKey = await window.keplr.getKey(chain.node_info.chain_id);
          commit(MutationTypes.ADD_KEPLR_KEYHASH, keyHashfromAddress(otherKey.bech32Address));
        } else {
          const signer = await Secp256k1HdWallet.fromMnemonic(import.meta.env.VITE_EMERIS_MNEMONIC as string, {
            prefix: chain.node_info.bech32_config.main_prefix,
            hdPaths: [stringToPath(chain.derivation_path)],
          });
          const [account] = await signer.getAccounts();
          const otherKey = {
            name: 'Cypress Test',
            algo: account.algo,
            pubKey: account.pubkey,
            bech32Address: account.address,
            isNanoLedger: false,
            address: fromHexString(keyHashfromAddress(account.address)),
          };
          commit(MutationTypes.ADD_KEPLR_KEYHASH, keyHashfromAddress(otherKey.bech32Address));
        }
      }

      !isCypress
        ? dispatch('common/wallet/signIn', { keplr: await window.getOfflineSigner('cosmoshub-4') }, { root: true })
        : dispatch('common/wallet/signIn', { keplr: signer }, { root: true });

      dispatch(GlobalActionTypes.API.GET_ALL_UNBONDING_DELEGATIONS, undefined, { root: true });
      dispatch(GlobalActionTypes.API.GET_ALL_BALANCES, undefined, { root: true });
      dispatch(GlobalActionTypes.API.GET_ALL_STAKING_BALANCES, undefined, { root: true });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
  async [ActionTypes.SIGN_IN_NEW]({ commit, dispatch, rootGetters }, { walletType }: { walletType: SupportedWallet }) {
    try {
      if (!featureRunning('USE_EMERIS_EXTENSION'))
        throw new Error('Should not be called with USE_EMERIS_EXTENSION turned off');

      await walletActionHandler.connect(walletType);

      await dispatch(ActionTypes.SIGN_OUT);
      // Prior to signing in with a new account we must SIGN_OUT to remove all account related data from the store
      // i.e. balances/staking_balances/subscriptions to those endpoints etc.
      // We could call global reset_state but then we'd have to reload all non user-specific data (pools, chains, denoms etc.)
      commit(MutationTypes.SET_BALANCES_FIRST_LOAD, true);
      commit(MutationTypes.SET_STAKING_BALANCES_FIRST_LOAD, true);
      commit(MutationTypes.SET_PRICES_FIRST_LOAD, true);
      // All *_FIRST_LOAD booleans indicate that the app is in the process of doing an initial load of the items in question
      // This status is used for displaying skeleton loaders appropriately

      const isCypress = !!window['Cypress'];
      const chains =
        rootGetters[GlobalGetterTypes.API.getChains] ??
        (await dispatch(
          GlobalActionTypes.API.GET_CHAINS,
          {
            subscribe: false,
          },
          { root: true },
        ));
      for (const chain in chains) {
        if (!chains[chain].node_info)
          chains[chain] = await dispatch(
            GlobalActionTypes.API.GET_CHAIN,
            {
              subscribe: true,
              params: {
                chain_name: chain,
              },
            },
            { root: true },
          );
      }
      // The only case where the getChains getter would not return full data for a chain
      // is if the app hasn't finished initializing yet (i.e. GET_CHAIN actions have been dispatched but not returned yet)
      // This happens with the autoLogin feature or if the user clicks on connect_wallet as soon as it appears
      // Since their async load has already been initiated this does not make new requests but makes use of the _InProgress
      // caching and just waits for the previous ones to be resolved (hence it's a threading...or lack thereof issue since
      // no actual requests are involved)
      if (walletActionHandler.isAvailable(SupportedWallet.KEPLR))
        window.keplr.defaultOptions = {
          sign: { preferNoSetFee: true, preferNoSetMemo: true, disableBalanceCheck: true },
        };
      if (!isCypress) {
        // for (const chain in chains) {
        //   // TODO : implement addChain for Emeris extension and apply as well
        // }
        const chainIds = (Object.values(chains) as Array<EmerisAPI.Chain>).map((x) => x.node_info.chain_id);
        await walletActionHandler.enable(chainIds);
      }
      const dexchain = rootGetters[GlobalGetterTypes.API.getChain]({
        chain_name: rootGetters[GlobalGetterTypes.API.getDexChain],
      });
      let keyData;
      let signer;
      if (!isCypress) {
        keyData = await walletActionHandler.getAccount(dexchain.node_info.chain_id);
      } else {
        signer = await Secp256k1HdWallet.fromMnemonic(import.meta.env.VITE_EMERIS_MNEMONIC as string, {
          prefix: dexchain.node_info.bech32_config.main_prefix,
          hdPaths: [stringToPath(dexchain.derivation_path)],
        });
        const [account] = await signer.getAccounts();
        keyData = {
          name: 'Cypress Test',
          algo: account.algo,
          pubKey: account.pubkey,
          bech32Address: account.address,
          isNanoLedger: false,
          address: fromHexString(keyHashfromAddress(account.address)),
        };
      }
      const encryptedUID = hashObject(keyHashfromAddress(keyData.bech32Address));
      commit(MutationTypes.SET_CORRELATION_ID, encryptedUID);
      commit(MutationTypes.SET_KEPLR, keyData);
      event('sign_in', { event_label: 'Sign in with Keplr', event_category: 'authentication' });
      analyticsConfig({ user_id: encryptedUID });

      await dispatch(ActionTypes.LOAD_SESSION_DATA, { walletName: keyData.name, isDemoAccount: false });
      for (const chain of Object.values(chains)) {
        if (!isCypress) {
          try {
            const otherKey = await walletActionHandler.getAccount(chain.node_info.chain_id);
            commit(MutationTypes.ADD_KEPLR_KEYHASH, keyHashfromAddress(otherKey.bech32Address));
          } catch (err) {
            console.error(err); // EmerisSigner has a weird list of networks hardcoded so it fails for some, we need to change that
          }
        } else {
          const signer = await Secp256k1HdWallet.fromMnemonic(import.meta.env.VITE_EMERIS_MNEMONIC as string, {
            prefix: chain.node_info.bech32_config.main_prefix,
            hdPaths: [stringToPath(chain.derivation_path)],
          });
          const [account] = await signer.getAccounts();
          const otherKey = {
            name: 'Cypress Test',
            algo: account.algo,
            pubKey: account.pubkey,
            bech32Address: account.address,
            isNanoLedger: false,
            address: fromHexString(keyHashfromAddress(account.address)),
          };
          commit(MutationTypes.ADD_KEPLR_KEYHASH, keyHashfromAddress(otherKey.bech32Address));
        }
      }

      !isCypress
        ? dispatch('common/wallet/signIn', { keplr: await window.getOfflineSigner('cosmoshub-4') }, { root: true })
        : dispatch('common/wallet/signIn', { keplr: signer }, { root: true });

      dispatch(GlobalActionTypes.API.GET_ALL_UNBONDING_DELEGATIONS, undefined, { root: true });
      dispatch(GlobalActionTypes.API.GET_ALL_BALANCES, undefined, { root: true });
      dispatch(GlobalActionTypes.API.GET_ALL_STAKING_BALANCES, undefined, { root: true });

      walletActionHandler.setLastSession({ timestamp: Date.now(), wallet: walletType });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
  async [ActionTypes.SIGN_IN_WITH_WATCHER]({ commit, dispatch }) {
    try {
      await dispatch(ActionTypes.SIGN_OUT);
      commit(MutationTypes.SET_BALANCES_FIRST_LOAD, true);
      commit(MutationTypes.SET_STAKING_BALANCES_FIRST_LOAD, true);
      commit(MutationTypes.SET_PRICES_FIRST_LOAD, true);
      const key = demoAccount;
      commit(MutationTypes.SET_KEPLR, { ...key });
      for (const hash of key.keyHashes) {
        commit(MutationTypes.ADD_KEPLR_KEYHASH, hash);
      }
      await dispatch(ActionTypes.LOAD_SESSION_DATA, { walletName: key.name, isDemoAccount: true });
      dispatch('common/wallet/signIn', { keplr: null }, { root: true });
      commit(MutationTypes.SET_CORRELATION_ID, keyHashfromAddress(key.bech32Address));
      event('sign_in_demo', { event_label: 'Sign in with Demo Account', event_category: 'authentication' });
      analyticsConfig({ user_id: keyHashfromAddress(key.bech32Address) });
      dispatch(GlobalActionTypes.API.GET_ALL_UNBONDING_DELEGATIONS, undefined, { root: true });
      dispatch(GlobalActionTypes.API.GET_ALL_BALANCES, undefined, { root: true });
      dispatch(GlobalActionTypes.API.GET_ALL_STAKING_BALANCES, undefined, { root: true });
      return true;
    } catch (e) {
      return false;
    }
  },
  async [ActionTypes.SET_GAS_LIMIT]({ commit }, { gasLimit }: { gasLimit: number }) {
    try {
      commit(MutationTypes.SET_GAS_LIMIT, { value: gasLimit });
    } catch (e) {
      throw new EmerisError('Demeris:SetGasLimit', 'Could not set Gas Limit');
    }
  },
  [ActionTypes.RESET_STATE]({ commit }) {
    commit(MutationTypes.RESET_STATE);
  },
  async [ActionTypes.SIGN_OUT]({ state, commit, dispatch }) {
    await dispatch(GlobalActionTypes.API.SIGN_OUT, state.keplr?.keyHashes ?? [], { root: true });
    event('sign_out', { event_label: 'Signed out', event_category: 'authentication' });
    commit(MutationTypes.SIGN_OUT);
  },
  [ActionTypes.STORE_UPDATE]({ state, dispatch }) {
    state._Subscriptions.forEach(async (subscription_json) => {
      const subscription = JSON.parse(subscription_json);
      try {
        await dispatch(subscription.action, subscription.payload);
      } catch (e) {
        console.error(e);
      }
    });
  },
  [ActionTypes.UNSUBSCRIBE]({ commit }, subscription) {
    commit(MutationTypes.UNSUBSCRIBE, subscription);
  },
};
