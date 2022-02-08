// List of chains: https://staging.demeris.io/v1/chains
// Chain data using chain_name from above endpoint: https://staging.demeris.io/v1/chain/cosmos-hub

const fs = require('fs');
const axios = require('axios');

const file = `${__dirname}/../../../src/store/demeris-user/demo-account.js`;

const getDemoAccount = async () => {
  const {
    data: { chains },
  } = await axios.get('https://staging.demeris.io/v1/chains');
  const chainNames = chains.map((c) => c.chain_name);
  console.log(chainNames);

  const { data: chain } = await axios.get(`https://staging.demeris.io/v1/chain/${chainNames[0]}`);

  console.log('single chain', chain);

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
