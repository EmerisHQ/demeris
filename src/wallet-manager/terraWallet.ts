import { AminoTypes } from '@cosmjs/stargate';
import { SpVuexError } from '@starport/vuex';
import {
  Coin,
  Coins,
  CreateTxOptions,
  Extension,
  Msg,
  StdFee,
  Wallet as TerraStationWallet,
} from '@terra-money/terra.js';

import { useStore } from '@/store';
import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';
import DemerisSigningClient from '@/store/demeris/demerisSigningClient';
import { ChainData } from '@/store/demeris/state';
import { keyHashfromAddress } from '@/utils/basic';

import { liquidityTypes } from '../store/demeris/liquidityTypes';
import { Wallet } from './abstractWallet';
import { SignedTerraTransaction, TerraTransaction } from './types';

const aminoTypes = new AminoTypes({ additions: liquidityTypes, prefix: null });
export class TerraWallet extends Wallet {
  protected _currentChain: string;
  protected _chainList: string[] = [];
  protected _keyhashes: string[] = [];
  protected _extension: Extension;
  protected _address: string;
  constructor() {
    super('terrastation');
    this._extension = new Extension();
  }
  async connect(chain_list: string[]): Promise<boolean> {
    this._chainList = chain_list;
    if (this._extension.isAvailable) {
      let resolver;
      const result: Promise<boolean> = new Promise((resolve) => {
        resolver = resolve;
      });
      this._extension.on('onConnect', (w) => {
        this._keyhashes.push(keyHashfromAddress(w.address));
        this._address = w.address;
        resolver(true);
      });
      this._extension.connect();

      return await result;
    } else {
      return false;
    }
  }
  disconnect(): void {
    this.emit('disconnected', 'terrastation');
  }

  getAddress(): string {
    return this._address;
  }
  getKeyHashes(): string[] {
    return this._keyhashes;
  }
  async requestSignature(transaction: TerraTransaction): Promise<SignedTerraTransaction> {
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
      const account = this._address;

      const numbers = await store.dispatch(GlobalDemerisActionTypes.GET_NUMBERS_CHAIN, {
        subscribe: false,
        params: {
          address: keyHashfromAddress(account),
          chain_name: transaction.chain_name,
        },
      });
      console.log(transaction.msgs.map((msg) => aminoTypes.toAmino(msg)));
      const msgs = transaction.msgs
        .map((msg) => aminoTypes.toAmino(msg))
        .map((aminoMsg) => Msg.fromData(aminoMsg as Msg.Data));
      const options: CreateTxOptions = {
        msgs: msgs,
        fee: new StdFee(
          parseInt(transaction.fee.gas),
          Coins.fromData(transaction.fee.amount.map((coin) => Coin.fromData(coin).toData())),
        ),
        memo: transaction.memo,
        account_number: parseInt(numbers.account_number),
        sequence: parseInt(numbers.sequence_number),
      };
      const tx = '' + this._extension.sign(options);

      const tx_data = Buffer.from(tx).toString('base64');
      //console.log(Buffer.from(tx).toString('hex'));
      return { tx: tx_data, chain_name: transaction.chain_name, address: account };
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
