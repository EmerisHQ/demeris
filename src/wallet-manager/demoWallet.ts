import { SpVuexError } from '@starport/vuex';

import { demoAccount } from '@/store/demeris/demo-account';

import { Wallet } from './abstractWallet';

export class DemoWallet extends Wallet {
  protected _currentChain: string;
  protected _chainList: string[] = [];
  protected _keyhashes: string[] = [];
  constructor() {
    super('demo');
  }
  async connect(chain_list: string[]): Promise<boolean> {
    this._chainList = chain_list;
    this._keyhashes = demoAccount.keyHashes;
    return true;
  }
  disconnect(): void {
    throw new SpVuexError('Disconnect not implemented for Demo Account');
  }
  getKeyHashes(): string[] {
    return this._keyhashes;
  }
  async requestSignature(): Promise<void> {
    throw new SpVuexError('Signing not implemented for Demo Account');
  }
  async useWithChain(): Promise<void> {
    throw new SpVuexError('Use Chain not implemented for Demo Account');
  }
}
