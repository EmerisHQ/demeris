import { encodeSecp256k1Pubkey, makeSignDoc as makeSignDocAmino, OfflineAminoSigner, StdFee } from '@cosmjs/amino';
import { fromBase64 } from '@cosmjs/encoding';
import { Int53 } from '@cosmjs/math';
import { EncodeObject, encodePubkey, makeAuthInfoBytes, TxBodyEncodeObject } from '@cosmjs/proto-signing';
import { AminoConverters, AminoTypes } from '@cosmjs/stargate';
import { SignerData, SigningStargateClient } from '@cosmjs/stargate';
import {
  createAuthzAminoConverters,
  createBankAminoConverters,
  createDistributionAminoConverters,
  createFreegrantAminoConverters,
  createGovAminoConverters,
  createIbcAminoConverters,
  createStakingAminoConverters,
} from '@cosmjs/stargate';
import { bech32 } from 'bech32';
import { SignMode } from 'cosmjs-types/cosmos/tx/signing/v1beta1/signing';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

import { liquidityTypes } from './liquidityTypes';

function createAminoTypes(prefix: string): AminoConverters {
  return {
    ...createAuthzAminoConverters(),
    ...createBankAminoConverters(),
    ...createDistributionAminoConverters(),
    ...createGovAminoConverters(),
    ...createStakingAminoConverters(prefix),
    ...createIbcAminoConverters(),
    ...createFreegrantAminoConverters(),
    ...liquidityTypes,
  };
}

interface DemerisSigning {
  exposedSigner: OfflineAminoSigner;
  signWMeta: (
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee,
    memo: string,
    signerData: SignerData,
  ) => Promise<Uint8Array>;
}

export default class DemerisSigningClient extends SigningStargateClient implements DemerisSigning {
  exposedSigner: OfflineAminoSigner;
  constructor(...args) {
    super(args[0], args[1], args[2]);
    this.exposedSigner = args[1];
  }
  async signWMeta(
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee,
    memo = '',
    { accountNumber, sequence, chainId }: SignerData = null,
  ): Promise<Uint8Array> {
    const accountFromSigner = (await this.exposedSigner.getAccounts()).find(
      (account) => account.address === signerAddress,
    );
    if (!accountFromSigner) {
      throw new Error('Failed to retrieve account from signer');
    }
    const aminoTypes = new AminoTypes({ ...createAminoTypes(bech32.decode(signerAddress).prefix) });
    const pubkey = encodePubkey(encodeSecp256k1Pubkey(accountFromSigner.pubkey));
    const signMode = SignMode.SIGN_MODE_LEGACY_AMINO_JSON;
    const msgs = messages.map((msg) => aminoTypes.toAmino(msg));

    const signDoc = makeSignDocAmino(msgs, fee, chainId, memo, accountNumber, sequence);
    const { signature, signed } = await this.exposedSigner.signAmino(signerAddress, signDoc);
    const signedTxBody = {
      messages: signed.msgs.map((msg) => aminoTypes.fromAmino(msg)),
      memo: signed.memo,
    };

    const signedTxBodyEncodeObject: TxBodyEncodeObject = {
      typeUrl: '/cosmos.tx.v1beta1.TxBody',
      value: signedTxBody,
    };
    const signedTxBodyBytes = this.registry.encode(signedTxBodyEncodeObject);
    const signedGasLimit = Int53.fromString(signed.fee.gas).toNumber();
    const signedSequence = Int53.fromString(signed.sequence).toNumber();
    const signedAuthInfoBytes = makeAuthInfoBytes(
      [
        {
          pubkey: pubkey,
          sequence: signedSequence,
        },
      ],
      signed.fee.amount,
      signedGasLimit,
      signMode,
    );
    const txRaw: TxRaw = TxRaw.fromPartial({
      bodyBytes: signedTxBodyBytes,
      authInfoBytes: signedAuthInfoBytes,
      signatures: [fromBase64(signature.signature)],
    });

    const enc = TxRaw.encode(txRaw);
    const dec = TxRaw.encode(TxRaw.decode(enc.finish())).finish();
    return dec;
  }
}
