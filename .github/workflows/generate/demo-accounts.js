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
        0: 3,
        1: 4,
        2: 219,
        3: 238,
        4: 224,
        5: 11,
        6: 210,
        7: 24,
        8: 80,
        9: 47,
        10: 205,
        11: 187,
        12: 24,
        13: 62,
        14: 88,
        15: 76,
        16: 135,
        17: 54,
        18: 209,
        19: 149,
        20: 107,
        21: 110,
        22: 6,
        23: 24,
        24: 131,
        25: 164,
        26: 81,
        27: 139,
        28: 78,
        29: 80,
        30: 96,
        31: 132,
        32: 213
    },
    address: {
        0: 169,
        1: 41,
        2: 29,
        3: 231,
        4: 171,
        5: 126,
        6: 110,
        7: 101,
        8: 89,
        9: 248,
        10: 137,
        11: 237,
        12: 50,
        13: 108,
        14: 162,
        15: 192,
        16: 133,
        17: 145,
        18: 101,
        19: 163
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
