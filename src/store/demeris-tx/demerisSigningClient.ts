/* eslint-disable max-lines-per-function */
import {
  AminoMsg,
  encodeSecp256k1Pubkey,
  makeSignDoc as makeSignDocAmino,
  OfflineAminoSigner,
  StdFee,
} from '@cosmjs/amino';
import { fromBase64 } from '@cosmjs/encoding';
import { Int53 } from '@cosmjs/math';
import { encodePubkey, makeAuthInfoBytes, TxBodyEncodeObject } from '@cosmjs/proto-signing';
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

import { crescentTypes } from './crescentTypes';
import { liquidityTypes } from './liquidityTypes';
import { osmosisTypes } from './osmosisTypes';

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
    ...osmosisTypes,
    ...crescentTypes,
  };
}

interface DemerisSigning {
  exposedSigner: OfflineAminoSigner;
  signWMeta: (
    signerAddress: string,
    messages: readonly AminoMsg[],
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
    messages: readonly AminoMsg[],
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
    const msgs = messages.map((msg) => aminoTypes.fromAmino(msg)).map((msg) => aminoTypes.toAmino(msg));

    const signDoc = makeSignDocAmino(msgs, fee, chainId, memo, accountNumber, sequence);
    const { signature, signed } = await this.exposedSigner.signAmino(signerAddress, signDoc);
    /*
      The following works, but I don't know why! 
      (always wanted to write this :P)
      The msgs returned by the mapper appear to be somewhat wrongly formatted.
      Mapping them to proto and back to amino seems to fix them.
      TODO: Figure this out and fix
    */
    const signedTxBody = {
      messages: signed.msgs
        .map((msg) => aminoTypes.fromAmino(msg))
        .map((msg) => aminoTypes.toAmino(msg))
        .map((msg) => aminoTypes.fromAmino(msg)),
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
