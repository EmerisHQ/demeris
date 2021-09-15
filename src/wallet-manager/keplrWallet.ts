import { SpVuexError } from '@starport/vuex';

import { useStore } from '@/store';
import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';
import DemerisSigningClient from '@/store/demeris/demerisSigningClient';
import { ChainData } from '@/store/demeris/state';
import { keyHashfromAddress } from '@/utils/basic';

import { Wallet } from './abstractWallet';
import { KeplrTransaction, SignedKeplrTransaction } from './types';

export class KeplrWallet extends Wallet {
  protected _currentChain: string;
  protected _chainList: string[] = [];
  protected _keyhashes: string[] = [];
  constructor() {
    super('keplr');
  }
  async connect(chain_list: string[]): Promise<boolean> {
    this._chainList = chain_list;
    if (window.keplr) {
      for (const chain_id of this._chainList) {
        try {
          await window.keplr.enable(chain_id);
          const key = await window.keplr.getKey(chain_id);
          this._keyhashes.push(keyHashfromAddress(key.bech32Address));
        } catch (e) {
          console.error(e);
          console.log('Could not enable chain: ' + chain_id);
        }
      }
      window.addEventListener('keplr_keystorechange', async () => {
        this.emit('keystore_changed');
      });
      return true;
    } else {
      return false;
    }
  }
  disconnect(): void {
    this.emit('disconnected', 'keplr');
  }
  getKeyHashes(): string[] {
    return this._keyhashes;
  }
  async requestSignature(transaction: KeplrTransaction): Promise<SignedKeplrTransaction> {
    const store = useStore();
    try {
      let chain = store.getters['demeris/getChain']({
        chain_name: transaction.chain_name,
      }) as ChainData;
      if (!chain || !chain.node_info) {
        chain = await store.dispatch(GlobalDemerisActionTypes.GET_CHAIN, {
          subscribe: true,
          params: {
            chain_name: transaction.chain_name,
          },
        });
      }

      await window.keplr.enable(chain.node_info.chain_id);
      const offlineSigner = await window.getOfflineSigner(chain.node_info.chain_id);
      const [account] = await offlineSigner.getAccounts();

      const client = new DemerisSigningClient(undefined, offlineSigner, { registry: transaction.registry });

      const numbers = await store.dispatch(GlobalDemerisActionTypes.GET_NUMBERS_CHAIN, {
        subscribe: false,
        params: {
          address: keyHashfromAddress(account.address),
          chain_name: transaction.chain_name,
        },
      });

      const signerData = numbers;
      const cosmjsSignerData = {
        chainId: chain.node_info.chain_id,
        accountNumber: parseInt(signerData.account_number),
        sequence: parseInt(signerData.sequence_number),
      };
      const tx = await (client as DemerisSigningClient).signWMeta(
        account.address,
        transaction.msgs,
        transaction.fee,
        transaction.memo,
        cosmjsSignerData,
      );

      const tx_data = Buffer.from(tx).toString('base64');
      //console.log(Buffer.from(tx).toString('hex'));
      return { tx: tx_data, chain_name: transaction.chain_name, address: account.address };
    } catch (e) {
      console.error(e);
      throw new SpVuexError('Demeris:SignWithKeplr', 'Could not sign TX.');
    }
  }
  async useWithChain(chain_id): Promise<boolean> {
    try {
      await window.keplr.enable(chain_id);
      this._currentChain = chain_id;
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
