import { StdFee } from '@cosmjs/amino';
import { SigningStargateClient } from '@cosmjs/stargate';
import { EncodeObject } from '@cosmjs/proto-signing';
import { Tx, TxRaw } from '@cosmjs/stargate/build/codec/cosmos/tx/v1beta1/tx';

export default class DemerisSigningClient extends SigningStargateClient {
  public async signWMeta(
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee,
    memo = '',
    signerData = null,
  ): Promise<Tx> {
    const txRaw = await super.sign(signerAddress, messages, fee, memo, signerData);
    return TxRaw.toJSON(txRaw) as Tx;
  }
}
