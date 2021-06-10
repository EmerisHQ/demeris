import { StdFee } from '@cosmjs/amino';
import { EncodeObject } from '@cosmjs/proto-signing';
import { SignerData, SigningStargateClient } from '@cosmjs/stargate';
import { Tx, TxRaw } from '@cosmjs/stargate/build/codec/cosmos/tx/v1beta1/tx';

interface DemerisSigning {
  signWMeta: (
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee,
    memo: string,
    signerData: SignerData,
  ) => Promise<Tx>;
}
export default class DemerisSigningClient extends SigningStargateClient implements DemerisSigning {
  constructor(...args) {
    super(args[0], args[1], args[2]);
  }
  async signWMeta(
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee,
    memo = '',
    signerData = null,
  ): Promise<Tx> {
    console.log(signerData);
    console.log(messages);

    const txRaw: TxRaw = await super.sign(signerAddress, messages, fee, memo, signerData);
    const enc = TxRaw.encode(txRaw);
    const dec = Tx.toJSON(Tx.decode(enc.finish())) as Tx;
    return dec;
  }
}
