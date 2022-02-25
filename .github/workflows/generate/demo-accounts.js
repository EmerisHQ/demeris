const fs = require('fs');
require('dotenv').config();
const axios = require('axios');
const { bech32 } = require('bech32');
const { Secp256k1HdWallet } = require('@cosmjs/amino');
const { stringToPath } = require('@cosmjs/crypto');

const MNEMONIC = process.env.DEMO_ACCOUNT_MNEMONIC;

const getDemoAccountDetails = async () => {
  const {
    data: { chains },
  } = await axios.get('https://api.emeris.com/v1/chains');
  const chainNames = chains?.map((c) => c.chain_name);

  const demoAccountAddresses = {};
  const keyHashes = new Set();
  await Promise.all(
    chainNames.map(async (chainName) => {
      const {
        data: { chain },
      } = await axios.get(`https://api.emeris.com/v1/chain/${chainName}`);
      const addressPrefix = chain.node_info.bech32_config.main_prefix;
      const derivationPath = chain.derivation_path;
      const signer = await Secp256k1HdWallet.fromMnemonic(MNEMONIC, {
        hdPaths: [stringToPath(derivationPath)],
        prefix: addressPrefix,
      });
      const accountFromSigner = (await signer.getAccounts())[0];
      const address = accountFromSigner.address;
      keyHashes.add(keyHashfromAddress(address));
      demoAccountAddresses[chainName] = address;
    }),
  );
  createDemoAccountsFile(demoAccountAddresses, [...keyHashes]);
};

const createDemoAccountsFile = (demoAccountAddresses, keyHashes) => {
  const fileContentsTemplate = `export const demoAccount = {
    name: 'Demo Account',
    algo: 'secp256k1',
    pubKey: {
      0: 2,
      1: 77,
      2: 180,
      3: 175,
      4: 102,
      5: 96,
      6: 147,
      7: 15,
      8: 125,
      9: 36,
      10: 66,
      11: 27,
      12: 170,
      13: 241,
      14: 145,
      15: 113,
      16: 240,
      17: 79,
      18: 214,
      19: 162,
      20: 196,
      21: 166,
      22: 243,
      23: 33,
      24: 20,
      25: 42,
      26: 134,
      27: 65,
      28: 134,
      29: 97,
      30: 181,
      31: 54,
      32: 124,
    },
    address: {
      0: 126,
      1: 225,
      2: 67,
      3: 253,
      4: 29,
      5: 145,
      6: 52,
      7: 81,
      8: 40,
      9: 218,
      10: 84,
      11: 47,
      12: 39,
      13: 204,
      14: 216,
      15: 208,
      16: 227,
      17: 215,
      18: 143,
      19: 192,
    },
    bech32Address: 'cosmos14y53meat0ehx2k0c38knym9zczzezedryndanj',
    isNanoLedger: false,
    keyHashes: ${JSON.stringify(keyHashes, null, 2)},
  };
  export const demoAddresses = ${JSON.stringify(demoAccountAddresses, null, 2)};
  `;
  const fileName = `${__dirname}/../../../src/store/demeris-user/demo-account.js`;
  fs.writeFile(fileName, fileContentsTemplate, (err) => {
    if (err) {
      return console.log('error saving file', err);
    }
    console.log('File created successfully.');
  });
};

// TODO: pull directly from /src/utils
// This code runs in node and the original code is in TS with imports
function toHexString(byteArray) {
  return Array.prototype.map
    .call(byteArray, function (byte) {
      return ('0' + (byte & 0xff).toString(16)).slice(-2);
    })
    .join('');
}

function keyHashfromAddress(address) {
  try {
    return toHexString(bech32.fromWords(bech32.decode(address).words));
  } catch (e) {
    throw new Error('Could not decode address');
  }
}

getDemoAccountDetails();
