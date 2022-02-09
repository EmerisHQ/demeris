// TODO: discuss where this script can be placed

// List of chains: https://staging.demeris.io/v1/chains
// Chain data using chain_name from above endpoint: https://staging.demeris.io/v1/chain/cosmos-hub

const fs = require('fs');
const axios = require('axios');
const { Secp256k1HdWallet } = require('@cosmjs/amino');
const { stringToPath } = require('@cosmjs/crypto');

const file = `${__dirname}/../../../src/store/demeris-user/demo-account.js`;

// TODO: read from env
const mnemonic = 'nominee fox avoid drive fringe capital main shaft sample basic flag view';

const getDemoAccount = async () => {
  const {
    data: { chains },
  } = await axios.get('https://staging.demeris.io/v1/chains');
  const chainNames = chains?.map((c) => c.chain_name);

  const demoAccountAddresses = {};
  await Promise.all(
    chainNames.map(async (chainName) => {
      const {
        data: { chain },
      } = await axios.get(`https://staging.demeris.io/v1/chain/${chainName}`);
      const addressPrefix = chain.node_info.bech32_config.main_prefix;
      const derivationPath = chain.derivation_path;

      const signer = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
        hdPaths: [stringToPath(derivationPath)],
        prefix: addressPrefix,
      });
      const accountFromSigner = (await signer.getAccounts())[0];
      const address = accountFromSigner.address;

      demoAccountAddresses[chainName] = address;
    }),
  );

  console.log('demoAccountAddresses', demoAccountAddresses);

  return [];
};

getDemoAccount();

// if(data.length){
//   fs.writeFile(file, `{"data":"Hey there4!"}`, (err) => {
//     if(err) {
//         return console.log('error saving file',err);
//     }
//     console.log("The file was saved!");
//     try {
//         const data = fs.readFileSync(file, 'utf8')
//         console.log('file contents:', data)
//       } catch (err) {
//         console.error('error reading file',err)
//       }
// });
// }
