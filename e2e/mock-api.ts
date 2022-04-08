import { Request, Route } from 'playwright-core';

const successReponse = {
  status: 200,
  contentType: 'text/json',
  headers: {
    'access-control-allow-credentials': 'true',
    'access-control-allow-origin': '*',
  },
};
const notFoundReponse = {
  status: 404,
  contentType: 'text/json',
  headers: {
    'access-control-allow-credentials': 'true',
    'access-control-allow-origin': '*',
  },
};
const errorResponse = {
  status: 400,
  contentType: 'text/json',
  headers: {
    'access-control-allow-credentials': 'true',
    'access-control-allow-origin': '*',
  },
};
const serverErrorResponse = {
  status: 503,
  contentType: 'text/json',
  headers: {
    'access-control-allow-credentials': 'true',
    'access-control-allow-origin': '*',
  },
};
function create200(body: string) {
  return Object.assign({ body }, successReponse);
}
function _create404(body: string) {
  return Object.assign({ body }, notFoundReponse);
}
function _create400(body: string) {
  return Object.assign({ body }, errorResponse);
}
function _create503(body: string) {
  return Object.assign({ body }, serverErrorResponse);
}

export default function mockHandler(route: Route, request: Request): void {
  const url = request.url();
  switch (url) {
    case 'https://api.emeris.com/v1/verified_denoms':
      route.fulfill(
        create200(
          '{"verified_denoms":[{"name":"uakt","display_name":"AKT","logo":"https://storage.googleapis.com/emeris/logos/akash.svg","precision":6,"verified":true,"stakable":true,"ticker":"AKT","price_id":"akash-network","fee_token":true,"gas_price_levels":{"low":0.036,"average":0.09,"high":0.108},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":40000000,"chain_name":"akash"},{"name":"poolE71FE13681A283B7015E4E4C4852B0EDA72CC97A5CDE2ECA2A6C8C06C86AC775","display_name":"Gravity 2","precision":6,"verified":true,"ticker":"G2","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false,"chain_name":"cosmos-hub"},{"name":"poolDFB8434D5A80B4EAFA94B6878BD5B85265AC6C5D37204AB899B1C3C52543DA7E","display_name":"Gravity 1","precision":6,"verified":true,"ticker":"G1","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false,"chain_name":"cosmos-hub"},{"name":"uatom","display_name":"ATOM","logo":"https://storage.googleapis.com/emeris/logos/atom.svg","precision":6,"verified":true,"stakable":true,"ticker":"ATOM","price_id":"cosmos","fee_token":true,"gas_price_levels":{"low":0.005,"average":0.01,"high":0.03},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":10000000,"chain_name":"cosmos-hub"},{"name":"poolD639A99414646D7136C65C6845D0EB3456EDD3D6C2C43050D3FA3A24995B0E75","display_name":"Gravity 3","precision":6,"verified":true,"ticker":"G3","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false,"chain_name":"cosmos-hub"},{"name":"pool2B9C24833CAA268C9081EC251693A724E8D343FC25A841FF00FD37B047BA4DEA","display_name":"Gravity 4","precision":6,"verified":true,"ticker":"G4","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false,"chain_name":"cosmos-hub"},{"name":"pool32DD066BE949E5FDCC7DC09EBB67C7301D0CA957C2EF56A39B37430165447DAC","display_name":"Gravity 5","precision":6,"verified":true,"ticker":"G5","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false,"chain_name":"cosmos-hub"},{"name":"pool4BFAFC499776D30A4FA0D6033135F00CC4EFC770D19A74CAD37433B579F77FC0","display_name":"Gravity 6","precision":6,"verified":true,"ticker":"G6","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false,"chain_name":"cosmos-hub"},{"name":"pool7AE391C099D1D88CC85A9FA8A0DC5650BF8DDE0DCE7D0824C073802C020A7747","display_name":"Gravity 7","precision":6,"verified":true,"ticker":"G7","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false,"chain_name":"cosmos-hub"},{"name":"poolF2805980C54E1474BDCCF70EF5FE881F3B8EFCF8BA3198765C01D91904521788","display_name":"Gravity 8","precision":6,"verified":true,"ticker":"G8","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false,"chain_name":"cosmos-hub"},{"name":"poolBD5F1AF7A8B1F068C178F1D637DF126968EC10AB204A10116E320B2B8AF4FAC2","display_name":"Gravity 9","precision":6,"verified":true,"ticker":"G9","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false,"chain_name":"cosmos-hub"},{"name":"poolB457CE9240C221C0F76952FED6506F74375EDD38B32A6020B7DDDFD5A4867D5C","display_name":"Gravity 10","precision":6,"verified":true,"ticker":"G10","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false,"chain_name":"cosmos-hub"},{"name":"poolD1121E78E731AFD35FEA13CF9FA0044A1472F73A0EE784160CCAAAAE5C7AAD7E","display_name":"Gravity 11","precision":6,"verified":true,"ticker":"G11","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false,"chain_name":"cosmos-hub"},{"name":"pool60EFB07817D6B193A9FADA611404B8E11D82D6B7F0D10D57D3134C93E2BF7414","display_name":"Gravity 12","precision":6,"verified":true,"ticker":"G12","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false,"chain_name":"cosmos-hub"},{"name":"poolCF8B847997F5EB92B9C8DBAE41656F61D6BE708B1B42D31063291813014AD63F","display_name":"Gravity 13","precision":6,"verified":true,"ticker":"G13","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false,"chain_name":"cosmos-hub"},{"name":"poolAC9AF7B48E4497A0A9AF109E4286464A0EF06E7C35AD79198F03AB17A6A4CCA7","display_name":"Gravity 14","precision":6,"verified":true,"ticker":"G14","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false,"chain_name":"cosmos-hub"},{"name":"poolFD005C5AB01714A4B62E87F5213F5D5CDE357773D70712916A93664BCE5A6931","display_name":"Gravity 15","precision":6,"verified":true,"ticker":"G15","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false,"chain_name":"cosmos-hub"},{"name":"basecro","display_name":"CRO","logo":"https://storage.googleapis.com/emeris/logos/crypto-com.svg","precision":8,"verified":true,"stakable":true,"ticker":"CRO","price_id":"crypto-com-chain","fee_token":true,"gas_price_levels":{"low":0.025,"average":0.03,"high":0.04},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":850000000,"chain_name":"crypto-org"},{"name":"uiris","display_name":"IRIS","logo":"https://storage.googleapis.com/emeris/logos/iris.svg","precision":6,"verified":true,"stakable":true,"ticker":"IRIS","price_id":"iris-network","fee_token":true,"gas_price_levels":{"low":0.2,"average":0.3,"high":0.4},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":1500000000,"chain_name":"iris"},{"name":"uosmo","display_name":"OSMO","logo":"https://storage.googleapis.com/emeris/logos/osmosis.svg","precision":6,"verified":true,"stakable":true,"ticker":"OSMO","price_id":"osmosis","fee_token":true,"gas_price_levels":{"low":0,"average":0,"high":0.12},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":60000000,"chain_name":"osmosis"},{"name":"uion","display_name":"ION","logo":"https://storage.googleapis.com/emeris/logos/ion.svg","precision":6,"verified":true,"ticker":"ION","price_id":"ion","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":true,"relayer_denom":false,"chain_name":"osmosis"},{"name":"uxprt","display_name":"Persistence","logo":"https://storage.googleapis.com/emeris/logos/persistence.svg","precision":6,"verified":true,"stakable":true,"ticker":"XPRT","price_id":"persistence","fee_token":true,"gas_price_levels":{"low":0.015,"average":0.0375,"high":0.06},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":17000000,"chain_name":"persistence"},{"name":"uregen","display_name":"REGEN","logo":"https://storage.googleapis.com/emeris/logos/regen.svg","precision":6,"verified":true,"stakable":true,"ticker":"REGEN","price_id":"regen","fee_token":true,"gas_price_levels":{"low":0.03,"average":0.075,"high":0.12},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":50000000,"chain_name":"regen"},{"name":"udvpn","display_name":"Sentinel","logo":"https://storage.googleapis.com/emeris/logos/sentinel.svg","precision":6,"verified":true,"stakable":true,"ticker":"DVPN","price_id":"sentinel","fee_token":true,"gas_price_levels":{"low":0.1,"average":0.12,"high":0.2},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":5000000000,"chain_name":"sentinel"},{"name":"utick","display_name":"Microtick","logo":"https://storage.googleapis.com/emeris/logos/microtick.svg","precision":6,"verified":true,"stakable":true,"ticker":"TICK","price_id":"microtick","fee_token":true,"gas_price_levels":{"low":0.0005,"average":0.001,"high":0.0015},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":42,"chain_name":"microtick"},{"name":"uixo","display_name":"IXO","logo":"https://storage.googleapis.com/emeris/logos/ixo.svg","precision":6,"verified":true,"stakable":true,"ticker":"IXO","price_id":"ixo","fee_token":true,"gas_price_levels":{"low":0.01,"average":0.025,"high":0.04},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":42,"chain_name":"ixo"},{"name":"ungm","display_name":"NGM","logo":"https://storage.googleapis.com/emeris/logos/e-money.svg","precision":6,"verified":true,"stakable":true,"ticker":"NGM","price_id":"e-money","fee_token":true,"gas_price_levels":{"low":1.5,"average":1,"high":2},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":42,"chain_name":"emoney"},{"name":"rowan","display_name":"ROWAN","logo":"https://storage.googleapis.com/emeris/logos/rowan.svg","precision":18,"verified":true,"stakable":true,"ticker":"EROWAN","price_id":"sifchain","fee_token":true,"gas_price_levels":{"low":250000000000,"average":500000000000,"high":1000000000000},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":50000000,"chain_name":"sifchain"},{"name":"nanolike","display_name":"LIKE","logo":"https://storage.googleapis.com/emeris/logos/likecoin.svg","precision":9,"verified":true,"stakable":true,"ticker":"LIKE","price_id":"likecoin","fee_token":true,"gas_price_levels":{"low":4,"average":4,"high":10},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":60000000,"chain_name":"likecoin"},{"name":"ujuno","display_name":"JUNO","logo":"https://storage.googleapis.com/emeris/logos/juno.svg","precision":6,"verified":true,"stakable":true,"ticker":"JUNO","price_id":"juno-network","fee_token":true,"gas_price_levels":{"low":0.005,"average":0.01,"high":0.025},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":42,"chain_name":"juno"},{"name":"ubcna","display_name":"BCNA","logo":"https://storage.googleapis.com/emeris/logos/bitcanna.svg","precision":6,"verified":true,"stakable":true,"ticker":"BCNA","price_id":"bitcanna","fee_token":true,"gas_price_levels":{"low":0.25,"average":0.25,"high":0.5},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":42,"chain_name":"bitcanna"},{"name":"ubtsg","display_name":"BTSG","logo":"https://storage.googleapis.com/emeris/logos/bitsong.svg","precision":6,"verified":true,"stakable":true,"ticker":"BTSG","price_id":"bitsong","fee_token":true,"gas_price_levels":{"low":0.01,"average":0.025,"high":0.03},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":42,"chain_name":"bitsong"},{"name":"uxki","display_name":"XKI","logo":"https://storage.googleapis.com/emeris/logos/ki.svg","precision":6,"verified":true,"stakable":true,"ticker":"XKI","price_id":"ki","fee_token":true,"gas_price_levels":{"low":0.025,"average":0.025,"high":0.05},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":42,"chain_name":"ki"},{"name":"uatolo","display_name":"ATOLO","logo":"https://storage.googleapis.com/emeris/logos/rizon.svg","precision":6,"verified":true,"stakable":true,"ticker":"ATOLO","price_id":"rizon","fee_token":true,"gas_price_levels":{"low":0.00025,"average":0.0003,"high":0.0005},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":42,"chain_name":"rizon"},{"name":"ncheq","display_name":"CHEQ","logo":"https://storage.googleapis.com/emeris/logos/cheq.svg","precision":9,"verified":true,"stakable":true,"ticker":"CHEQ","price_id":"cheqd-network","fee_token":true,"gas_price_levels":{"low":25,"average":30,"high":50},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":42,"chain_name":"cheqd"},{"name":"uhuahua","display_name":"HUAHUA","logo":"https://storage.googleapis.com/emeris/logos/huahua.svg","precision":6,"verified":true,"stakable":true,"ticker":"HUAHUA","price_id":"chihuahua-token","fee_token":true,"gas_price_levels":{"low":0.01,"average":0.025,"high":0.03},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":42,"chain_name":"chihuahua"},{"name":"usomm","display_name":"SOMM","logo":"https://storage.googleapis.com/emeris/logos/somm.svg","precision":6,"verified":true,"stakable":true,"ticker":"SOMM","price_id":"sommelier","fee_token":true,"gas_price_levels":{"low":0.03,"average":0.075,"high":0.12},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":50000000,"chain_name":"sommelier"},{"name":"udsm","display_name":"DSM","logo":"https://storage.googleapis.com/emeris/logos/dsm.svg","precision":6,"verified":true,"stakable":true,"ticker":"DSM","price_id":"desmos","fee_token":true,"gas_price_levels":{"low":0.03,"average":0.075,"high":0.12},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":50000000,"chain_name":"desmos"},{"name":"ulum","display_name":"LUM","logo":"https://storage.googleapis.com/emeris/logos/lum.svg","precision":6,"verified":true,"stakable":true,"ticker":"LUM","price_id":"lum-network","fee_token":true,"gas_price_levels":{"low":0.03,"average":0.075,"high":0.12},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":50000000,"chain_name":"lum"},{"name":"ucmdx","display_name":"Comdex","logo":"https://storage.googleapis.com/emeris/logos/comdex.svg","precision":6,"verified":true,"stakable":true,"ticker":"CMDX","price_id":"comdex","fee_token":true,"gas_price_levels":{"low":0.25,"average":0.3,"high":0.5},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":42,"chain_name":"comdex"}]}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chains':
      route.fulfill(
        create200(
          '{"chains":[{"chain_name":"akash","display_name":"Akash","logo":"https://storage.googleapis.com/emeris/logos/akash.svg"},{"chain_name":"cosmos-hub","display_name":"Cosmos Hub","logo":"https://storage.googleapis.com/emeris/logos/atom.svg"},{"chain_name":"crypto-org","display_name":"Crypto.org","logo":"https://storage.googleapis.com/emeris/logos/crypto-com.svg"},{"chain_name":"iris","display_name":"IRISNet","logo":"https://storage.googleapis.com/emeris/logos/iris.svg"},{"chain_name":"osmosis","display_name":"Osmosis","logo":"https://storage.googleapis.com/emeris/logos/osmosis.svg"},{"chain_name":"persistence","display_name":"Persistence","logo":"https://storage.googleapis.com/emeris/logos/persistence.svg"},{"chain_name":"regen","display_name":"Regen","logo":"https://storage.googleapis.com/emeris/logos/regen.svg"},{"chain_name":"sentinel","display_name":"Sentinel","logo":"https://storage.googleapis.com/emeris/logos/sentinel.svg"},{"chain_name":"microtick","display_name":"Microtick","logo":"https://storage.googleapis.com/emeris/logos/microtick.svg"},{"chain_name":"ixo","display_name":"IXO","logo":"https://storage.googleapis.com/emeris/logos/ixo.svg"},{"chain_name":"emoney","display_name":"e-Money","logo":"https://storage.googleapis.com/emeris/logos/e-money.svg"},{"chain_name":"sifchain","display_name":"Sifchain","logo":"https://storage.googleapis.com/emeris/logos/rowan.svg"},{"chain_name":"likecoin","display_name":"LikeCoin","logo":"https://storage.googleapis.com/emeris/logos/likecoin.svg"},{"chain_name":"juno","display_name":"juno","logo":"https://storage.googleapis.com/emeris/logos/juno.svg"},{"chain_name":"bitcanna","display_name":"BitCanna","logo":"https://storage.googleapis.com/emeris/logos/bitcanna.svg"},{"chain_name":"bitsong","display_name":"BitSong","logo":"https://storage.googleapis.com/emeris/logos/bitsong.svg"},{"chain_name":"ki","display_name":"Ki","logo":"https://storage.googleapis.com/emeris/logos/ki.svg"},{"chain_name":"rizon","display_name":"Rizon","logo":"https://storage.googleapis.com/emeris/logos/rizon.svg"},{"chain_name":"cheqd","display_name":"cheqd","logo":"https://storage.googleapis.com/emeris/logos/cheq.svg"},{"chain_name":"chihuahua","display_name":"Chihuahua","logo":"https://app.osmosis.zone/public/assets/tokens/huahua.png"},{"chain_name":"sommelier","display_name":"sommelier","logo":"https://storage.googleapis.com/emeris/logos/somm.svg"},{"chain_name":"desmos","display_name":"desmos","logo":"https://storage.googleapis.com/emeris/logos/dsm.svg"},{"chain_name":"lum","display_name":"lum","logo":"https://storage.googleapis.com/emeris/logos/lum.svg"},{"chain_name":"comdex","display_name":"Comdex","logo":"https://storage.googleapis.com/emeris/logos/comdex.svg"}]}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/persistence':
      route.fulfill(
        create200(
          '{"chain":{"enabled":true,"chain_name":"persistence","logo":"https://storage.googleapis.com/emeris/logos/persistence.svg","display_name":"Persistence","primary_channel":{"cosmos-hub":"channel-24","osmosis":"channel-6","sifchain":"channel-26"},"denoms":[{"name":"uxprt","display_name":"Persistence","logo":"https://storage.googleapis.com/emeris/logos/persistence.svg","precision":6,"verified":true,"stakable":true,"ticker":"XPRT","price_id":"persistence","fee_token":true,"gas_price_levels":{"low":0.015,"average":0.0375,"high":0.06},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":17000000}],"demeris_addresses":["feeaddress"],"genesis_hash":"genesis_hash","node_info":{"endpoint":"persistence","chain_id":"core-1","bech32_config":{"main_prefix":"persistence","prefix_account":"persistence","prefix_validator":"val","prefix_consensus":"cons","prefix_public":"pub","prefix_operator":"oper","acc_addr":"persistence","acc_pub":"persistencepub","val_addr":"persistencevaloper","val_pub":"persistencevaloperpub","cons_addr":"persistencevalcons","cons_pub":"persistencevalconspub"}},"valid_block_thresh":"30s","derivation_path":"m/44\'/750\'/0\'/0/0","supported_wallets":["keplr"],"block_explorer":"https://www.mintscan.io/persistence","public_node_endpoints":{"tendermint_rpc":["https://rpc.core.persistence.one:443"],"cosmos_api":["https://rest.core.persistence.one:443"]},"cosmos_sdk_version":"v0.44.5"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/iris':
      route.fulfill(
        create200(
          '{"chain":{"enabled":true,"chain_name":"iris","logo":"https://storage.googleapis.com/emeris/logos/iris.svg","display_name":"IRISNet","primary_channel":{"cosmos-hub":"channel-12","osmosis":"channel-3","sifchain":"channel-19"},"denoms":[{"name":"uiris","display_name":"IRIS","logo":"https://storage.googleapis.com/emeris/logos/iris.svg","precision":6,"verified":true,"stakable":true,"ticker":"IRIS","price_id":"iris-network","fee_token":true,"gas_price_levels":{"low":0.2,"average":0.3,"high":0.4},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":1500000000}],"demeris_addresses":["feeaddress"],"genesis_hash":"genesis_hash","node_info":{"endpoint":"iris","chain_id":"irishub-1","bech32_config":{"main_prefix":"iaa","prefix_account":"iaa","prefix_validator":"val","prefix_consensus":"cons","prefix_public":"pub","prefix_operator":"oper","acc_addr":"iaa","acc_pub":"iaapub","val_addr":"iaavaloper","val_pub":"iaavaloperpub","cons_addr":"iaavalcons","cons_pub":"iaavalconspub"}},"valid_block_thresh":"30s","derivation_path":"m/44\'/118\'/0\'/0/0","supported_wallets":["keplr"],"block_explorer":"https://www.mintscan.io/iris","public_node_endpoints":{"tendermint_rpc":["https://rpc-iris.keplr.app:443"],"cosmos_api":["https://lcd-iris.keplr.app:443"]},"cosmos_sdk_version":"v0.44.5"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/osmosis':
      route.fulfill(
        create200(
          '{"chain":{"enabled":true,"chain_name":"osmosis","logo":"https://storage.googleapis.com/emeris/logos/osmosis.svg","display_name":"Osmosis","primary_channel":{"akash":"channel-1","bitcanna":"channel-51","bitsong":"channel-73","cheqd":"channel-108","chihuahua":"channel-113","comdex":"channel-87","cosmos-hub":"channel-0","crypto-org":"channel-5","desmos":"channel-135","emoney":"channel-37","iris":"channel-6","ixo":"channel-38","juno":"channel-42","ki":"channel-77","likecoin":"channel-53","lum":"channel-115","microtick":"channel-39","persistence":"channel-4","regen":"channel-8","sentinel":"channel-2","sifchain":"channel-47","sommelier":"channel-165","stargaze":"channel-75","starname":"channel-35","terra":"channel-72"},"denoms":[{"name":"uosmo","display_name":"OSMO","logo":"https://storage.googleapis.com/emeris/logos/osmosis.svg","precision":6,"verified":true,"stakable":true,"ticker":"OSMO","price_id":"osmosis","fee_token":true,"gas_price_levels":{"low":0,"average":0,"high":0.12},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":60000000},{"name":"uion","display_name":"ION","logo":"https://storage.googleapis.com/emeris/logos/ion.svg","precision":6,"verified":true,"ticker":"ION","price_id":"ion","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":true,"relayer_denom":false}],"demeris_addresses":["feeaddress"],"genesis_hash":"genesis_hash","node_info":{"endpoint":"osmosis","chain_id":"osmosis-1","bech32_config":{"main_prefix":"osmo","prefix_account":"osmo","prefix_validator":"val","prefix_consensus":"cons","prefix_public":"pub","prefix_operator":"oper","acc_addr":"osmo","acc_pub":"osmopub","val_addr":"osmovaloper","val_pub":"osmovaloperpub","cons_addr":"osmovalcons","cons_pub":"osmovalconspub"}},"valid_block_thresh":"30s","derivation_path":"m/44\'/118\'/0\'/0/0","supported_wallets":["keplr"],"block_explorer":"https://www.mintscan.io/osmosis","public_node_endpoints":{"tendermint_rpc":["https://rpc-osmosis.blockapsis.com:443"],"cosmos_api":["https://lcd-osmosis.blockapsis.com:443"]},"cosmos_sdk_version":"v0.44.5"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/regen':
      route.fulfill(
        create200(
          '{"chain":{"enabled":true,"chain_name":"regen","logo":"https://storage.googleapis.com/emeris/logos/regen.svg","display_name":"Regen","primary_channel":{"cosmos-hub":"channel-11","osmosis":"channel-1","sifchain":"channel-28"},"denoms":[{"name":"uregen","display_name":"REGEN","logo":"https://storage.googleapis.com/emeris/logos/regen.svg","precision":6,"verified":true,"stakable":true,"ticker":"REGEN","price_id":"regen","fee_token":true,"gas_price_levels":{"low":0.03,"average":0.075,"high":0.12},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":50000000}],"demeris_addresses":["feeaddress"],"genesis_hash":"genesis_hash","node_info":{"endpoint":"regen","chain_id":"regen-1","bech32_config":{"main_prefix":"regen","prefix_account":"regen","prefix_validator":"val","prefix_consensus":"cons","prefix_public":"pub","prefix_operator":"oper","acc_addr":"regen","acc_pub":"regenpub","val_addr":"regenvaloper","val_pub":"regenvaloperpub","cons_addr":"regenvalcons","cons_pub":"regenvalconspub"}},"valid_block_thresh":"30s","derivation_path":"m/44\'/118\'/0\'/0/0","supported_wallets":["keplr"],"block_explorer":"https://www.mintscan.io/regen","public_node_endpoints":{"tendermint_rpc":["http://rpc.regen.forbole.com:80"],"cosmos_api":["https://regen.stakesystems.io:443"]},"cosmos_sdk_version":"v0.44.3"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/microtick':
      route.fulfill(
        create200(
          '{"chain":{"enabled":true,"chain_name":"microtick","logo":"https://storage.googleapis.com/emeris/logos/microtick.svg","display_name":"Microtick","primary_channel":{"cosmos-hub":"channel-6","osmosis":"channel-16"},"denoms":[{"name":"utick","display_name":"Microtick","logo":"https://storage.googleapis.com/emeris/logos/microtick.svg","precision":6,"verified":true,"stakable":true,"ticker":"TICK","price_id":"microtick","fee_token":true,"gas_price_levels":{"low":0.0005,"average":0.001,"high":0.0015},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":42}],"demeris_addresses":["feeaddress"],"genesis_hash":"genesis_hash","node_info":{"endpoint":"microtick","chain_id":"microtick-1","bech32_config":{"main_prefix":"micro","prefix_account":"micro","prefix_validator":"val","prefix_consensus":"cons","prefix_public":"pub","prefix_operator":"oper","acc_addr":"micro","acc_pub":"micropub","val_addr":"microvaloper","val_pub":"microvaloperpub","cons_addr":"microvalcons","cons_pub":"microvalconspub"}},"valid_block_thresh":"30s","derivation_path":"m/44\'/118\'/0\'/0/0","supported_wallets":["keplr"],"block_explorer":"https://explorer.microtick.zone","public_node_endpoints":{"tendermint_rpc":["https://microtick.chorus.one:443"],"cosmos_api":["https://microtick-lcd.chorus.one:443"]},"cosmos_sdk_version":"v0.42.10"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/sentinel':
      route.fulfill(
        create200(
          '{"chain":{"enabled":true,"chain_name":"sentinel","logo":"https://storage.googleapis.com/emeris/logos/sentinel.svg","display_name":"Sentinel","primary_channel":{"cosmos-hub":"channel-12","osmosis":"channel-0","sifchain":"channel-36"},"denoms":[{"name":"udvpn","display_name":"Sentinel","logo":"https://storage.googleapis.com/emeris/logos/sentinel.svg","precision":6,"verified":true,"stakable":true,"ticker":"DVPN","price_id":"sentinel","fee_token":true,"gas_price_levels":{"low":0.1,"average":0.12,"high":0.2},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":5000000000}],"demeris_addresses":["feeaddress"],"genesis_hash":"genesis_hash","node_info":{"endpoint":"sentinel","chain_id":"sentinelhub-2","bech32_config":{"main_prefix":"sent","prefix_account":"sent","prefix_validator":"val","prefix_consensus":"cons","prefix_public":"pub","prefix_operator":"oper","acc_addr":"sent","acc_pub":"sentpub","val_addr":"sentvaloper","val_pub":"sentvaloperpub","cons_addr":"sentvalcons","cons_pub":"sentvalconspub"}},"valid_block_thresh":"30s","derivation_path":"m/44\'/118\'/0\'/0/0","supported_wallets":["keplr"],"block_explorer":"https://www.mintscan.io/sentinel","public_node_endpoints":{"tendermint_rpc":["https://rpc-sentinel.keplr.app:443"],"cosmos_api":["https://lcd-sentinel.keplr.app:443"]},"cosmos_sdk_version":"v0.42.5"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/ixo':
      route.fulfill(
        create200(
          '{"chain":{"enabled":true,"chain_name":"ixo","logo":"https://storage.googleapis.com/emeris/logos/ixo.svg","display_name":"IXO","primary_channel":{"cosmos-hub":"channel-1","osmosis":"channel-4"},"denoms":[{"name":"uixo","display_name":"IXO","logo":"https://storage.googleapis.com/emeris/logos/ixo.svg","precision":6,"verified":true,"stakable":true,"ticker":"IXO","price_id":"ixo","fee_token":true,"gas_price_levels":{"low":0.01,"average":0.025,"high":0.04},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":42}],"demeris_addresses":["feeaddress"],"genesis_hash":"genesis_hash","node_info":{"endpoint":"ixo","chain_id":"impacthub-3","bech32_config":{"main_prefix":"ixo","prefix_account":"ixo","prefix_validator":"val","prefix_consensus":"cons","prefix_public":"pub","prefix_operator":"oper","acc_addr":"ixo","acc_pub":"ixopub","val_addr":"ixovaloper","val_pub":"ixovaloperpub","cons_addr":"ixovalcons","cons_pub":"ixovalconspub"}},"valid_block_thresh":"30s","derivation_path":"m/44\'/118\'/0\'/0/0","supported_wallets":["keplr"],"block_explorer":"https://blockscan.ixo.world","public_node_endpoints":{"tendermint_rpc":["https://impacthub.ixo.world:443/rpc"],"cosmos_api":["https://impacthub.ixo.world:443/rest"]},"cosmos_sdk_version":"v0.42.9"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/ki':
      route.fulfill(
        create200(
          '{"chain":{"enabled":true,"chain_name":"ki","logo":"https://storage.googleapis.com/emeris/logos/ki.svg","display_name":"Ki","primary_channel":{"cosmos-hub":"channel-1","osmosis":"channel-0"},"denoms":[{"name":"uxki","display_name":"XKI","logo":"https://storage.googleapis.com/emeris/logos/ki.svg","precision":6,"verified":true,"stakable":true,"ticker":"XKI","price_id":"ki","fee_token":true,"gas_price_levels":{"low":0.025,"average":0.025,"high":0.05},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":42}],"demeris_addresses":["feeaddress"],"genesis_hash":"genesis_hash","node_info":{"endpoint":"ki","chain_id":"kichain-2","bech32_config":{"main_prefix":"ki","prefix_account":"ki","prefix_validator":"val","prefix_consensus":"cons","prefix_public":"pub","prefix_operator":"oper","acc_addr":"ki","acc_pub":"kipub","val_addr":"kivaloper","val_pub":"kivaloperpub","cons_addr":"kivalcons","cons_pub":"kivalconspub"}},"valid_block_thresh":"20s","derivation_path":"m/44\'/118\'/0\'/0/0","supported_wallets":["keplr"],"block_explorer":"https://www.mintscan.io/ki-chain","public_node_endpoints":{"tendermint_rpc":["https://rpc-mainnet.blockchain.ki:443"],"cosmos_api":["https://api-mainnet.blockchain.ki:443"]},"cosmos_sdk_version":"v0.42.10"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/juno':
      route.fulfill(
        create200(
          '{"chain":{"enabled":true,"chain_name":"juno","logo":"https://storage.googleapis.com/emeris/logos/juno.svg","display_name":"juno","primary_channel":{"cosmos-hub":"channel-1","osmosis":"channel-0","regen":"channel-6","sifchain":"channel-5","stargaze":"channel-20","terra":"channel-7"},"denoms":[{"name":"ujuno","display_name":"JUNO","logo":"https://storage.googleapis.com/emeris/logos/juno.svg","precision":6,"verified":true,"stakable":true,"ticker":"JUNO","price_id":"juno-network","fee_token":true,"gas_price_levels":{"low":0.005,"average":0.01,"high":0.025},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":42}],"demeris_addresses":["feeaddress"],"genesis_hash":"genesis_hash","node_info":{"endpoint":"juno","chain_id":"juno-1","bech32_config":{"main_prefix":"juno","prefix_account":"juno","prefix_validator":"val","prefix_consensus":"cons","prefix_public":"pub","prefix_operator":"oper","acc_addr":"juno","acc_pub":"junopub","val_addr":"junovaloper","val_pub":"junovaloperpub","cons_addr":"junovalcons","cons_pub":"junovalconspub"}},"valid_block_thresh":"30s","derivation_path":"m/44\'/118\'/0\'/0/0","supported_wallets":["keplr"],"block_explorer":"https://www.mintscan.io/juno","public_node_endpoints":{"tendermint_rpc":["https://rpc-juno.itastakers.com:443"],"cosmos_api":["https://lcd-juno.itastakers.com:443"]},"cosmos_sdk_version":"v0.44.5"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/bitsong':
      route.fulfill(
        create200(
          '{"chain":{"enabled":true,"chain_name":"bitsong","logo":"https://storage.googleapis.com/emeris/logos/bitsong.svg","display_name":"BitSong","primary_channel":{"cosmos-hub":"channel-1","juno":"channel-5","osmosis":"channel-0"},"denoms":[{"name":"ubtsg","display_name":"BTSG","logo":"https://storage.googleapis.com/emeris/logos/bitsong.svg","precision":6,"verified":true,"stakable":true,"ticker":"BTSG","price_id":"bitsong","fee_token":true,"gas_price_levels":{"low":0.01,"average":0.025,"high":0.03},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":42}],"demeris_addresses":["feeaddress"],"genesis_hash":"genesis_hash","node_info":{"endpoint":"bitsong","chain_id":"bitsong-2b","bech32_config":{"main_prefix":"bitsong","prefix_account":"bitsong","prefix_validator":"val","prefix_consensus":"cons","prefix_public":"pub","prefix_operator":"oper","acc_addr":"bitsong","acc_pub":"bitsongpub","val_addr":"bitsongvaloper","val_pub":"bitsongvaloperpub","cons_addr":"bitsongvalcons","cons_pub":"bitsongvalconspub"}},"valid_block_thresh":"20s","derivation_path":"m/44\'/639\'/0\'/0/0","supported_wallets":["keplr"],"block_explorer":"https://www.mintscan.io/bitsong","public_node_endpoints":{"tendermint_rpc":["https://rpc-bitsong.itastakers.com:443"],"cosmos_api":["https://lcd-bitsong.itastakers.com:443"]},"cosmos_sdk_version":"v0.42.10"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/desmos':
      route.fulfill(
        create200(
          '{"chain":{"enabled":true,"chain_name":"desmos","logo":"https://storage.googleapis.com/emeris/logos/dsm.svg","display_name":"desmos","primary_channel":{"osmosis":"channel-2"},"denoms":[{"name":"udsm","display_name":"DSM","logo":"https://storage.googleapis.com/emeris/logos/dsm.svg","precision":6,"verified":true,"stakable":true,"ticker":"DSM","price_id":"desmos","fee_token":true,"gas_price_levels":{"low":0.03,"average":0.075,"high":0.12},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":50000000}],"demeris_addresses":["feeaddress"],"genesis_hash":"genesis_hash","node_info":{"endpoint":"desmos","chain_id":"desmos-mainnet","bech32_config":{"main_prefix":"desmos","prefix_account":"desmos","prefix_validator":"val","prefix_consensus":"cons","prefix_public":"pub","prefix_operator":"oper","acc_addr":"desmos","acc_pub":"desmospub","val_addr":"desmosvaloper","val_pub":"desmosvaloperpub","cons_addr":"desmosvalcons","cons_pub":"desmosvalconspub"}},"valid_block_thresh":"30s","derivation_path":"m/44\'/852\'/0\'/0/0","supported_wallets":["keplr"],"block_explorer":"https://www.mintscan.io/desmos","public_node_endpoints":{"tendermint_rpc":["https://rpc.mainnet.desmos.network:443"],"cosmos_api":["https://api.mainnet.desmos.network:443"]},"cosmos_sdk_version":"v0.44.5"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/emoney':
      route.fulfill(
        create200(
          '{"chain":{"enabled":true,"chain_name":"emoney","logo":"https://storage.googleapis.com/emeris/logos/e-money.svg","display_name":"e-Money","primary_channel":{"cosmos-hub":"channel-1","osmosis":"channel-0","sifchain":"channel-14"},"denoms":[{"name":"ungm","display_name":"NGM","logo":"https://storage.googleapis.com/emeris/logos/e-money.svg","precision":6,"verified":true,"stakable":true,"ticker":"NGM","price_id":"e-money","fee_token":true,"gas_price_levels":{"low":1.5,"average":1,"high":2},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":42}],"demeris_addresses":["feeaddress"],"genesis_hash":"genesis_hash","node_info":{"endpoint":"emoney","chain_id":"emoney-3","bech32_config":{"main_prefix":"emoney","prefix_account":"emoney","prefix_validator":"val","prefix_consensus":"cons","prefix_public":"pub","prefix_operator":"oper","acc_addr":"emoney","acc_pub":"emoneypub","val_addr":"emoneyvaloper","val_pub":"emoneyvaloperpub","cons_addr":"emoneyvalcons","cons_pub":"emoneyvalconspub"}},"valid_block_thresh":"5m0s","derivation_path":"m/44\'/118\'/0\'/0/0","supported_wallets":["keplr"],"block_explorer":"https://www.mintscan.io/emoney","public_node_endpoints":{"tendermint_rpc":["https://rpc-emoney.keplr.app:443"],"cosmos_api":["https://lcd-emoney.keplr.app:443"]},"cosmos_sdk_version":"v0.42.11"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/rizon':
      route.fulfill(
        create200(
          '{"chain":{"enabled":true,"chain_name":"rizon","logo":"https://storage.googleapis.com/emeris/logos/rizon.svg","display_name":"Rizon","primary_channel":{},"denoms":[{"name":"uatolo","display_name":"ATOLO","logo":"https://storage.googleapis.com/emeris/logos/rizon.svg","precision":6,"verified":true,"stakable":true,"ticker":"ATOLO","price_id":"rizon","fee_token":true,"gas_price_levels":{"low":0.00025,"average":0.0003,"high":0.0005},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":42}],"demeris_addresses":["feeaddress"],"genesis_hash":"genesis_hash","node_info":{"endpoint":"rizon","chain_id":"titan-1","bech32_config":{"main_prefix":"rizon","prefix_account":"rizon","prefix_validator":"val","prefix_consensus":"cons","prefix_public":"pub","prefix_operator":"oper","acc_addr":"rizon","acc_pub":"rizonpub","val_addr":"rizonvaloper","val_pub":"rizonvaloperpub","cons_addr":"rizonvalcons","cons_pub":"rizonvalconspub"}},"valid_block_thresh":"20s","derivation_path":"m/44\'/118\'/0\'/0/0","supported_wallets":["keplr"],"block_explorer":"https://www.mintscan.io/rizon","public_node_endpoints":{"tendermint_rpc":["http://seed-1.mainnet.rizon.world:26657"],"cosmos_api":["http://seed-1.mainnet.rizon.world:1317"]},"cosmos_sdk_version":"v0.42.9"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/cheqd':
      route.fulfill(
        create200(
          '{"chain":{"enabled":true,"chain_name":"cheqd","logo":"https://storage.googleapis.com/emeris/logos/cheq.svg","display_name":"cheqd","primary_channel":{"cosmos-hub":"channel-1","osmosis":"channel-0"},"denoms":[{"name":"ncheq","display_name":"CHEQ","logo":"https://storage.googleapis.com/emeris/logos/cheq.svg","precision":9,"verified":true,"stakable":true,"ticker":"CHEQ","price_id":"cheqd-network","fee_token":true,"gas_price_levels":{"low":25,"average":30,"high":50},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":42}],"demeris_addresses":["feeaddress"],"genesis_hash":"genesis_hash","node_info":{"endpoint":"cheqd","chain_id":"cheqd-mainnet-1","bech32_config":{"main_prefix":"cheqd","prefix_account":"cheqd","prefix_validator":"val","prefix_consensus":"cons","prefix_public":"pub","prefix_operator":"oper","acc_addr":"cheqd","acc_pub":"cheqdpub","val_addr":"cheqdvaloper","val_pub":"cheqdvaloperpub","cons_addr":"cheqdvalcons","cons_pub":"cheqdvalconspub"}},"valid_block_thresh":"20s","derivation_path":"m/44\'/118\'/0\'/0/0","supported_wallets":["keplr"],"block_explorer":"https://explorer.cheqd.io","public_node_endpoints":{"tendermint_rpc":["https://rpc.cheqd.net:443"],"cosmos_api":["https://api.cheqd.net:443"]},"cosmos_sdk_version":"v0.44.5"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/lum':
      route.fulfill(
        create200(
          '{"chain":{"enabled":true,"chain_name":"lum","logo":"https://storage.googleapis.com/emeris/logos/lum.svg","display_name":"lum","primary_channel":{"osmosis":"channel-3"},"denoms":[{"name":"ulum","display_name":"LUM","logo":"https://storage.googleapis.com/emeris/logos/lum.svg","precision":6,"verified":true,"stakable":true,"ticker":"LUM","price_id":"lum-network","fee_token":true,"gas_price_levels":{"low":0.03,"average":0.075,"high":0.12},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":50000000}],"demeris_addresses":["feeaddress"],"genesis_hash":"genesis_hash","node_info":{"endpoint":"lum","chain_id":"lum-network-1","bech32_config":{"main_prefix":"lum","prefix_account":"lum","prefix_validator":"val","prefix_consensus":"cons","prefix_public":"pub","prefix_operator":"oper","acc_addr":"lum","acc_pub":"lumpub","val_addr":"lumvaloper","val_pub":"lumvaloperpub","cons_addr":"lumvalcons","cons_pub":"lumvalconspub"}},"valid_block_thresh":"30s","derivation_path":"m/44\'/880\'/0\'/0/0","supported_wallets":["keplr"],"block_explorer":"https://www.mintscan.io/lum","public_node_endpoints":{"tendermint_rpc":["https://node0.mainnet.lum.network:443/rpc"],"cosmos_api":["https://node0.mainnet.lum.network:443/rest"]},"cosmos_sdk_version":"v0.44.5"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/chihuahua':
      route.fulfill(
        create200(
          '{"chain":{"enabled":true,"chain_name":"chihuahua","logo":"https://app.osmosis.zone/public/assets/tokens/huahua.png","display_name":"Chihuahua","primary_channel":{"juno":"channel-11","osmosis":"channel-7"},"denoms":[{"name":"uhuahua","display_name":"HUAHUA","logo":"https://storage.googleapis.com/emeris/logos/huahua.svg","precision":6,"verified":true,"stakable":true,"ticker":"HUAHUA","price_id":"chihuahua-token","fee_token":true,"gas_price_levels":{"low":0.01,"average":0.025,"high":0.03},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":42}],"demeris_addresses":["feeaddress"],"genesis_hash":"genesis_hash","node_info":{"endpoint":"chihuahua","chain_id":"chihuahua-1","bech32_config":{"main_prefix":"chihuahua","prefix_account":"chihuahua","prefix_validator":"val","prefix_consensus":"cons","prefix_public":"pub","prefix_operator":"oper","acc_addr":"chihuahua","acc_pub":"chihuahuapub","val_addr":"chihuahuavaloper","val_pub":"chihuahuavaloperpub","cons_addr":"chihuahuavalcons","cons_pub":"chihuahuavalconspub"}},"valid_block_thresh":"20s","derivation_path":"m/44\'/639\'/0\'/0/0","supported_wallets":["keplr"],"block_explorer":"https://www.mintscan.io/chihuahua","public_node_endpoints":{"tendermint_rpc":["https://rpc.chihuahua.wtf:443"],"cosmos_api":["https://api.chihuahua.wtf:443"]},"cosmos_sdk_version":"v0.44.3"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/likecoin':
      route.fulfill(
        create200(
          '{"chain":{"enabled":true,"chain_name":"likecoin","logo":"https://storage.googleapis.com/emeris/logos/likecoin.svg","display_name":"LikeCoin","primary_channel":{"cosmos-hub":"channel-5","osmosis":"channel-3"},"denoms":[{"name":"nanolike","display_name":"LIKE","logo":"https://storage.googleapis.com/emeris/logos/likecoin.svg","precision":9,"verified":true,"stakable":true,"ticker":"LIKE","price_id":"likecoin","fee_token":true,"gas_price_levels":{"low":4,"average":4,"high":10},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":60000000}],"demeris_addresses":["feeaddress"],"genesis_hash":"genesis_hash","node_info":{"endpoint":"cosmos","chain_id":"likecoin-mainnet-2","bech32_config":{"main_prefix":"cosmos","prefix_account":"cosmos","prefix_validator":"val","prefix_consensus":"cons","prefix_public":"pub","prefix_operator":"oper","acc_addr":"cosmos","acc_pub":"cosmospub","val_addr":"cosmosvaloper","val_pub":"cosmosvaloperpub","cons_addr":"cosmosvalcons","cons_pub":"cosmosvalconspub"}},"valid_block_thresh":"20s","derivation_path":"m/44\'/118\'/0\'/0/0","supported_wallets":["keplr"],"block_explorer":"https://likecoin.bigdipper.live/","public_node_endpoints":{"tendermint_rpc":["https://mainnet-node.like.co:443/rpc/"],"cosmos_api":["https://mainnet-node.like.co:443"]},"cosmos_sdk_version":"v0.42.9"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/comdex':
      route.fulfill(
        create200(
          '{"chain":{"enabled":true,"chain_name":"comdex","logo":"https://storage.googleapis.com/emeris/logos/comdex.svg","display_name":"Comdex","primary_channel":{"osmosis":"channel-1"},"denoms":[{"name":"ucmdx","display_name":"Comdex","logo":"https://storage.googleapis.com/emeris/logos/comdex.svg","precision":6,"verified":true,"stakable":true,"ticker":"CMDX","price_id":"comdex","fee_token":true,"gas_price_levels":{"low":0.25,"average":0.3,"high":0.5},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":42}],"demeris_addresses":["feeaddress"],"genesis_hash":"genesis_hash","node_info":{"endpoint":"comdex","chain_id":"comdex-1","bech32_config":{"main_prefix":"comdex","prefix_account":"comdex","prefix_validator":"val","prefix_consensus":"cons","prefix_public":"pub","prefix_operator":"oper","acc_addr":"comdex","acc_pub":"comdexpub","val_addr":"comdexvaloper","val_pub":"comdexvaloperpub","cons_addr":"comdexvalcons","cons_pub":"comdexvalconspub"}},"valid_block_thresh":"20s","derivation_path":"m/44\'/118\'/0\'/0/0","supported_wallets":["keplr"],"block_explorer":"https://www.mintscan.io/comdex","public_node_endpoints":{"tendermint_rpc":["https://rpc.comdex.one:443"],"cosmos_api":["https://rest.comdex.one:443"]},"cosmos_sdk_version":"v0.45.1"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/bitcanna':
      route.fulfill(
        create200(
          '{"chain":{"enabled":true,"chain_name":"bitcanna","logo":"https://storage.googleapis.com/emeris/logos/bitcanna.svg","display_name":"BitCanna","primary_channel":{"cosmos-hub":"channel-3","osmosis":"channel-1"},"denoms":[{"name":"ubcna","display_name":"BCNA","logo":"https://storage.googleapis.com/emeris/logos/bitcanna.svg","precision":6,"verified":true,"stakable":true,"ticker":"BCNA","price_id":"bitcanna","fee_token":true,"gas_price_levels":{"low":0.25,"average":0.25,"high":0.5},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":42}],"demeris_addresses":["feeaddress"],"genesis_hash":"genesis_hash","node_info":{"endpoint":"bcna","chain_id":"bitcanna-1","bech32_config":{"main_prefix":"bcna","prefix_account":"bcna","prefix_validator":"val","prefix_consensus":"cons","prefix_public":"pub","prefix_operator":"oper","acc_addr":"bcna","acc_pub":"bcnapub","val_addr":"bcnavaloper","val_pub":"bcnavaloperpub","cons_addr":"bcnavalcons","cons_pub":"bcnavalconspub"}},"valid_block_thresh":"20s","derivation_path":"m/44\'/118\'/0\'/0/0","supported_wallets":["keplr"],"block_explorer":"https://www.mintscan.io/bitcanna","public_node_endpoints":{"tendermint_rpc":["https://rpc.bitcanna.io:443"],"cosmos_api":["https://lcd.bitcanna.io:443"]},"cosmos_sdk_version":"v0.44.3"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/sifchain':
      route.fulfill(
        create200(
          '{"chain":{"enabled":true,"chain_name":"sifchain","logo":"https://storage.googleapis.com/emeris/logos/rowan.svg","display_name":"Sifchain","primary_channel":{"akash":"channel-2","cosmos-hub":"channel-0","crypto-org":"channel-9","emoney":"channel-19","iris":"channel-8","juno":"channel-14","osmosis":"channel-17","persistence":"channel-7","regen":"channel-10","sentinel":"channel-1"},"denoms":[{"name":"rowan","display_name":"ROWAN","logo":"https://storage.googleapis.com/emeris/logos/rowan.svg","precision":18,"verified":true,"stakable":true,"ticker":"EROWAN","price_id":"sifchain","fee_token":true,"gas_price_levels":{"low":250000000000,"average":500000000000,"high":1000000000000},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":50000000}],"demeris_addresses":["feeaddress"],"genesis_hash":"genesis_hash","node_info":{"endpoint":"sifchain","chain_id":"sifchain-1","bech32_config":{"main_prefix":"sif","prefix_account":"sif","prefix_validator":"val","prefix_consensus":"cons","prefix_public":"pub","prefix_operator":"oper","acc_addr":"sif","acc_pub":"sifpub","val_addr":"sifvaloper","val_pub":"sifvaloperpub","cons_addr":"sifvalcons","cons_pub":"sifvalconspub"}},"valid_block_thresh":"30s","derivation_path":"m/44\'/118\'/0\'/0/0","supported_wallets":["keplr"],"block_explorer":"https://www.mintscan.io/sifchain","public_node_endpoints":{"tendermint_rpc":["https://rpc.sifchain.finance:443"],"cosmos_api":["https://api.sifchain.finance:443"]},"cosmos_sdk_version":"v0.44.5"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/sommelier':
      route.fulfill(
        create200(
          '{"chain":{"enabled":true,"chain_name":"sommelier","logo":"https://storage.googleapis.com/emeris/logos/somm.svg","display_name":"sommelier","primary_channel":{"osmosis":"channel-0"},"denoms":[{"name":"usomm","display_name":"SOMM","logo":"https://storage.googleapis.com/emeris/logos/somm.svg","precision":6,"verified":true,"stakable":true,"ticker":"SOMM","price_id":"sommelier","fee_token":true,"gas_price_levels":{"low":0.03,"average":0.075,"high":0.12},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":50000000}],"demeris_addresses":["feeaddress"],"genesis_hash":"genesis_hash","node_info":{"endpoint":"sommelier","chain_id":"sommelier-3","bech32_config":{"main_prefix":"somm","prefix_account":"somm","prefix_validator":"val","prefix_consensus":"cons","prefix_public":"pub","prefix_operator":"oper","acc_addr":"somm","acc_pub":"sommpub","val_addr":"sommvaloper","val_pub":"sommvaloperpub","cons_addr":"sommvalcons","cons_pub":"sommvalconspub"}},"valid_block_thresh":"30s","derivation_path":"m/44\'/118\'/0\'/0/0","supported_wallets":["keplr"],"block_explorer":"https://sommscan.io","public_node_endpoints":{"tendermint_rpc":["https://rpc-sommelier.keplr.app:443"],"cosmos_api":["https://lcd-sommelier.keplr.app:443"]},"cosmos_sdk_version":"v0.44.5"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/akash':
      route.fulfill(
        create200(
          '{"chain":{"enabled":true,"chain_name":"akash","logo":"https://storage.googleapis.com/emeris/logos/akash.svg","display_name":"Akash","primary_channel":{"cosmos-hub":"channel-17","osmosis":"channel-9","sifchain":"channel-24"},"denoms":[{"name":"uakt","display_name":"AKT","logo":"https://storage.googleapis.com/emeris/logos/akash.svg","precision":6,"verified":true,"stakable":true,"ticker":"AKT","price_id":"akash-network","fee_token":true,"gas_price_levels":{"low":0.036,"average":0.09,"high":0.108},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":40000000}],"demeris_addresses":["feeaddress"],"genesis_hash":"genesis_hash","node_info":{"endpoint":"akash","chain_id":"akashnet-2","bech32_config":{"main_prefix":"akash","prefix_account":"akash","prefix_validator":"val","prefix_consensus":"cons","prefix_public":"pub","prefix_operator":"oper","acc_addr":"akash","acc_pub":"akashpub","val_addr":"akashvaloper","val_pub":"akashvaloperpub","cons_addr":"akashvalcons","cons_pub":"akashvalconspub"}},"valid_block_thresh":"30s","derivation_path":"m/44\'/118\'/0\'/0/0","supported_wallets":["keplr"],"block_explorer":"https://www.mintscan.io/akash","public_node_endpoints":{"tendermint_rpc":["https://rpc-akash.ecostake.com:443"],"cosmos_api":["https://rest-akash.ecostake.com:443"]},"cosmos_sdk_version":"v0.44.5"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/cosmos-hub':
      route.fulfill(
        create200(
          '{"chain":{"enabled":true,"chain_name":"cosmos-hub","logo":"https://storage.googleapis.com/emeris/logos/atom.svg","display_name":"Cosmos Hub","primary_channel":{"akash":"channel-184","bitcanna":"channel-232","bitsong":"channel-229","cheqd":"channel-239","chihuahua":"channel-229","crypto-org":"channel-187","emoney":"channel-202","iris":"channel-182","ixo":"channel-204","juno":"channel-207","ki":"channel-223","likecoin":"channel-217","microtick":"channel-201","osmosis":"channel-141","persistence":"channel-190","regen":"channel-185","sentinel":"channel-186","sifchain":"channel-192","starname":"channel-158","terra":"channel-219"},"denoms":[{"name":"poolE71FE13681A283B7015E4E4C4852B0EDA72CC97A5CDE2ECA2A6C8C06C86AC775","display_name":"Gravity 2","precision":6,"verified":true,"ticker":"G2","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false},{"name":"poolDFB8434D5A80B4EAFA94B6878BD5B85265AC6C5D37204AB899B1C3C52543DA7E","display_name":"Gravity 1","precision":6,"verified":true,"ticker":"G1","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false},{"name":"uatom","display_name":"ATOM","logo":"https://storage.googleapis.com/emeris/logos/atom.svg","precision":6,"verified":true,"stakable":true,"ticker":"ATOM","price_id":"cosmos","fee_token":true,"gas_price_levels":{"low":0.005,"average":0.01,"high":0.03},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":10000000},{"name":"poolD639A99414646D7136C65C6845D0EB3456EDD3D6C2C43050D3FA3A24995B0E75","display_name":"Gravity 3","precision":6,"verified":true,"ticker":"G3","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false},{"name":"pool2B9C24833CAA268C9081EC251693A724E8D343FC25A841FF00FD37B047BA4DEA","display_name":"Gravity 4","precision":6,"verified":true,"ticker":"G4","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false},{"name":"pool32DD066BE949E5FDCC7DC09EBB67C7301D0CA957C2EF56A39B37430165447DAC","display_name":"Gravity 5","precision":6,"verified":true,"ticker":"G5","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false},{"name":"pool4BFAFC499776D30A4FA0D6033135F00CC4EFC770D19A74CAD37433B579F77FC0","display_name":"Gravity 6","precision":6,"verified":true,"ticker":"G6","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false},{"name":"pool7AE391C099D1D88CC85A9FA8A0DC5650BF8DDE0DCE7D0824C073802C020A7747","display_name":"Gravity 7","precision":6,"verified":true,"ticker":"G7","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false},{"name":"poolF2805980C54E1474BDCCF70EF5FE881F3B8EFCF8BA3198765C01D91904521788","display_name":"Gravity 8","precision":6,"verified":true,"ticker":"G8","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false},{"name":"poolBD5F1AF7A8B1F068C178F1D637DF126968EC10AB204A10116E320B2B8AF4FAC2","display_name":"Gravity 9","precision":6,"verified":true,"ticker":"G9","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false},{"name":"poolB457CE9240C221C0F76952FED6506F74375EDD38B32A6020B7DDDFD5A4867D5C","display_name":"Gravity 10","precision":6,"verified":true,"ticker":"G10","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false},{"name":"poolD1121E78E731AFD35FEA13CF9FA0044A1472F73A0EE784160CCAAAAE5C7AAD7E","display_name":"Gravity 11","precision":6,"verified":true,"ticker":"G11","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false},{"name":"pool60EFB07817D6B193A9FADA611404B8E11D82D6B7F0D10D57D3134C93E2BF7414","display_name":"Gravity 12","precision":6,"verified":true,"ticker":"G12","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false},{"name":"poolCF8B847997F5EB92B9C8DBAE41656F61D6BE708B1B42D31063291813014AD63F","display_name":"Gravity 13","precision":6,"verified":true,"ticker":"G13","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false},{"name":"poolAC9AF7B48E4497A0A9AF109E4286464A0EF06E7C35AD79198F03AB17A6A4CCA7","display_name":"Gravity 14","precision":6,"verified":true,"ticker":"G14","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false},{"name":"poolFD005C5AB01714A4B62E87F5213F5D5CDE357773D70712916A93664BCE5A6931","display_name":"Gravity 15","precision":6,"verified":true,"ticker":"G15","gas_price_levels":{"low":0,"average":0,"high":0},"fetch_price":false,"relayer_denom":false}],"demeris_addresses":["feeaddress"],"genesis_hash":"genesis_hash","node_info":{"endpoint":"cosmos-hub","chain_id":"cosmoshub-4","bech32_config":{"main_prefix":"cosmos","prefix_account":"cosmos","prefix_validator":"val","prefix_consensus":"cons","prefix_public":"pub","prefix_operator":"oper","acc_addr":"cosmos","acc_pub":"cosmospub","val_addr":"cosmosvaloper","val_pub":"cosmosvaloperpub","cons_addr":"cosmosvalcons","cons_pub":"cosmosvalconspub"}},"valid_block_thresh":"30s","derivation_path":"m/44\'/118\'/0\'/0/0","supported_wallets":["keplr"],"block_explorer":"https://www.mintscan.io/cosmos","public_node_endpoints":{"tendermint_rpc":["https://rpc-cosmoshub.blockapsis.com:443"],"cosmos_api":["https://lcd-cosmoshub.blockapsis.com:443"]},"cosmos_sdk_version":"v0.44.5"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/crypto-org':
      route.fulfill(
        create200(
          '{"chain":{"enabled":true,"chain_name":"crypto-org","logo":"https://storage.googleapis.com/emeris/logos/crypto-com.svg","display_name":"Crypto.org","primary_channel":{"cosmos-hub":"channel-27","osmosis":"channel-10","sifchain":"channel-33"},"denoms":[{"name":"basecro","display_name":"CRO","logo":"https://storage.googleapis.com/emeris/logos/crypto-com.svg","precision":8,"verified":true,"stakable":true,"ticker":"CRO","price_id":"crypto-com-chain","fee_token":true,"gas_price_levels":{"low":0.025,"average":0.03,"high":0.04},"fetch_price":true,"relayer_denom":true,"minimum_thresh_relayer_balance":850000000}],"demeris_addresses":["feeaddress"],"genesis_hash":"genesis_hash","node_info":{"endpoint":"crypto-org","chain_id":"crypto-org-chain-mainnet-1","bech32_config":{"main_prefix":"cro","prefix_account":"cro","prefix_validator":"cncl","prefix_consensus":"cons","prefix_public":"pub","prefix_operator":"​","acc_addr":"cro","acc_pub":"cropub","val_addr":"crocncl​","val_pub":"crocncl​pub","cons_addr":"crocnclcons","cons_pub":"crocnclconspub"}},"valid_block_thresh":"30s","derivation_path":"m/44\'/394\'/0\'/0/0","supported_wallets":["keplr"],"block_explorer":"https://www.mintscan.io/crypto-org","public_node_endpoints":{"tendermint_rpc":["https://rpc-crypto-org.keplr.app:443"],"cosmos_api":["https://lcd-crypto-org.keplr.app:443"]},"cosmos_sdk_version":"v0.44.5"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/persistence/status':
      route.fulfill(create200('{"online":true }'));
      return;
    case 'https://api.emeris.com/v1/chain/iris/status':
      route.fulfill(create200('{"online":true }'));
      return;
    case 'https://api.emeris.com/v1/chain/osmosis/status':
      route.fulfill(create200('{"online":true }'));
      return;
    case 'https://api.emeris.com/v1/chain/regen/status':
      route.fulfill(create200('{"online":true }'));
      return;
    case 'https://api.emeris.com/v1/chain/microtick/status':
      route.fulfill(create200('{"online":true }'));
      return;
    case 'https://api.emeris.com/v1/chain/sentinel/status':
      route.fulfill(create200('{"online":true }'));
      return;
    case 'https://api.emeris.com/v1/chain/ixo/status':
      route.fulfill(create200('{"online":true }'));
      return;
    case 'https://api.emeris.com/v1/chain/ki/status':
      route.fulfill(create200('{"online":true }'));
      return;
    case 'https://api.emeris.com/v1/chain/juno/status':
      route.fulfill(create200('{"online":true }'));
      return;
    case 'https://api.emeris.com/v1/chain/bitsong/status':
      route.fulfill(create200('{"online":true }'));
      return;
    case 'https://api.emeris.com/v1/chain/desmos/status':
      route.fulfill(create200('{"online":true }'));
      return;
    case 'https://api.emeris.com/v1/chain/emoney/status':
      route.fulfill(create200('{"online":true }'));
      return;
    case 'https://api.emeris.com/v1/chain/rizon/status':
      route.fulfill(create200('{"online":true }'));
      return;
    case 'https://api.emeris.com/v1/chain/cheqd/status':
      route.fulfill(create200('{"online":true }'));
      return;
    case 'https://api.emeris.com/v1/chain/lum/status':
      route.fulfill(create200('{"online":true }'));
      return;
    case 'https://api.emeris.com/v1/chain/chihuahua/status':
      route.fulfill(create200('{"online":true }'));
      return;
    case 'https://api.emeris.com/v1/chain/likecoin/status':
      route.fulfill(create200('{"online":true }'));
      return;
    case 'https://api.emeris.com/v1/chain/comdex/status':
      route.fulfill(create200('{"online":true }'));
      return;
    case 'https://api.emeris.com/v1/chain/bitcanna/status':
      route.fulfill(create200('{"online":true }'));
      return;
    case 'https://api.emeris.com/v1/chain/sifchain/status':
      route.fulfill(create200('{"online":true }'));
      return;
    case 'https://api.emeris.com/v1/chain/sommelier/status':
      route.fulfill(create200('{"online":true }'));
      return;
    case 'https://api.emeris.com/v1/chain/akash/status':
      route.fulfill(create200('{"online":true }'));
      return;
    case 'https://api.emeris.com/v1/chain/cosmos-hub/status':
      route.fulfill(create200('{"online":true }'));
      return;
    case 'https://api.emeris.com/v1/chain/crypto-org/status':
      route.fulfill(create200('{"online":true }'));
      return;
    case 'https://api.emeris.com/v1/oracle/prices':
      route.fulfill(
        create200(
          '{"data":{"Tokens":[{"Symbol":"AKTUSDT","Price":1.27,"Supply":155084777.843337},{"Symbol":"ATOLOUSDT","Price":0.0370808,"Supply":2174843709.22984},{"Symbol":"ATOMUSDT","Price":27.28,"Supply":292220476.401992},{"Symbol":"BCNAUSDT","Price":0.077357,"Supply":0},{"Symbol":"BTSGUSDT","Price":0.098383,"Supply":71322585.323597},{"Symbol":"CHEQUSDT","Price":0.093347,"Supply":0},{"Symbol":"CMDXUSDT","Price":1.18,"Supply":24072464.9307075},{"Symbol":"CROUSDT","Price":0.443898,"Supply":25263013692},{"Symbol":"DSMUSDT","Price":0.197041,"Supply":0},{"Symbol":"DVPNUSDT","Price":0.00401738,"Supply":7709314713.87425},{"Symbol":"EROWANUSDT","Price":0.10532,"Supply":933537256.93813},{"Symbol":"HUAHUAUSDT","Price":0.00084569,"Supply":0},{"Symbol":"IONUSDT","Price":4514.56,"Supply":21294},{"Symbol":"IOVUSDT","Price":0.03628286,"Supply":134963184.926895},{"Symbol":"IRISUSDT","Price":0.0667545,"Supply":1261352611.17844},{"Symbol":"IXOUSDT","Price":0.361047,"Supply":0},{"Symbol":"JUNOUSDT","Price":22.39,"Supply":47011670.194817},{"Symbol":"LIKEUSDT","Price":0.01655071,"Supply":1094646589.03287},{"Symbol":"LUMUSDT","Price":0.00914366,"Supply":0},{"Symbol":"LUNAUSDT","Price":104.15,"Supply":0},{"Symbol":"NGMUSDT","Price":1.1,"Supply":52767073.835489},{"Symbol":"OSMOUSDT","Price":7.35,"Supply":339176698},{"Symbol":"REGENUSDT","Price":0.806059,"Supply":125114520.004714},{"Symbol":"SOMMUSDT","Price":1.75,"Supply":0},{"Symbol":"STARSUSDT","Price":0.180442,"Supply":744977350.362096},{"Symbol":"TICKUSDT","Price":2.07,"Supply":647718.768946},{"Symbol":"XKIUSDT","Price":0.167536,"Supply":206131280},{"Symbol":"XPRTUSDT","Price":3.21,"Supply":96498102.432704}],"Fiats":[{"Symbol":"USDEUR","Price":0.91866},{"Symbol":"USDUSD","Price":1}]},"message":null,"status":200}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/account/11443b6ca513a08d65a18aee27803d8c1e3b8881/balance': //cro 394
      route.fulfill(
        create200(
          '{"balances":[{"address":"11443b6ca513a08d65a18aee27803d8c1e3b8881","base_denom":"basecro","verified":true,"amount":"33114664255basecro","on_chain":"crypto-org","ibc":{}}]}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/account/742bdcf890fd4ba957350d90f27441b275320fb6/balance': //hub 118
      route.fulfill(
        create200(
          '{"balances":[{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"udvpn","verified":true,"amount":"2364757569udvpn","on_chain":"sentinel","ibc":{}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"ubcna","verified":true,"amount":"11326460ubcna","on_chain":"bitcanna","ibc":{}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"uregen","verified":true,"amount":"10100458uregen","on_chain":"regen","ibc":{}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"uatom","verified":true,"amount":"100000ibc/5FEB332D2B121921C792F1A0DBF7C3163FF205337B4AFE6E14F69E8E49545F49","on_chain":"regen","ibc":{"path":"transfer/channel-11","hash":"5FEB332D2B121921C792F1A0DBF7C3163FF205337B4AFE6E14F69E8E49545F49"}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"uxki","verified":true,"amount":"1081100uxki","on_chain":"ki","ibc":{}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"uiris","verified":true,"amount":"196626041uiris","on_chain":"iris","ibc":{}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"ncheq","verified":true,"amount":"1817689703ncheq","on_chain":"cheqd","ibc":{}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"nanolike","verified":true,"amount":"1893998000nanolike","on_chain":"likecoin","ibc":{}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"ujuno","verified":true,"amount":"132758ujuno","on_chain":"juno","ibc":{}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"uxprt","verified":true,"amount":"450156ibc/81D08BC39FB520EBD948CF017910DD69702D34BF5AC160F76D3B5CFC444EBCE0","on_chain":"cosmos-hub","ibc":{"path":"transfer/channel-190","hash":"81D08BC39FB520EBD948CF017910DD69702D34BF5AC160F76D3B5CFC444EBCE0"}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"uatom","verified":true,"amount":"2676390uatom","on_chain":"cosmos-hub","ibc":{}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"udvpn","verified":true,"amount":"182586863ibc/42E47A5BA708EBE6E0C227006254F2784E209F4DBD3C6BB77EDC4B29EF875E8E","on_chain":"cosmos-hub","ibc":{"path":"transfer/channel-186","hash":"42E47A5BA708EBE6E0C227006254F2784E209F4DBD3C6BB77EDC4B29EF875E8E"}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"basecro","verified":true,"amount":"7482924822ibc/C932ADFE2B4216397A4F17458B6E4468499B86C3BC8116180F85D799D6F5CC1B","on_chain":"cosmos-hub","ibc":{"path":"transfer/channel-187","hash":"C932ADFE2B4216397A4F17458B6E4468499B86C3BC8116180F85D799D6F5CC1B"}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"poolF2805980C54E1474BDCCF70EF5FE881F3B8EFCF8BA3198765C01D91904521788","verified":true,"amount":"8poolF2805980C54E1474BDCCF70EF5FE881F3B8EFCF8BA3198765C01D91904521788","on_chain":"cosmos-hub","ibc":{}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"poolDFB8434D5A80B4EAFA94B6878BD5B85265AC6C5D37204AB899B1C3C52543DA7E","verified":true,"amount":"6276poolDFB8434D5A80B4EAFA94B6878BD5B85265AC6C5D37204AB899B1C3C52543DA7E","on_chain":"cosmos-hub","ibc":{}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"uiris","verified":true,"amount":"17929472ibc/12DA42304EE1CE96071F712AA4D58186AD11C3165C0DCDA71E017A54F3935E66","on_chain":"cosmos-hub","ibc":{"path":"transfer/channel-182","hash":"12DA42304EE1CE96071F712AA4D58186AD11C3165C0DCDA71E017A54F3935E66"}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"pool7AE391C099D1D88CC85A9FA8A0DC5650BF8DDE0DCE7D0824C073802C020A7747","verified":true,"amount":"2pool7AE391C099D1D88CC85A9FA8A0DC5650BF8DDE0DCE7D0824C073802C020A7747","on_chain":"cosmos-hub","ibc":{}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"poolD639A99414646D7136C65C6845D0EB3456EDD3D6C2C43050D3FA3A24995B0E75","verified":true,"amount":"374725poolD639A99414646D7136C65C6845D0EB3456EDD3D6C2C43050D3FA3A24995B0E75","on_chain":"cosmos-hub","ibc":{}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"uion","verified":true,"amount":"370ibc/5BB694D466CCF099EF73F165F88472AF51D9C4991EAA42BD1168C5304712CC0D","on_chain":"cosmos-hub","ibc":{"path":"transfer/channel-141","hash":"5BB694D466CCF099EF73F165F88472AF51D9C4991EAA42BD1168C5304712CC0D"}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"uosmo","verified":true,"amount":"197976ibc/14F9BC3E44B8A9C1BE1FB08980FAB87034C9905EF17CF2F5008FC085218811CC","on_chain":"cosmos-hub","ibc":{"path":"transfer/channel-141","hash":"14F9BC3E44B8A9C1BE1FB08980FAB87034C9905EF17CF2F5008FC085218811CC"}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"uakt","verified":true,"amount":"13633399ibc/2181AAB0218EAC24BC9F86BD1364FBBFA3E6E3FCC25E88E3E68C15DC6E752D86","on_chain":"cosmos-hub","ibc":{"path":"transfer/channel-184","hash":"2181AAB0218EAC24BC9F86BD1364FBBFA3E6E3FCC25E88E3E68C15DC6E752D86"}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"uatom","verified":true,"amount":"1758500ibc/2E5D0AC026AC1AFA65A23023BA4F24BB8DDF94F118EDC0BAD6F625BFC557CDED","on_chain":"akash","ibc":{"path":"transfer/channel-17","hash":"2E5D0AC026AC1AFA65A23023BA4F24BB8DDF94F118EDC0BAD6F625BFC557CDED"}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"uakt","verified":true,"amount":"5455139uakt","on_chain":"akash","ibc":{}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"basecro","verified":true,"amount":"1000000ibc/CC6D7AE7F3EFAACC17468060C596A7D1A884856D18C595F748EEE03A42666107","on_chain":"akash","ibc":{"path":"transfer/channel-18","hash":"CC6D7AE7F3EFAACC17468060C596A7D1A884856D18C595F748EEE03A42666107"}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"uosmo","verified":true,"amount":"13523uosmo","on_chain":"osmosis","ibc":{}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"uakt","verified":true,"amount":"10409150ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4","on_chain":"osmosis","ibc":{"path":"transfer/channel-1","hash":"1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4"}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"ubtsg","verified":true,"amount":"151585ibc/4E5444C35610CC76FC94E7F7886B93121175C28262DDFDDE6F84E82BF2425452","on_chain":"osmosis","ibc":{"path":"transfer/channel-73","hash":"4E5444C35610CC76FC94E7F7886B93121175C28262DDFDDE6F84E82BF2425452"}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"uixo","verified":true,"amount":"147270ibc/F3FF7A84A73B62921538642F9797C423D2B4C4ACB3C7FCFFCE7F12AA69909C4B","on_chain":"osmosis","ibc":{"path":"transfer/channel-38","hash":"F3FF7A84A73B62921538642F9797C423D2B4C4ACB3C7FCFFCE7F12AA69909C4B"}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"uatom","verified":true,"amount":"427773ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2","on_chain":"osmosis","ibc":{"path":"transfer/channel-0","hash":"27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2"}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"ujuno","verified":true,"amount":"50000ibc/46B44899322F3CD854D2D46DEEF881958467CDD4B3B10086DA49296BBED94BED","on_chain":"osmosis","ibc":{"path":"transfer/channel-42","hash":"46B44899322F3CD854D2D46DEEF881958467CDD4B3B10086DA49296BBED94BED"}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"usomm","verified":true,"amount":"172115ibc/9BBA9A1C257E971E38C1422780CE6F0B0686F0A3085E2D61118D904BFE0F5F5E","on_chain":"osmosis","ibc":{"path":"transfer/channel-165","hash":"9BBA9A1C257E971E38C1422780CE6F0B0686F0A3085E2D61118D904BFE0F5F5E"}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"uxprt","verified":true,"amount":"70000ibc/A0CC0CF735BFB30E730C70019D4218A1244FF383503FF7579C9201AB93CA9293","on_chain":"osmosis","ibc":{"path":"transfer/channel-4","hash":"A0CC0CF735BFB30E730C70019D4218A1244FF383503FF7579C9201AB93CA9293"}},{"address":"742bdcf890fd4ba957350d90f27441b275320fb6","base_denom":"uregen","verified":true,"amount":"14786550ibc/1DCC8A6CB5689018431323953344A9F6CC4D0BFB261E88C9F7777372C10CD076","on_chain":"osmosis","ibc":{"path":"transfer/channel-8","hash":"1DCC8A6CB5689018431323953344A9F6CC4D0BFB261E88C9F7777372C10CD076"}}]}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/account/de254511a074660debb2b15207489f2fd2813f24/balance': //persistence 750
      route.fulfill(
        create200(
          '{"balances":[{"address":"de254511a074660debb2b15207489f2fd2813f24","base_denom":"uxprt","verified":true,"amount":"136250uxprt","on_chain":"persistence","ibc":{}}]}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/account/ff7659b898e3e6f98328dc702bb503963bfa1801/balance': //bitsong 639
      route.fulfill(
        create200(
          '{"balances":[{"address":"ff7659b898e3e6f98328dc702bb503963bfa1801","base_denom":"ubtsg","verified":true,"amount":"199000ubtsg","on_chain":"bitsong","ibc":{}},{"address":"ff7659b898e3e6f98328dc702bb503963bfa1801","base_denom":"uhuahua","verified":true,"amount":"1839063uhuahua","on_chain":"chihuahua","ibc":{}}]}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/account/d6c5532cd1991081c051926501153665bfc65ee9/balance': //desmos 852
      route.fulfill(
        create200(
          '{"balances":[{"address":"d6c5532cd1991081c051926501153665bfc65ee9","base_denom":"udsm","verified":true,"amount":"97000udsm","on_chain":"desmos","ibc":{}}]}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/account/a3a1f8cc0a6199844b9cd5e5ae4569a66cea39ec/balance': //lum 880
      route.fulfill(create200('{"balances":null}'));
      return;

    case 'https://api.emeris.com/v1/account/11443b6ca513a08d65a18aee27803d8c1e3b8881/stakingbalances': //cro 394
      route.fulfill(create200('{"staking_balances":null}'));
      return;
    case 'https://api.emeris.com/v1/account/742bdcf890fd4ba957350d90f27441b275320fb6/stakingbalances': //hub 118
      route.fulfill(
        create200(
          '{"staking_balances":[{"validator_address":"c7c201d663b56d7458d2f1d3873afa6fe3c75721","amount":"10000.000000000000000000","chain_name":"cosmos-hub"},{"validator_address":"84bff84c7ddad11cb8c07386e91928c5675ca4bc","amount":"10000.000000000000000000","chain_name":"cosmos-hub"},{"validator_address":"a6900494f1f73cdae2baf1c8b88ff5fc0b8a339c","amount":"10001.000097548619401967","chain_name":"cosmos-hub"},{"validator_address":"2eba6ab30ffb8269b785692ecc77d2b983e78f78","amount":"10000.000000000000000000","chain_name":"cosmos-hub"},{"validator_address":"3c9978f5a7f6c44e35ef3aa9a688ed4fa0cb9238","amount":"500000.000000000000000000","chain_name":"akash"},{"validator_address":"c7c201d663b56d7458d2f1d3873afa6fe3c75721","amount":"170000.000000000000000000","chain_name":"osmosis"},{"validator_address":"c11d56394fcfcf9f644779dfb6bc670c10aa4df8","amount":"10000.000000000000000000","chain_name":"osmosis"},{"validator_address":"509c03871bda1d0f9683e64104ea9d625141624f","amount":"10000.000000000000000000","chain_name":"osmosis"}]}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/account/de254511a074660debb2b15207489f2fd2813f24/stakingbalances': //persistence 750
      route.fulfill(create200('{"staking_balances":null}'));
      return;
    case 'https://api.emeris.com/v1/account/ff7659b898e3e6f98328dc702bb503963bfa1801/stakingbalances': //bitsong 639
      route.fulfill(create200('{"staking_balances":null}'));
      return;
    case 'https://api.emeris.com/v1/account/d6c5532cd1991081c051926501153665bfc65ee9/stakingbalances': //desmos 852
      route.fulfill(create200('{"staking_balances":null}'));
      return;
    case 'https://api.emeris.com/v1/account/a3a1f8cc0a6199844b9cd5e5ae4569a66cea39ec/stakingbalances': //lum 880
      route.fulfill(create200('{"staking_balances":null}'));
      return;

    case 'https://api.emeris.com/v1/account/742bdcf890fd4ba957350d90f27441b275320fb6/unbondingdelegations': //cro 394
      route.fulfill(create200('{"unbonding_delegations":null}'));
      return;
    case 'https://api.emeris.com/v1/account/11443b6ca513a08d65a18aee27803d8c1e3b8881/unbondingdelegations': //hub 118
      route.fulfill(create200('{"unbonding_delegations":null}'));
      return;
    case 'https://api.emeris.com/v1/account/de254511a074660debb2b15207489f2fd2813f24/unbondingdelegations': //persistence 750
      route.fulfill(create200('{"unbonding_delegations":null}'));
      return;
    case 'https://api.emeris.com/v1/account/ff7659b898e3e6f98328dc702bb503963bfa1801/unbondingdelegations': //bitsong 639
      route.fulfill(create200('{"unbonding_delegations":null}'));
      return;
    case 'https://api.emeris.com/v1/account/d6c5532cd1991081c051926501153665bfc65ee9/unbondingdelegations': //desmos 852
      route.fulfill(create200('{"unbonding_delegations":null}'));
      return;
    case 'https://api.emeris.com/v1/account/a3a1f8cc0a6199844b9cd5e5ae4569a66cea39ec/unbondingdelegations': //lum 880
      route.fulfill(create200('{"unbonding_delegations":null}'));
      return;
    case 'https://api.emeris.com/v1/liquidity/node_info':
      route.fulfill(
        create200(
          '{"node_info":{"protocol_version":{"p2p":"8","block":"11","app":"0"},"id":"35446215effc686de58df31a7d9b2ca232bdbc46","listen_addr":"tcp://0.0.0.0:26656","network":"cosmoshub-4","version":"0.34.14","channels":"40202122233038606100","moniker":"emeris","other":{"tx_index":"on","rpc_address":"tcp://0.0.0.0:26657"}},"application_version":{"name":"","server_name":"\u003cappd\u003e","version":"","commit":"","build_tags":"","go":"go version go1.17.5 linux/amd64","build_deps":["filippo.io/edwards25519@v1.0.0-beta.2","github.com/99designs/keyring@v1.1.6","github.com/ChainSafe/go-schnorrkel@v0.0.0-20200405005733-88cbf1b4c40d","github.com/Workiva/go-datastructures@v1.0.52","github.com/armon/go-metrics@v0.3.9","github.com/beorn7/perks@v1.0.1","github.com/bgentry/speakeasy@v0.1.0","github.com/btcsuite/btcd@v0.22.0-beta","github.com/cespare/xxhash/v2@v2.1.1","github.com/coinbase/rosetta-sdk-go@v0.6.10","github.com/confio/ics23/go@v0.6.6","github.com/cosmos/cosmos-sdk@v0.44.3 =\u003e github.com/cosmos/cosmos-sdk@v0.44.2","github.com/cosmos/go-bip39@v1.0.0","github.com/cosmos/iavl@v0.17.1","github.com/cosmos/ibc-go/v2@v2.0.0","github.com/davecgh/go-spew@v1.1.1","github.com/desertbit/timer@v0.0.0-20180107155436-c41aec40b27f","github.com/dvsekhvalnov/jose2go@v0.0.0-20200901110807-248326c1351b","github.com/enigmampc/btcutil@v1.0.3-0.20200723161021-e2fb6adb2a25","github.com/felixge/httpsnoop@v1.0.1","github.com/fsnotify/fsnotify@v1.5.1","github.com/go-kit/kit@v0.10.0","github.com/go-logfmt/logfmt@v0.5.0","github.com/godbus/dbus@v0.0.0-20190726142602-4481cbc300e2","github.com/gogo/gateway@v1.1.0","github.com/gogo/protobuf@v1.3.3 =\u003e github.com/regen-network/protobuf@v1.3.3-alpha.regen.1","github.com/golang/protobuf@v1.5.2","github.com/golang/snappy@v0.0.3","github.com/google/btree@v1.0.0","github.com/google/orderedcode@v0.0.1","github.com/gorilla/handlers@v1.5.1","github.com/gorilla/mux@v1.8.0","github.com/gorilla/websocket@v1.4.2","github.com/gravity-devs/liquidity@v1.4.2","github.com/grpc-ecosystem/go-grpc-middleware@v1.3.0","github.com/grpc-ecosystem/grpc-gateway@v1.16.0","github.com/grpc-ecosystem/grpc-gateway/v2@v2.0.1","github.com/gsterjov/go-libsecret@v0.0.0-20161001094733-a6f4afe4910c","github.com/gtank/merlin@v0.1.1","github.com/gtank/ristretto255@v0.1.2","github.com/hashicorp/go-immutable-radix@v1.0.0","github.com/hashicorp/golang-lru@v0.5.4","github.com/hashicorp/hcl@v1.0.0","github.com/hdevalence/ed25519consensus@v0.0.0-20210204194344-59a8610d2b87","github.com/improbable-eng/grpc-web@v0.14.1","github.com/klauspost/compress@v1.11.7","github.com/lib/pq@v1.10.2","github.com/libp2p/go-buffer-pool@v0.0.2","github.com/magiconair/properties@v1.8.5","github.com/mattn/go-isatty@v0.0.14","github.com/matttproud/golang_protobuf_extensions@v1.0.1","github.com/mimoo/StrobeGo@v0.0.0-20181016162300-f8f6d4d2b643","github.com/minio/highwayhash@v1.0.1","github.com/mitchellh/go-homedir@v1.1.0","github.com/mitchellh/mapstructure@v1.4.2","github.com/mtibben/percent@v0.2.1","github.com/pelletier/go-toml@v1.9.4","github.com/pkg/errors@v0.9.1","github.com/pmezard/go-difflib@v1.0.0","github.com/prometheus/client_golang@v1.11.0","github.com/prometheus/client_model@v0.2.0","github.com/prometheus/common@v0.29.0","github.com/prometheus/procfs@v0.6.0","github.com/rakyll/statik@v0.1.7","github.com/rcrowley/go-metrics@v0.0.0-20200313005456-10cdbea86bc0","github.com/regen-network/cosmos-proto@v0.3.1","github.com/rs/cors@v1.7.0","github.com/rs/zerolog@v1.23.0","github.com/spf13/afero@v1.6.0","github.com/spf13/cast@v1.4.1","github.com/spf13/cobra@v1.2.1","github.com/spf13/jwalterweatherman@v1.1.0","github.com/spf13/pflag@v1.0.5","github.com/spf13/viper@v1.8.1","github.com/strangelove-ventures/packet-forward-middleware@v1.0.1","github.com/stretchr/testify@v1.7.0","github.com/subosito/gotenv@v1.2.0","github.com/syndtr/goleveldb@v1.0.1-0.20200815110645-5c35d600f0ca","github.com/tendermint/btcd@v0.1.1","github.com/tendermint/crypto@v0.0.0-20191022145703-50d29ede1e15","github.com/tendermint/go-amino@v0.16.0","github.com/tendermint/tendermint@v0.34.14","github.com/tendermint/tm-db@v0.6.4","golang.org/x/crypto@v0.0.0-20210817164053-32db794688a5","golang.org/x/net@v0.0.0-20210903162142-ad29c8ab022f","golang.org/x/sys@v0.0.0-20211004093028-2c5d950f24ef","golang.org/x/term@v0.0.0-20201126162022-7de9c90e9dd1","golang.org/x/text@v0.3.6","google.golang.org/genproto@v0.0.0-20210602131652-f16073e35f0c","google.golang.org/grpc@v1.40.0 =\u003e google.golang.org/grpc@v1.33.2","google.golang.org/protobuf@v1.27.1","gopkg.in/ini.v1@v1.63.2","gopkg.in/yaml.v2@v2.4.0","gopkg.in/yaml.v3@v3.0.0-20210107192922-496545a6307b","nhooyr.io/websocket@v1.8.6"],"cosmos_sdk_version":"v0.44.3"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/liquidity/cosmos/staking/v1beta1/params':
      route.fulfill(
        create200(
          '{"params": {"unbonding_time": 1814400s","max_validators": 150,"max_entries": ,"historical_entries": 10000,"bond_denom": "uatom"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/liquidity/cosmos/liquidity/v1beta1/pools':
      route.fulfill(
        create200(
          '{"pools":[{"id":"1","type_id":1,"reserve_coin_denoms":["ibc/14F9BC3E44B8A9C1BE1FB08980FAB87034C9905EF17CF2F5008FC085218811CC","uatom"],"reserve_account_address":"cosmos1m7uyxn26sz6w4755k6rch4dc2fj6cmzajkszvn","pool_coin_denom":"poolDFB8434D5A80B4EAFA94B6878BD5B85265AC6C5D37204AB899B1C3C52543DA7E"},{"id":"2","type_id":1,"reserve_coin_denoms":["ibc/68A333688E5B07451F95555F8FE510E43EF9D3D44DF0909964F92081EF9BE5A7","uatom"],"reserve_account_address":"cosmos1uu07zd5p52pmwq27fexys54saknjejt6r0dqjx","pool_coin_denom":"poolE71FE13681A283B7015E4E4C4852B0EDA72CC97A5CDE2ECA2A6C8C06C86AC775"},{"id":"3","type_id":1,"reserve_coin_denoms":["ibc/12DA42304EE1CE96071F712AA4D58186AD11C3165C0DCDA71E017A54F3935E66","ibc/42E47A5BA708EBE6E0C227006254F2784E209F4DBD3C6BB77EDC4B29EF875E8E"],"reserve_account_address":"cosmos16cu6n9q5v3khzdkxt35yt58tx3twm57k2ukak3","pool_coin_denom":"poolD639A99414646D7136C65C6845D0EB3456EDD3D6C2C43050D3FA3A24995B0E75"},{"id":"4","type_id":1,"reserve_coin_denoms":["ibc/81D08BC39FB520EBD948CF017910DD69702D34BF5AC160F76D3B5CFC444EBCE0","uatom"],"reserve_account_address":"cosmos19wwzfqeu4gngeyypasj3dya8yn5dxslu9yzyh3","pool_coin_denom":"pool2B9C24833CAA268C9081EC251693A724E8D343FC25A841FF00FD37B047BA4DEA"},{"id":"5","type_id":1,"reserve_coin_denoms":["ibc/2181AAB0218EAC24BC9F86BD1364FBBFA3E6E3FCC25E88E3E68C15DC6E752D86","uatom"],"reserve_account_address":"cosmos1xtwsv6lff8jlmnracz0tke78xqwse22h4sez9u","pool_coin_denom":"pool32DD066BE949E5FDCC7DC09EBB67C7301D0CA957C2EF56A39B37430165447DAC"},{"id":"6","type_id":1,"reserve_coin_denoms":["ibc/1FBDD58D438B4D04D26CBFB2E722C18984A0F1A52468C4F42F37D102F3D3F399","uatom"],"reserve_account_address":"cosmos1f0a0cjvhwmfs5naq6cpnzd0spnzwl3msjdn737","pool_coin_denom":"pool4BFAFC499776D30A4FA0D6033135F00CC4EFC770D19A74CAD37433B579F77FC0"},{"id":"7","type_id":1,"reserve_coin_denoms":["ibc/42E47A5BA708EBE6E0C227006254F2784E209F4DBD3C6BB77EDC4B29EF875E8E","uatom"],"reserve_account_address":"cosmos10t3ersye68vgejz6n752phzk2zlcmhsdmzg40l","pool_coin_denom":"pool7AE391C099D1D88CC85A9FA8A0DC5650BF8DDE0DCE7D0824C073802C020A7747"},{"id":"8","type_id":1,"reserve_coin_denoms":["ibc/12DA42304EE1CE96071F712AA4D58186AD11C3165C0DCDA71E017A54F3935E66","uatom"],"reserve_account_address":"cosmos172q9nqx9fc28f0wv7u80tl5gruacal8cuw0tzg","pool_coin_denom":"poolF2805980C54E1474BDCCF70EF5FE881F3B8EFCF8BA3198765C01D91904521788"},{"id":"9","type_id":1,"reserve_coin_denoms":["ibc/C932ADFE2B4216397A4F17458B6E4468499B86C3BC8116180F85D799D6F5CC1B","uatom"],"reserve_account_address":"cosmos1h4034aagk8cx3stc78tr0hcjd95wcy9tjk9kpk","pool_coin_denom":"poolBD5F1AF7A8B1F068C178F1D637DF126968EC10AB204A10116E320B2B8AF4FAC2"},{"id":"10","type_id":1,"reserve_coin_denoms":["ibc/5BB694D466CCF099EF73F165F88472AF51D9C4991EAA42BD1168C5304712CC0D","uatom"],"reserve_account_address":"cosmos1k3tuayjqcgsupamf2tldv5r0wsm4ahfclajeas","pool_coin_denom":"poolB457CE9240C221C0F76952FED6506F74375EDD38B32A6020B7DDDFD5A4867D5C"},{"id":"11","type_id":1,"reserve_coin_denoms":["ibc/B2B5AEE174062FA7804AC95223D8169852F8F58962C51C66391C272C838258B7","uatom"],"reserve_account_address":"cosmos16yfpu788xxhaxhl2z08elgqyfg289ae64vvakd","pool_coin_denom":"poolD1121E78E731AFD35FEA13CF9FA0044A1472F73A0EE784160CCAAAAE5C7AAD7E"},{"id":"12","type_id":1,"reserve_coin_denoms":["ibc/E070CE91CC4BD15AEC9B5788C0826755AAD35052A3037E9AC62BE70B4C9A7DBB","uatom"],"reserve_account_address":"cosmos1vrhmq7qh66ce8206mfs3gp9cuywc944h7pq2w3","pool_coin_denom":"pool60EFB07817D6B193A9FADA611404B8E11D82D6B7F0D10D57D3134C93E2BF7414"},{"id":"13","type_id":1,"reserve_coin_denoms":["ibc/DCD1849E20837BC8FB2C252A7AE1D8AA7A1876911EE669E6CE6FDF9FEA54083D","uatom"],"reserve_account_address":"cosmos1e79cg7vh7h4e9wwgmwhyzet0v8ttuuyt3cvtzk","pool_coin_denom":"poolCF8B847997F5EB92B9C8DBAE41656F61D6BE708B1B42D31063291813014AD63F"},{"id":"14","type_id":1,"reserve_coin_denoms":["ibc/1D5826F7EDE6E3B13009FEF994DC9CAAF15CC24CA7A9FF436FFB2E56FD72F54F","uatom"],"reserve_account_address":"cosmos14jd00dywgjt6p2d0zz0y9pjxfg80qmnuc3hlhv","pool_coin_denom":"poolAC9AF7B48E4497A0A9AF109E4286464A0EF06E7C35AD79198F03AB17A6A4CCA7"},{"id":"15","type_id":1,"reserve_coin_denoms":["ibc/ADBEC1A7AC2FEF73E06B066A1C94DAB6C27924EF7EA3F5A43378150009620284","uatom"],"reserve_account_address":"cosmos1l5q9ck4szu22fd3wsl6jz06atn0r2amnqztpaa","pool_coin_denom":"poolFD005C5AB01714A4B62E87F5213F5D5CDE357773D70712916A93664BCE5A6931"}],"pagination":{"next_key":null,"total":"15"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/cached/cosmos/liquidity/v1beta1/params':
      route.fulfill(
        create200(
          '{"params":{"pool_types":[{"id":1,"name":"StandardLiquidityPool","min_reserve_coin_num":2,"max_reserve_coin_num":2,"description":"Standard liquidity pool with pool price function X/Y, ESPM constraint, and two kinds of reserve coins"}],"min_init_deposit_amount":"1000000","init_pool_coin_mint_amount":"1000000","max_reserve_coin_amount":"0","pool_creation_fee":[{"denom":"uatom","amount":"40000000"}],"swap_fee_rate":"0.003000000000000000","withdraw_fee_rate":"0.000000000000000000","max_order_amount_ratio":"0.100000000000000000","unit_batch_height":1,"circuit_breaker_enabled":false}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/cached/cosmos/bank/v1beta1/supply':
      route.fulfill(
        create200(
          '{"supply":[{"denom":"ibc/0030B0AA8A1B9028703B1D17B965FBCBE0136571B854410BFEC3475B1DC765A1","amount":"43210"},{"denom":"ibc/0276EC3A17E2BADE81821D73FE20CB6D71487F151FEE36E159962B8721942F9D","amount":"1000000"},{"denom":"ibc/04F26F89E89475EBEDA75428CD312CF2DF569A3ED0C999CAC1CCA151FF30694A","amount":"5000000000"},{"denom":"ibc/07912C24004932CD561B1751562B22EA787F31F9821568B88F55A8F51D326722","amount":"5000"},{"denom":"ibc/080D7604D9C1960A3562E1AE4E8EA8F30B7813810AE30660D41DD6770B1C5929","amount":"2000000000"},{"denom":"ibc/08822F65D0CE3FD27B35B9E99046CBAB72D731C7991BBC8586E8916F78721FEF","amount":"100000"},{"denom":"ibc/08834A76F4E5AED08690916F61EA12AA71CFD636BBA328062027DF9FA620B7E3","amount":"1"},{"denom":"ibc/0C754B423F325B3C8DEBD837CE7C4CF0D4B0E60BEB710E8C8C2E231769DC357C","amount":"103000"},{"denom":"ibc/0E018ACFCF79C355EBC45DDDB27B03ADB989D1DC976840BAACF81619EE47FDEF","amount":"1000000"},{"denom":"ibc/0EFC9CE517D5C868C23FB91F31B22AA1FA4B63BD7CC583BD5855F45F5DBF99BB","amount":"1"},{"denom":"ibc/0F123D0CF1614D8C6021E9342FF3C84D55B6BC306B2EF05CA07D89F6005BD6B2","amount":"1002000"},{"denom":"ibc/1063D42B186F4305F1A9F65D2C9C817D55357D5B5102E177E6A404AE4CC6D561","amount":"100000"},{"denom":"ibc/12DA42304EE1CE96071F712AA4D58186AD11C3165C0DCDA71E017A54F3935E66","amount":"26224673776419"},{"denom":"ibc/13B770F3AA627CCD99D3275DEF01D74199472BDCAEE01E4C2646059143B47309","amount":"38903328"},{"denom":"ibc/13EB10FAE4E4E30658875B17E1338924D3EDEB8567011C3F61327E6FCBB3EAA6","amount":"9000"},{"denom":"ibc/14F9BC3E44B8A9C1BE1FB08980FAB87034C9905EF17CF2F5008FC085218811CC","amount":"170536177023"},{"denom":"ibc/1514A972E1FDA7311B0BFC9756B8D63AE0945279005D8DCC5751E3476AABB8F6","amount":"9500"},{"denom":"ibc/1542F8DC70E7999691E991E1EDEB1B47E65E3A217B1649D347098EE48ACB580F","amount":"316016824"},{"denom":"ibc/164D296F37491098DBBEB9AD5E53769B07B2A2CEEA43977CA673AA75A75C740A","amount":"6000000000000000000"},{"denom":"ibc/169D83A4FBC7F348FD03BBA25D153802EE1B1056F2718190AD6E00D68BA2EB8E","amount":"500"},{"denom":"ibc/17044DE725FD1979ADA26CA1DF34BDF53D663252B3B50EFE865EC2BE7F152BD8","amount":"90996"},{"denom":"ibc/178F0665CC78FD6ACA40E3ED23A728D96592B29961D3B29CD8F6088CB28D498F","amount":"1000"},{"denom":"ibc/188844D75719178A653C3783421F9731759815FE2D58BD37F612D954308A526E","amount":"1130000293761"},{"denom":"ibc/19DD710119533524061885A6F190B18AF28D9537E2BAE37F32A62C1A25979287","amount":"1000100000000000001"},{"denom":"ibc/19E0FA42DAD7753295D1BDE44B77F7B678CAD8083EFAE043F7D51DF6501EED63","amount":"1777000"},{"denom":"ibc/1A4215832B566E4C2CAE897E4A60EBB9498A5B879DDDA5EC3C21450632D6CD68","amount":"500"},{"denom":"ibc/1B72F641120380AB0B789F6A46B7F33B192A09FF93CBCC299044E7953FF5AC09","amount":"2000"},{"denom":"ibc/1BABB967BF30E33148F16C763D7E534CD6ED7A908930E6FB5BEFC4DE811286C2","amount":"987654"},{"denom":"ibc/1BE91D67775723D3230A9A5AC54BB29B92A5A51B4B8F20BBA37DF1CFA602297C","amount":"2124398358315"},{"denom":"ibc/1C73D5251879C4BB83106E890EE33BF5464D22066FCDCA5ECCA7CC5705AE13D5","amount":"1000000"},{"denom":"ibc/1D40A21B46D4C9FF9DC1F34FEC2DA3C9C9FFA8D9494CAE3089C1E08839F058F9","amount":"500000"},{"denom":"ibc/1D5826F7EDE6E3B13009FEF994DC9CAAF15CC24CA7A9FF436FFB2E56FD72F54F","amount":"9376792745605515"},{"denom":"ibc/1FBDD58D438B4D04D26CBFB2E722C18984A0F1A52468C4F42F37D102F3D3F399","amount":"2403789129948"},{"denom":"ibc/20A7DC8E24709E6F1EE0F4E832C2ED345ADD77425890482A349AE3C43CAC6B2C","amount":"436415001"},{"denom":"ibc/21365569E56F540D26CA846D0947C9DE6E482F9291B0D1F884D5681B745C7462","amount":"100"},{"denom":"ibc/2154552F1CE0EF16FAC73B41A837A7D91DD9D2B6E193B53BE5C15AB78E1CFF40","amount":"1284259"},{"denom":"ibc/2181AAB0218EAC24BC9F86BD1364FBBFA3E6E3FCC25E88E3E68C15DC6E752D86","amount":"2545871361803"},{"denom":"ibc/239D0A5417EB70F4B519A82992900FDD8D51885905C893C9194540DD79261EAE","amount":"4237720"},{"denom":"ibc/23DCE674BC0760CE99F26CBF281ED46F9653ACE3BD490CBBE6103A4D73221637","amount":"2"},{"denom":"ibc/2860A66FFC565B72381D40777FBABC15F121160DBDDFF13FA62852A52FF76BB7","amount":"65431"},{"denom":"ibc/29B5CB3A3CF45C9DD637D85810F69A4C439E359E1C672A1672E04BEA351C1249","amount":"470000"},{"denom":"ibc/2C3E071FC6D2C3C60C55773DCBCDD0C297A75439FF945FE646D49944DAD23862","amount":"1110908"},{"denom":"ibc/2FE3BC121A18E75797637A73EAB543736462549E6E427C368DEBE90C3570312C","amount":"90674487"},{"denom":"ibc/30942D3854C79711654545073D2D6C7A59CA6C87FFD3792CF45EE6E3532B58E9","amount":"1000"},{"denom":"ibc/311A6F75115762F88F2AC7D7110C2694547CACA43110A8B523DEBBE7E6591E1A","amount":"500000"},{"denom":"ibc/3156D8BAD27478B0304EA36CF1D714E4A9BC2196E8038EDB40AC3E37689E7E3F","amount":"351620303"},{"denom":"ibc/33A9D0DEFC6ECAE9A8931D42660C2E74180BEF7C7DEF217E4AAD6D81C18EB06F","amount":"99533000"},{"denom":"ibc/364D5AB672D6E8FCCCF59417CC2F8E66CC7CCA937B68D9D9FF800E141B51523A","amount":"4620936"},{"denom":"ibc/368B2285E53071AD6FA3856E0D19BAA7350CD2654F1BDD780765505FDDDE5DE9","amount":"10"},{"denom":"ibc/36ADA5E5F0BBC173A043098E1752AC0E5ACD7478A9367E63BB7213BA87C95E17","amount":"421389"},{"denom":"ibc/370155D4E21CF406A8942C75970D2C27E51F101C95C60A7AD772A72EE03D7A1C","amount":"80000"},{"denom":"ibc/3792246C7C422C037C603C955F8383B4E32E7555D693344F9A029A67FE221C57","amount":"8500000000000000000"},{"denom":"ibc/393D4E7397A1C3CAB7D8584AE8414E0B9CABE1E60C4F0ED11FC84EE9836816CF","amount":"310248"},{"denom":"ibc/3A1278171A373AF397E56171B443E29D057F5B30955DBA5C5EA920ADC67E99BB","amount":"1"},{"denom":"ibc/3AE129A4129A68BD569B985E887757B4FD0F9E24B86E04ED3917060D32BAF569","amount":"1"},{"denom":"ibc/3BC7B6FD2C952A7C96F1BE408E049F19D8821EACEDDA4FA284BAB37B4854564A","amount":"2000000"},{"denom":"ibc/3DF5EB0F9512B86848E9C0B8333F811A9334DBA68CE13FF425C9AB2D09ECE753","amount":"6368691"},{"denom":"ibc/42E47A5BA708EBE6E0C227006254F2784E209F4DBD3C6BB77EDC4B29EF875E8E","amount":"223070287274659"},{"denom":"ibc/4535E39BCB6F931D492B0B01EB291C470416C7BE195110F1BAF0818E543CFE86","amount":"5000000"},{"denom":"ibc/461B408D03EEAE9A512C8EA8AF934933644BBEB0F78252A22E86E7035625CF64","amount":"1234"},{"denom":"ibc/46D6E12030FF4352A75E6CF2913824B0E37B075B23A19F61A9E573F8007361EA","amount":"1110000"},{"denom":"ibc/4846F4382B7843861B6C5051134397359C8C94B547E8EA43EFAFEF4E5F7B7625","amount":"6610"},{"denom":"ibc/4BAF1EAF87B5D0638D3517FF063774030AA41A62775FB1E9F388349BDF7D1A24","amount":"16001092528"},{"denom":"ibc/4CB51B3B099916162A0F4E1533B0AA18208F7C7D42ACE698C67DC23C9A4C54CD","amount":"832545879"},{"denom":"ibc/4FC4C3DD9E65A4E04C44DF4D205756B58C4D43A660D0900A27C5BEB3B9789294","amount":"5"},{"denom":"ibc/519E831DB5C36338F2D734CAF6CB7FC689B9267E10EE004542732758FB11F6B4","amount":"4835074"},{"denom":"ibc/52BCA95612A4944995CA31F26588ED1B968DA4CFBBE6D3515F9D60328BBE70D1","amount":"51000000"},{"denom":"ibc/52C6EB2F7E9CD1B4E5FCFF1F1941361F90C23CF8FECA747633F6027DE89F118A","amount":"201713721"},{"denom":"ibc/533E5FFC606FD11B8DCA309C66AFD6A1F046EF784A73F323A332CF6823F0EA87","amount":"42290197"},{"denom":"ibc/539EB57BAE88BAC13DB77A040F5649D74C2132879A26D82BF5B77931ED614020","amount":"13"},{"denom":"ibc/54512837405E95DF093B8374925F5033A319D57FF81CEF237C26F2D7E285725E","amount":"3194926"},{"denom":"ibc/54A7F26EE14F45C7491BA0CDCA305EA1E7BE2A4EDD342408F1338F2B9E6EAE88","amount":"1"},{"denom":"ibc/560D0E725FEDF81B11B89FCA67CB18460AFB9D355B136CF9880259ADD0B3341A","amount":"503000000000000091"},{"denom":"ibc/599C557E2B49BDC36752F3C1734C6CF5881722A113300BBB5FF73FB5FFADA1C8","amount":"2"},{"denom":"ibc/5BAC41A24DE0C0703EA1A77866AC86BF1EF4EA71F26F132D1EFEEAF64405AB54","amount":"1070011"},{"denom":"ibc/5BB694D466CCF099EF73F165F88472AF51D9C4991EAA42BD1168C5304712CC0D","amount":"4646522"},{"denom":"ibc/5E642374260C98897D6A145DBCD768557C4237BA023F96B4FFCDD1E30F57A7EC","amount":"1282366"},{"denom":"ibc/5F814F0791F8428693252A0A7278ABBA161C10B23B9F0FF3E97C0F21B9B3607E","amount":"1"},{"denom":"ibc/621EBC891F642B44778FD0E9DACBBC14755280C897DD010AA104889C3FDCED06","amount":"36408532"},{"denom":"ibc/6469BDA6F62C4F4B8F76629FA1E72A02A3D1DD9E2B22DDB3C3B2296DEAD29AB8","amount":"59"},{"denom":"ibc/64C6ED520DF36224B43A629916EA925C8BF13B96A49616CB37164D58514D7EF9","amount":"157244070616"},{"denom":"ibc/66FC28246B9725B037D7D03051762612F0261CB9E151DB4D0D394EA5BA76009B","amount":"100"},{"denom":"ibc/6745F6061F4B0849894223BFF0B9C37F961DFCF509ED5B339C8708228802F841","amount":"1000000"},{"denom":"ibc/68A333688E5B07451F95555F8FE510E43EF9D3D44DF0909964F92081EF9BE5A7","amount":"319552576263"},{"denom":"ibc/69C22F31B25FD51E4712F7E85C29ADDEA49E1C20AF588216787B47729529C5EC","amount":"6782177"},{"denom":"ibc/6A6CBE51D3026873469B7593AC718D70733E43609775AA122AAFBB73F8AD4F7B","amount":"54298990"},{"denom":"ibc/6B55D73EC58C76D0C22D505AEA487F9A0E270B9846C694262536EE348B73CBBE","amount":"3000000"},{"denom":"ibc/6C2BB0FDAE0ABFF0E965BFFCADEB0D9590F4A011A9EE678413B2F2587F05CB8C","amount":"110000"},{"denom":"ibc/6D0A6AB570D4E3E5BF46A3BA4A1FF25A51D5C9E238AC94C187DCD2543F8781EC","amount":"9330000"},{"denom":"ibc/6ED744BDE05629151CCEA1124D641AEFD65D9CA70C985618F57D6BAF0AD514D7","amount":"500000"},{"denom":"ibc/6F69BA08C96F5020D87A2F60C6BEE29B7661511C9CE7A117641BAD3BD29E8401","amount":"2900002"},{"denom":"ibc/70ECFB79E4D5AE52F57DD75B1EC17E048472A40005711DE96FFF1CCE6F4471FE","amount":"500"},{"denom":"ibc/71C2C26A84996D9E86A007E887FB59649808A7473A89E747738EAE1BEC9311DE","amount":"1000"},{"denom":"ibc/7233992585D925B9159DC6456B37FAB42C71D9F5F46FBF6C63520B73C718DEC7","amount":"300010"},{"denom":"ibc/73CD9C0E5A4A255D81CAAD97F931084EFD006E68DE0EB0C2CBAA55F6E3B41691","amount":"1"},{"denom":"ibc/73F4DE2453778EAC29C11815DE2DF6D673B39D3931058767F3B5F2DBA7B69AC8","amount":"489642"},{"denom":"ibc/7680BD78A4B0ECAA2C2E818777E619E30CB1A8744DB74A65BF7D4E51E5C916A2","amount":"100000"},{"denom":"ibc/76E71E69D8B487ECCCF930D24F599B548F1C2F9C8450BE7BEDD53A1F34772ABC","amount":"99"},{"denom":"ibc/77FFA7FB5F19AE6E7091F86AD35714E35FAE82A7794F8A55BDC4E246316D2177","amount":"10806493"},{"denom":"ibc/78D2E72724FD470E451F08AEB65DBC011106CF76A9FFFD0F61D76178914A0970","amount":"990000"}],"pagination":{"next_key":"aWJjLzc5Mzk0QTU2REI4NTRFRjdDRkEzOUM1NDZDNzNFNDFDMTVDREVCMkM5MkJGQjU2NkYzNzc2N0VFMDdBODVENzc=","total":"227"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/cached/cosmos/bank/v1beta1/supply?pagination.key=aWJjLzc5Mzk0QTU2REI4NTRFRjdDRkEzOUM1NDZDNzNFNDFDMTVDREVCMkM5MkJGQjU2NkYzNzc2N0VFMDdBODVENzc%3D':
      route.fulfill(
        create200(
          '{"supply":[{"denom":"ibc/79394A56DB854EF7CFA39C546C73E41C15CDEB2C92BFB566F37767EE07A85D77","amount":"3590"},{"denom":"ibc/7CBFE632599EC3393E43D899E05BF671A41BF388CF333FEDA0595C60E345DA27","amount":"109527257"},{"denom":"ibc/7EFF4F3192C809058AD2E3A6EC040B9E953F3FA949BAE1439D7641D56137F4F5","amount":"100000"},{"denom":"ibc/80321E1F00839E9A38B04007DE79450861D465AFCA869B4CF2D5078A5F320FFA","amount":"225877"},{"denom":"ibc/8062C496F4A92DE517F4FA91A497020564A5B477C7B8FA210F02BE14FA7596F8","amount":"50000"},{"denom":"ibc/81D08BC39FB520EBD948CF017910DD69702D34BF5AC160F76D3B5CFC444EBCE0","amount":"395512700831"},{"denom":"ibc/82D1FDFA1D3D98852CB0394FBB0EA905D64F86FC336A0537DE47659719E53803","amount":"70000000000"},{"denom":"ibc/84DE41E5C6D5B4AAE173757508B84280C4E7CC208BEC958297AB3ABB7C695BA5","amount":"303076"},{"denom":"ibc/854A2B3F3C679598591411883DF60EF216E0DCA83E141808A55D8C4BC8443641","amount":"2456933373"},{"denom":"ibc/857BB744A15CE6E4C423DBD4534F4430C3C364EA04316CFC1A69C7B02102BB9A","amount":"12502000"},{"denom":"ibc/861999A07B9A280A0262C761D2C8E030FDDF9B9E8A09BA8E0A967B0C381BA8E9","amount":"100000"},{"denom":"ibc/8870C4203CEBF2279BA065E3DE95FC3F8E05A4A93424E7DC707A21514BE353A0","amount":"13696500"},{"denom":"ibc/88A897D682D5EA9E42B4715BE062346F5DFBA7283A7A03470AD0DAA1E95D5477","amount":"10"},{"denom":"ibc/8AF3B27A3ABC09F7DD629A647E4DA132D3ACF90678F8D2B3CD79B57A601C4C6C","amount":"600000"},{"denom":"ibc/8C9E8A9EFF706DF9853D5E8BD51AF305F49B7CD2A29F50444CDA711FFFA8DB38","amount":"1010001100"},{"denom":"ibc/8DF0130EDAD6A31B126028A28347FF753A4EAAD655460388D2B170C2CC1D5B42","amount":"1"},{"denom":"ibc/8FC21F2C5E48D572DA1A62043F77B1A6CF6CAED425BB33D2090F64D9E8E0AAFF","amount":"5000000"},{"denom":"ibc/902EB27DB5573282C1200C0E681541C1D4176CF851811530A5B77140777B0769","amount":"3000200"},{"denom":"ibc/90FA33F7AE39F882D4FE99EA95CEAE6337BE30ED0E1FB98544CC8F0723792218","amount":"71000000"},{"denom":"ibc/912694C1B675FD114E5223CE5D8A430FD908DDC0549578FF6C75B01A65A2392A","amount":"25000000100"},{"denom":"ibc/92676DAB5FBF71C5C6E819B065CBF0F2BA3907D6FD58EA7F66A2A2F4E3E3CD82","amount":"20000"},{"denom":"ibc/932D6003DA334ECBC5B23A071B4287D0A5CC97331197FE9F1C0689BA002A8421","amount":"45000000"},{"denom":"ibc/96C56FECE6049162763F68641C90D3E4B899470728317E21EC96CB80A1675C72","amount":"1234644"},{"denom":"ibc/974934CDEA69DC8DB567A99255F2B0EE52FFEED0C3AAB8045D5F675884172E44","amount":"10"},{"denom":"ibc/977C824A11AF322AADA025C196ADC3A7F7409E342C35826106F9BF423AF32161","amount":"993846321500000003"},{"denom":"ibc/97A484736CA933C4B36991B5D7FBF340F500152502594108DD44657802F31DB0","amount":"1000000"},{"denom":"ibc/9833C415A84AABD455F8FB57779D9E97881B4350D6DD7D109483A528E2AF9E62","amount":"24906022"},{"denom":"ibc/9A7FFF0D0251332931169278F78555D0F94E32E6B6366670A8F6E3FB98DE6CFD","amount":"1999877"},{"denom":"ibc/9BE2D8181E4E838E5717677D7E03DABDE38A10C99C5BA40F7A3227C498B38F6C","amount":"2420"},{"denom":"ibc/9C457F36DB5B349CC11A934B304BFBB03499F21BC35023FEAAA4FB9ACFE2C9F2","amount":"777"},{"denom":"ibc/9FBA79F830617D8C17C6D22BA1BB069C0515DAF2F942C5D82863552832E00F01","amount":"39373252875"},{"denom":"ibc/A01D36237DAB2F63CFA0367A8FE25E28776155538C6986EFAAB3A232F0B8803E","amount":"125481682205698291359"},{"denom":"ibc/A176A3E92976C7FB0FE2B50DC011D23EC84B50A03A88773EFC19F2738EF323C9","amount":"10"},{"denom":"ibc/A4A79C0E690A9989DAFD6E6E62C67A3C6C9C938E8611496BCF77858EA5D86C57","amount":"1000"},{"denom":"ibc/A5BC4D892574D66B851893B7C8311FD6055F2EA189566BE88E9311023D134910","amount":"1000000"},{"denom":"ibc/A5E27D33CA1E367B852EACD5C22505FD7A58E2C7766E1EEE69BB67F9EF4412AC","amount":"119495155"},{"denom":"ibc/A83122162A9E0FF5B0B542F1E9695B73B5D0AD8C1475B37711A8D61985DDBEB1","amount":"1"},{"denom":"ibc/A98B70B3B16F7C82B28956F462BAC2A67DF52897BE5C63B0E11F0AB15D16D52A","amount":"10000000000"},{"denom":"ibc/A9B856B391FFAF2CABE7CA4A62304EA28FC97A6A187E326A1FA8CB2CF6FDD06A","amount":"10161100"},{"denom":"ibc/AA0116A8E9F429AFCBEF055DA1A85E2BC5545D0962EAE62E1DE7CDE25DFCDCFA","amount":"49478458353496472"},{"denom":"ibc/AA6107731C38F1DE5ECB8328CAD46512D16800D42489B6FA0EEF417368568C67","amount":"1000000"},{"denom":"ibc/AB6A01692B0CC51FAED256A9363E546BAF725EAE5534F67CA7BC7B0508E5D3EC","amount":"100000"},{"denom":"ibc/AB9FFBEDABA45CDBFD4F8DC98B6F40F0BEF20A75EA70CAA74D81A6AFA6A6B107","amount":"543210"},{"denom":"ibc/AC71C2F67A124D3E51AED4198AC588DE812B53F17DFE85430297193EFEF4E4FC","amount":"8660000"},{"denom":"ibc/ACB03194FA2EDB0D78B5F5532BE9C1297885DBDAF5AC95592361BCC69A0C1DB6","amount":"500204"},{"denom":"ibc/ADBEC1A7AC2FEF73E06B066A1C94DAB6C27924EF7EA3F5A43378150009620284","amount":"1187789838577"},{"denom":"ibc/AFE9092771F028A0690548E21D426FB1CA4E6D9F5DC8C6B3FEDF62E9A7A56BA3","amount":"1000000"},{"denom":"ibc/B1C89F17253FAEAEE8611AC4FA913D06E2E67A38C67F980E018DCEE56BCD0034","amount":"610196264"},{"denom":"ibc/B2B5AEE174062FA7804AC95223D8169852F8F58962C51C66391C272C838258B7","amount":"1658055997523"},{"denom":"ibc/B2E09ADEE9816B9949E6CAAEE38E5BD24624BD99F5D07DE11BD6A104B2BB57C4","amount":"10000000000000000"},{"denom":"ibc/B636DC89A39575295EE764B3F955512EB6FB0233A9CDA681B5F391CEC48E0CA3","amount":"802193"},{"denom":"ibc/B9BAA617A3B4161A4EE037E2699EA766C26415699482C1B77312E6A35983C5C2","amount":"1972099"},{"denom":"ibc/BAE37B60ED630BAF283BF66B5808F57D0CB3E5958CC9A11696D7EBF726651346","amount":"10000000000"},{"denom":"ibc/BB33B7C57BBDE022FCC7922819D9018EAE2CE875AAD4D642A595CFC5DF6D63E0","amount":"311074847"},{"denom":"ibc/BDE165955287C32EE4B125781D1CE37A7F965764FEC3E5ED15DF7CB873BA4279","amount":"24"},{"denom":"ibc/BEF5255B0786AEB156EFC72C37D5B1269EF0183A377277EFEDE07A8DA91B15C3","amount":"1000"},{"denom":"ibc/BF1C4FDFC734EB58E49FB33B8111F846F97579C58E258D5390F77CAB016DCDEA","amount":"11560521"},{"denom":"ibc/BFF9EFDDEF4F3019C9C4ADC2BFB03ED1900AB8404B51D404DF4B9B9D5EEC764B","amount":"10"},{"denom":"ibc/C36089D3D468BA1047750B105928D5A46A1EF81B2AF36548A7E79F5925AF7DE9","amount":"4950000"},{"denom":"ibc/C6D690C0D4ED0752873876A5F2CA1D5CAC6F96FFD3FB584729DCAC77C42DBEDB","amount":"100000"},{"denom":"ibc/C932ADFE2B4216397A4F17458B6E4468499B86C3BC8116180F85D799D6F5CC1B","amount":"78353831216673"},{"denom":"ibc/CA762713B4AE051660CEBA13D9EBB0EB9965A1C9BA5177BB96F002A380629F2C","amount":"100000000"},{"denom":"ibc/CBB95FCB60794A4D54E5706B5506D2BABBBEB542B0AD0A40D8688244C9A78D11","amount":"1"},{"denom":"ibc/CC0D70AD0EAD27D67AC9E3A22E729C68F6EA34744A61D84FB66AB60228BEC4D8","amount":"2000000"},{"denom":"ibc/CD1C69FB17355B0972385633BC0A8E519C42BD8409BD6964AEEE57E04F9F69BD","amount":"1000"},{"denom":"ibc/CD2B369F894163319E437B1A5EDE74AECE7F4533B8121308DBE6F5097F50AAF1","amount":"100000"},{"denom":"ibc/CDAB23DA5495290063363BD1C3499E26189036302DC689985A7E23F8DF8D8DB0","amount":"31452578"},{"denom":"ibc/CDCEF72D3C0C3801D366B32E7304973AC265D592AE9474F25DC1112E62583CDE","amount":"4124017"},{"denom":"ibc/CDF0B3B3B096CDDB0A5005E7198500B433E9D35FE88FE5FE80A8B0E1C72ACD4E","amount":"1000000"},{"denom":"ibc/CED3371B5000811FECF3FA4A70B9E4BD109C681574232436ADF553079FCCF29C","amount":"20000"},{"denom":"ibc/CF302234E3F454701E7372856611106F86DCCB21F99FA3560ED0E15F550A9A15","amount":"6000000"},{"denom":"ibc/D112D1F6923BB78A452ABFAA53E4568BA1E5C10EDEECD65F81C3383496301AF7","amount":"459620853400"},{"denom":"ibc/D6688E1B08EB99AB3E74B8964F10834B50D62C0046D150F495EF3FEA77F9A228","amount":"14942569"},{"denom":"ibc/D9812E55817B60C8B9063EEEF9A7BE7F090C40E2F13DAE6CE50EEF34CAD68B3F","amount":"9000000"},{"denom":"ibc/DBCE959F66C04E186C8267DC3E10FBF37563B469DB14DD6574C1287EB4F2671A","amount":"1020000"},{"denom":"ibc/DC2C7CDBCD6A0E39694E99F31EAA796BA787250E4DDB73A7D9F05C42DCA1DA84","amount":"6459219"},{"denom":"ibc/DCD1849E20837BC8FB2C252A7AE1D8AA7A1876911EE669E6CE6FDF9FEA54083D","amount":"275943153403489"},{"denom":"ibc/DD0B6DBBD20F9FA7841F0CA12A10F7507890095374DD786435071864712FCE8B","amount":"184469558"},{"denom":"ibc/DD6665717C3B0C48544058206E7177248F70DE2B09F3B3CE281C60D4CED34B78","amount":"50765563"},{"denom":"ibc/DDC3CDD2C36C28973FF303B492F62AC195CCC28D759C543E03354282A5FB47ED","amount":"1000"},{"denom":"ibc/DEC41A02E47658D40FC71E5A35A9C807111F5A6662A3FB5DA84C4E6F53E616B3","amount":"120282876"},{"denom":"ibc/DF238CD259CD37AC9D9C085E3BA9770DF5DC8851C704DE350C77C50783D5ED6C","amount":"2010000"},{"denom":"ibc/DF3FB29F461503646FE5D5F7E40DDF76E2F981B7BA2B56031CFACE1CFC461729","amount":"900000000"},{"denom":"ibc/DF940414E6371DFE46748E6C520F6BB481A73FDF1AD2624725652211A0429273","amount":"1234567"},{"denom":"ibc/E070CE91CC4BD15AEC9B5788C0826755AAD35052A3037E9AC62BE70B4C9A7DBB","amount":"5254288613"},{"denom":"ibc/E23789E9F8102FECA1A2DCD3EAC8F6CF089D9E67CD22AC66C1D1FE8D0BE3CC26","amount":"3355989"},{"denom":"ibc/E2844A04A5DE4BDEC499251DB902F273369470F7FEDB6682952530CEBF99BABA","amount":"1000000"},{"denom":"ibc/E3737B5FD04C410A3F4A86293EFB8A560C93119A203B112FF0873CA748BEBB99","amount":"8571777612"},{"denom":"ibc/E3FDA6AFDB1BF3691255716806EB68634F104ACE9D750EA60224DC9E6B906298","amount":"100"},{"denom":"ibc/E6F4B55B4C89B26F0DEFC76B6F2D7C703BBE2C806DBBBE056B86C0FF97A24F3D","amount":"215785258"},{"denom":"ibc/E71D74AC4AE2845B8E514624AE5273FEBA8EB0C42F527DDEA7FA94915A32F142","amount":"334154926"},{"denom":"ibc/E7D5E9D0E9BF8B7354929A817DD28D4D017E745F638954764AA88522A7A409EC","amount":"3478370620383"},{"denom":"ibc/EAE4BF33CA0074186121B532289707E006B4C6294025CA6D5397293B287E98A5","amount":"10000000"},{"denom":"ibc/EAFDFD96349D3CBF496F91128D51221D53BDB06CB15C7AE85BD309ABC6EFFBA1","amount":"1180000"},{"denom":"ibc/EB92C6FAD5A99050D2FCCEC37FFB1E913B93E5622A59885F169A1A009A147079","amount":"1"},{"denom":"ibc/EC4B5D87917DD5668D9998146F82D70FDF86652DB333D04CE29D1EB18E296AF5","amount":"1912000"},{"denom":"ibc/ED7406B0BD7DB1271CA0839F112CDCD84796442D3F6B7A774F989C9AEEA72707","amount":"5"},{"denom":"ibc/EF0DFC4851126BA61650BEB46CF67D37859246BA20D7DC4CD0FA1B3B118927C1","amount":"4950000"},{"denom":"ibc/EF5D92D089048638894A9EEF7765CFD682FC71E50C4760A3970E33375D689281","amount":"10000000000000000000"},{"denom":"ibc/F02E88911AE47874FEA3F7333748DB54F42415018464B52074800CDBB7F9F2D7","amount":"4362769210"}],"pagination":{"next_key":"aWJjL0Y1QTIyQkVBQTM0MDQ0NkE1RTg1MDI1QkY5QkNGODgzRTQ4NEY0Q0M2NDUyRjIxNUM1QjYyQ0U5MUEwNkVEMEM=","total":"0"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/liquidity/cosmos/bank/v1beta1/supply?pagination.key=aWJjL0Y1QTIyQkVBQTM0MDQ0NkE1RTg1MDI1QkY5QkNGODgzRTQ4NEY0Q0M2NDUyRjIxNUM1QjYyQ0U5MUEwNkVEMEM%3D':
      route.fulfill(
        create200(
          '{"supply":[{"denom":"ibc/F5A22BEAA340446A5E85025BF9BCF883E484F4CC6452F215C5B62CE91A06ED0C","amount":"30"},{"denom":"ibc/F5ED5F3DC6F0EF73FA455337C027FE91ABCB375116BF51A228E44C493E020A09","amount":"340819791712183108835"},{"denom":"ibc/F63AC494F72CAD1B05FD99194BC765B16A83D0306E30688ADDB52867C493BCE4","amount":"1600090"},{"denom":"ibc/F683FCA3C6BBC6924D8BD651751DE36D395680611EEA8D72EB0798475C35D6BD","amount":"627963172473"},{"denom":"ibc/F7AA8487A9FACE44A46AC1CD9A668EA10F9F16389F8591555C674FCD8CF70D5F","amount":"4632000"},{"denom":"ibc/F871EFABE94BCF72D386F0FBCACE79A63000B7A9C19B00B65CD16EA229693F66","amount":"11151990"},{"denom":"ibc/F88BA88F3DEADCFDD835FA341537C47CFF00ABB017C566F9EDD46102D1A480DE","amount":"5010000"},{"denom":"ibc/FB6BDFCBC1A211B1CDE07599C88862371DFCDE45CD7FFA2FC6C3EA3A648F2B78","amount":"3429472"},{"denom":"ibc/FE0FD152BC39C62485BF93F27D4F7257DB9570637E67574699F72B8B11DA8312","amount":"1"},{"denom":"ibc/FEE3FB19682DAAAB02A0328A2B84A80E7DDFE5BA48F7D2C8C30AAC649B8DD519","amount":"200000"},{"denom":"ibc/FF1FFD48ED80D891B8A75891D28B69038F33C37ECC8BCF542420FDFD2AA019F8","amount":"2000000"},{"denom":"pool2B9C24833CAA268C9081EC251693A724E8D343FC25A841FF00FD37B047BA4DEA","amount":"79059456"},{"denom":"pool32DD066BE949E5FDCC7DC09EBB67C7301D0CA957C2EF56A39B37430165447DAC","amount":"162569"},{"denom":"pool4BFAFC499776D30A4FA0D6033135F00CC4EFC770D19A74CAD37433B579F77FC0","amount":"136693"},{"denom":"pool60EFB07817D6B193A9FADA611404B8E11D82D6B7F0D10D57D3134C93E2BF7414","amount":"30179"},{"denom":"pool7AE391C099D1D88CC85A9FA8A0DC5650BF8DDE0DCE7D0824C073802C020A7747","amount":"31427"},{"denom":"poolAC9AF7B48E4497A0A9AF109E4286464A0EF06E7C35AD79198F03AB17A6A4CCA7","amount":"8835"},{"denom":"poolB457CE9240C221C0F76952FED6506F74375EDD38B32A6020B7DDDFD5A4867D5C","amount":"1404741"},{"denom":"poolBD5F1AF7A8B1F068C178F1D637DF126968EC10AB204A10116E320B2B8AF4FAC2","amount":"222604"},{"denom":"poolCF8B847997F5EB92B9C8DBAE41656F61D6BE708B1B42D31063291813014AD63F","amount":"1042743"},{"denom":"poolD1121E78E731AFD35FEA13CF9FA0044A1472F73A0EE784160CCAAAAE5C7AAD7E","amount":"8990"},{"denom":"poolD639A99414646D7136C65C6845D0EB3456EDD3D6C2C43050D3FA3A24995B0E75","amount":"145275401"},{"denom":"poolDFB8434D5A80B4EAFA94B6878BD5B85265AC6C5D37204AB899B1C3C52543DA7E","amount":"15682664895"},{"denom":"poolE71FE13681A283B7015E4E4C4852B0EDA72CC97A5CDE2ECA2A6C8C06C86AC775","amount":"281958466"},{"denom":"poolF2805980C54E1474BDCCF70EF5FE881F3B8EFCF8BA3198765C01D91904521788","amount":"25532"},{"denom":"poolFD005C5AB01714A4B62E87F5213F5D5CDE357773D70712916A93664BCE5A6931","amount":"3422185013"},{"denom":"uatom","amount":"292237197298021"}],"pagination":{"next_key":null,"total":"0"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/cosmos-hub/denom/verify_trace/14F9BC3E44B8A9C1BE1FB08980FAB87034C9905EF17CF2F5008FC085218811CC':
      route.fulfill(
        create200(
          '{"verify_trace":{"ibc_denom":"ibc/14f9bc3e44b8a9c1be1fb08980fab87034c9905ef17cf2f5008fc085218811cc","base_denom":"uosmo","verified":true,"path":"transfer/channel-141","trace":[{"channel":"channel-141","port":"transfer","chain_name":"cosmos-hub","counterparty_name":"osmosis"}]}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/cosmos-hub/denom/verify_trace/68A333688E5B07451F95555F8FE510E43EF9D3D44DF0909964F92081EF9BE5A7':
      route.fulfill(
        create200(
          '{"verify_trace":{"ibc_denom":"ibc/68a333688e5b07451f95555f8fe510e43ef9d3d44df0909964f92081ef9be5a7","base_denom":"uiov","verified":false,"path":"transfer/channel-158","trace":[{"channel":"channel-158","port":"transfer","chain_name":"cosmos-hub","counterparty_name":"starname"}],"cause":"no chain with name starname found"}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/cosmos-hub/denom/verify_trace/12DA42304EE1CE96071F712AA4D58186AD11C3165C0DCDA71E017A54F3935E66':
      route.fulfill(
        create200(
          '{"verify_trace":{"ibc_denom":"ibc/12da42304ee1ce96071f712aa4d58186ad11c3165c0dcda71e017a54f3935e66","base_denom":"uiris","verified":true,"path":"transfer/channel-182","trace":[{"channel":"channel-182","port":"transfer","chain_name":"cosmos-hub","counterparty_name":"iris"}]}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/cosmos-hub/denom/verify_trace/81D08BC39FB520EBD948CF017910DD69702D34BF5AC160F76D3B5CFC444EBCE0':
      route.fulfill(
        create200(
          '{"verify_trace":{"ibc_denom":"ibc/81d08bc39fb520ebd948cf017910dd69702d34bf5ac160f76d3b5cfc444ebce0","base_denom":"uxprt","verified":true,"path":"transfer/channel-190","trace":[{"channel":"channel-190","port":"transfer","chain_name":"cosmos-hub","counterparty_name":"persistence"}]}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/cosmos-hub/denom/verify_trace/2181AAB0218EAC24BC9F86BD1364FBBFA3E6E3FCC25E88E3E68C15DC6E752D86':
      route.fulfill(
        create200(
          '{"verify_trace":{"ibc_denom":"ibc/2181aab0218eac24bc9f86bd1364fbbfa3e6e3fcc25e88e3e68c15dc6e752d86","base_denom":"uakt","verified":true,"path":"transfer/channel-184","trace":[{"channel":"channel-184","port":"transfer","chain_name":"cosmos-hub","counterparty_name":"akash"}]}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/cosmos-hub/denom/verify_trace/1FBDD58D438B4D04D26CBFB2E722C18984A0F1A52468C4F42F37D102F3D3F399':
      route.fulfill(
        create200(
          '{"verify_trace":{"ibc_denom":"ibc/1fbdd58d438b4d04d26cbfb2e722c18984a0f1a52468c4f42f37d102f3d3f399","base_denom":"uregen","verified":true,"path":"transfer/channel-185","trace":[{"channel":"channel-185","port":"transfer","chain_name":"cosmos-hub","counterparty_name":"regen"}]}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/cosmos-hub/denom/verify_trace/42E47A5BA708EBE6E0C227006254F2784E209F4DBD3C6BB77EDC4B29EF875E8E':
      route.fulfill(
        create200(
          '{"verify_trace":{"ibc_denom":"ibc/42e47a5ba708ebe6e0c227006254f2784e209f4dbd3c6bb77edc4b29ef875e8e","base_denom":"udvpn","verified":true,"path":"transfer/channel-186","trace":[{"channel":"channel-186","port":"transfer","chain_name":"cosmos-hub","counterparty_name":"sentinel"}]}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/cosmos-hub/denom/verify_trace/C932ADFE2B4216397A4F17458B6E4468499B86C3BC8116180F85D799D6F5CC1B':
      route.fulfill(
        create200(
          '{"verify_trace":{"ibc_denom":"ibc/c932adfe2b4216397a4f17458b6e4468499b86c3bc8116180f85d799d6f5cc1b","base_denom":"basecro","verified":true,"path":"transfer/channel-187","trace":[{"channel":"channel-187","port":"transfer","chain_name":"cosmos-hub","counterparty_name":"crypto-org"}]}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/cosmos-hub/denom/verify_trace/5BB694D466CCF099EF73F165F88472AF51D9C4991EAA42BD1168C5304712CC0D':
      route.fulfill(
        create200(
          '{"verify_trace":{"ibc_denom":"ibc/5bb694d466ccf099ef73f165f88472af51d9c4991eaa42bd1168c5304712cc0d","base_denom":"uion","verified":true,"path":"transfer/channel-141","trace":[{"channel":"channel-141","port":"transfer","chain_name":"cosmos-hub","counterparty_name":"osmosis"}]}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/cosmos-hub/denom/verify_trace/B2B5AEE174062FA7804AC95223D8169852F8F58962C51C66391C272C838258B7':
      route.fulfill(
        create200(
          '{"verify_trace":{"ibc_denom":"ibc/b2b5aee174062fa7804ac95223d8169852f8f58962c51c66391c272c838258b7","base_denom":"uixo","verified":true,"path":"transfer/channel-204","trace":[{"channel":"channel-204","port":"transfer","chain_name":"cosmos-hub","counterparty_name":"ixo"}]}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/cosmos-hub/denom/verify_trace/E070CE91CC4BD15AEC9B5788C0826755AAD35052A3037E9AC62BE70B4C9A7DBB':
      route.fulfill(
        create200(
          '{"verify_trace":{"ibc_denom":"ibc/e070ce91cc4bd15aec9b5788c0826755aad35052a3037e9ac62be70b4c9a7dbb","base_denom":"ungm","verified":true,"path":"transfer/channel-202","trace":[{"channel":"channel-202","port":"transfer","chain_name":"cosmos-hub","counterparty_name":"emoney"}]}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/cosmos-hub/denom/verify_trace/DCD1849E20837BC8FB2C252A7AE1D8AA7A1876911EE669E6CE6FDF9FEA54083D':
      route.fulfill(
        create200(
          '{"verify_trace":{"ibc_denom":"ibc/dcd1849e20837bc8fb2c252a7ae1d8aa7a1876911ee669e6ce6fdf9fea54083d","base_denom":"xrowan","verified":false,"path":"transfer/channel-192","trace":[{"channel":"channel-192","port":"transfer","chain_name":"cosmos-hub","counterparty_name":"sifchain"}]}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/cosmos-hub/denom/verify_trace/1D5826F7EDE6E3B13009FEF994DC9CAAF15CC24CA7A9FF436FFB2E56FD72F54F':
      route.fulfill(
        create200(
          '{"verify_trace":{"ibc_denom":"ibc/1d5826f7ede6e3b13009fef994dc9caaf15cc24ca7a9ff436ffb2e56fd72f54f","base_denom":"nanolike","verified":true,"path":"transfer/channel-217","trace":[{"channel":"channel-217","port":"transfer","chain_name":"cosmos-hub","counterparty_name":"likecoin"}]}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/cosmos-hub/denom/verify_trace/ADBEC1A7AC2FEF73E06B066A1C94DAB6C27924EF7EA3F5A43378150009620284':
      route.fulfill(
        create200(
          '{"verify_trace":{"ibc_denom":"ibc/adbec1a7ac2fef73e06b066a1c94dab6c27924ef7ea3f5a43378150009620284","base_denom":"ubcna","verified":true,"path":"transfer/channel-232","trace":[{"channel":"channel-232","port":"transfer","chain_name":"cosmos-hub","counterparty_name":"bitcanna"}]}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/chain/cosmos-hub/denom/verify_trace/E7D5E9D0E9BF8B7354929A817DD28D4D017E745F638954764AA88522A7A409EC':
      route.fulfill(
        create200(
          '{"verify_trace":{"ibc_denom":"ibc/e7d5e9d0e9bf8b7354929a817dd28d4d017e745f638954764aa88522a7a409ec","base_denom":"ubtsg","verified":true,"path":"transfer/channel-229","trace":[{"channel":"channel-229","port":"transfer","chain_name":"cosmos-hub","counterparty_name":"bitsong"}]}}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/account/4bfafc499776d30a4fa0d6033135f00cc4efc770/balance':
      route.fulfill(
        create200(
          '{"balances":[{"address":"4bfafc499776d30a4fa0d6033135f00cc4efc770","base_denom":"uregen","verified":true,"amount":"100837842526ibc/1FBDD58D438B4D04D26CBFB2E722C18984A0F1A52468C4F42F37D102F3D3F399","on_chain":"cosmos-hub","ibc":{"path":"transfer/channel-185","hash":"1FBDD58D438B4D04D26CBFB2E722C18984A0F1A52468C4F42F37D102F3D3F399"}},{"address":"4bfafc499776d30a4fa0d6033135f00cc4efc770","base_denom":"uatom","verified":true,"amount":"2997429480uatom","on_chain":"cosmos-hub","ibc":{}}]}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/account/b457ce9240c221c0f76952fed6506f74375edd38/balance':
      route.fulfill(
        create200(
          '{"balances":[{"address":"b457ce9240c221c0f76952fed6506f74375edd38","base_denom":"uion","verified":true,"amount":"1609172ibc/5BB694D466CCF099EF73F165F88472AF51D9C4991EAA42BD1168C5304712CC0D","on_chain":"cosmos-hub","ibc":{"path":"transfer/channel-141","hash":"5BB694D466CCF099EF73F165F88472AF51D9C4991EAA42BD1168C5304712CC0D"}},{"address":"b457ce9240c221c0f76952fed6506f74375edd38","base_denom":"uatom","verified":true,"amount":"288293535uatom","on_chain":"cosmos-hub","ibc":{}}]}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/account/f2805980c54e1474bdccf70ef5fe881f3b8efcf8/balance':
      route.fulfill(
        create200(
          '{"balances":[{"address":"f2805980c54e1474bdccf70ef5fe881f3b8efcf8","base_denom":"uatom","verified":true,"amount":"801446519uatom","on_chain":"cosmos-hub","ibc":{}},{"address":"f2805980c54e1474bdccf70ef5fe881f3b8efcf8","base_denom":"uiris","verified":true,"amount":"323267260559ibc/12DA42304EE1CE96071F712AA4D58186AD11C3165C0DCDA71E017A54F3935E66","on_chain":"cosmos-hub","ibc":{"path":"transfer/channel-182","hash":"12DA42304EE1CE96071F712AA4D58186AD11C3165C0DCDA71E017A54F3935E66"}}]}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/account/2b9c24833caa268c9081ec251693a724e8d343fc/balance':
      route.fulfill(
        create200(
          '{"balances":[{"address":"2b9c24833caa268c9081ec251693a724e8d343fc","base_denom":"uxprt","verified":true,"amount":"18473962808ibc/81D08BC39FB520EBD948CF017910DD69702D34BF5AC160F76D3B5CFC444EBCE0","on_chain":"cosmos-hub","ibc":{"path":"transfer/channel-190","hash":"81D08BC39FB520EBD948CF017910DD69702D34BF5AC160F76D3B5CFC444EBCE0"}},{"address":"2b9c24833caa268c9081ec251693a724e8d343fc","base_denom":"uatom","verified":true,"amount":"2196842365uatom","on_chain":"cosmos-hub","ibc":{}}]}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/account/7ae391c099d1d88cc85a9fa8a0dc5650bf8dde0d/balance':
      route.fulfill(
        create200(
          '{"balances":[{"address":"7ae391c099d1d88cc85a9fa8a0dc5650bf8dde0d","base_denom":"udvpn","verified":true,"amount":"3902609184248ibc/42E47A5BA708EBE6E0C227006254F2784E209F4DBD3C6BB77EDC4B29EF875E8E","on_chain":"cosmos-hub","ibc":{"path":"transfer/channel-186","hash":"42E47A5BA708EBE6E0C227006254F2784E209F4DBD3C6BB77EDC4B29EF875E8E"}},{"address":"7ae391c099d1d88cc85a9fa8a0dc5650bf8dde0d","base_denom":"uatom","verified":true,"amount":"574645631uatom","on_chain":"cosmos-hub","ibc":{}}]}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/account/d639a99414646d7136c65c6845d0eb3456edd3d6/balance':
      route.fulfill(
        create200(
          '{"balances":[{"address":"d639a99414646d7136c65c6845d0eb3456edd3d6","base_denom":"uiris","verified":true,"amount":"20675168661ibc/12DA42304EE1CE96071F712AA4D58186AD11C3165C0DCDA71E017A54F3935E66","on_chain":"cosmos-hub","ibc":{"path":"transfer/channel-182","hash":"12DA42304EE1CE96071F712AA4D58186AD11C3165C0DCDA71E017A54F3935E66"}},{"address":"d639a99414646d7136c65c6845d0eb3456edd3d6","base_denom":"udvpn","verified":true,"amount":"339475539260ibc/42E47A5BA708EBE6E0C227006254F2784E209F4DBD3C6BB77EDC4B29EF875E8E","on_chain":"cosmos-hub","ibc":{"path":"transfer/channel-186","hash":"42E47A5BA708EBE6E0C227006254F2784E209F4DBD3C6BB77EDC4B29EF875E8E"}}]}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/account/ac9af7b48e4497a0a9af109e4286464a0ef06e7c/balance':
      route.fulfill(
        create200(
          '{"balances":[{"address":"ac9af7b48e4497a0a9af109e4286464a0ef06e7c","base_denom":"uatom","verified":true,"amount":"45186030uatom","on_chain":"cosmos-hub","ibc":{}},{"address":"ac9af7b48e4497a0a9af109e4286464a0ef06e7c","base_denom":"nanolike","verified":true,"amount":"83034817162576ibc/1D5826F7EDE6E3B13009FEF994DC9CAAF15CC24CA7A9FF436FFB2E56FD72F54F","on_chain":"cosmos-hub","ibc":{"path":"transfer/channel-217","hash":"1D5826F7EDE6E3B13009FEF994DC9CAAF15CC24CA7A9FF436FFB2E56FD72F54F"}}]}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/account/d1121e78e731afd35fea13cf9fa0044a1472f73a/balance':
      route.fulfill(
        create200(
          '{"balances":[{"address":"d1121e78e731afd35fea13cf9fa0044a1472f73a","base_denom":"uixo","verified":true,"amount":"14786116319ibc/B2B5AEE174062FA7804AC95223D8169852F8F58962C51C66391C272C838258B7","on_chain":"cosmos-hub","ibc":{"path":"transfer/channel-204","hash":"B2B5AEE174062FA7804AC95223D8169852F8F58962C51C66391C272C838258B7"}},{"address":"d1121e78e731afd35fea13cf9fa0044a1472f73a","base_denom":"uatom","verified":true,"amount":"196401187uatom","on_chain":"cosmos-hub","ibc":{}}]}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/account/bd5f1af7a8b1f068c178f1d637df126968ec10ab/balance':
      route.fulfill(
        create200(
          '{"balances":[{"address":"bd5f1af7a8b1f068c178f1d637df126968ec10ab","base_denom":"basecro","verified":true,"amount":"12951052456803ibc/C932ADFE2B4216397A4F17458B6E4468499B86C3BC8116180F85D799D6F5CC1B","on_chain":"cosmos-hub","ibc":{"path":"transfer/channel-187","hash":"C932ADFE2B4216397A4F17458B6E4468499B86C3BC8116180F85D799D6F5CC1B"}},{"address":"bd5f1af7a8b1f068c178f1d637df126968ec10ab","base_denom":"uatom","verified":true,"amount":"2128981547uatom","on_chain":"cosmos-hub","ibc":{}}]}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/account/fd005c5ab01714a4b62e87f5213f5d5cde357773/balance':
      route.fulfill(
        create200(
          '{"balances":[{"address":"fd005c5ab01714a4b62e87f5213f5d5cde357773","base_denom":"ubcna","verified":true,"amount":"1184416703528ibc/ADBEC1A7AC2FEF73E06B066A1C94DAB6C27924EF7EA3F5A43378150009620284","on_chain":"cosmos-hub","ibc":{"path":"transfer/channel-232","hash":"ADBEC1A7AC2FEF73E06B066A1C94DAB6C27924EF7EA3F5A43378150009620284"}},{"address":"fd005c5ab01714a4b62e87f5213f5d5cde357773","base_denom":"uatom","verified":true,"amount":"3346191459uatom","on_chain":"cosmos-hub","ibc":{}}]}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/account/dfb8434d5a80b4eafa94b6878bd5b85265ac6c5d/balance':
      route.fulfill(
        create200(
          '{"balances":[{"address":"dfb8434d5a80b4eafa94b6878bd5b85265ac6c5d","base_denom":"uosmo","verified":true,"amount":"92058009700ibc/14F9BC3E44B8A9C1BE1FB08980FAB87034C9905EF17CF2F5008FC085218811CC","on_chain":"cosmos-hub","ibc":{"path":"transfer/channel-141","hash":"14F9BC3E44B8A9C1BE1FB08980FAB87034C9905EF17CF2F5008FC085218811CC"}},{"address":"dfb8434d5a80b4eafa94b6878bd5b85265ac6c5d","base_denom":"uatom","verified":true,"amount":"24569507330uatom","on_chain":"cosmos-hub","ibc":{}}]}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/account/60efb07817d6b193a9fada611404b8e11d82d6b7/balance':
      route.fulfill(
        create200(
          '{"balances":[{"address":"60efb07817d6b193a9fada611404b8e11d82d6b7","base_denom":"ungm","verified":true,"amount":"2384241497ibc/E070CE91CC4BD15AEC9B5788C0826755AAD35052A3037E9AC62BE70B4C9A7DBB","on_chain":"cosmos-hub","ibc":{"path":"transfer/channel-202","hash":"E070CE91CC4BD15AEC9B5788C0826755AAD35052A3037E9AC62BE70B4C9A7DBB"}},{"address":"60efb07817d6b193a9fada611404b8e11d82d6b7","base_denom":"uatom","verified":true,"amount":"95809383uatom","on_chain":"cosmos-hub","ibc":{}}]}',
        ),
      );
      return;
    case 'https://api.emeris.com/v1/account/32dd066be949e5fdcc7dc09ebb67c7301d0ca957/balance':
      route.fulfill(
        create200(
          '{"balances":[{"address":"32dd066be949e5fdcc7dc09ebb67c7301d0ca957","base_denom":"uatom","verified":true,"amount":"4335231445uatom","on_chain":"cosmos-hub","ibc":{}},{"address":"32dd066be949e5fdcc7dc09ebb67c7301d0ca957","base_denom":"uakt","verified":true,"amount":"92589247191ibc/2181AAB0218EAC24BC9F86BD1364FBBFA3E6E3FCC25E88E3E68C15DC6E752D86","on_chain":"cosmos-hub","ibc":{"path":"transfer/channel-184","hash":"2181AAB0218EAC24BC9F86BD1364FBBFA3E6E3FCC25E88E3E68C15DC6E752D86"}}]}',
        ),
      );
      return;
    /*
    case '':
      route.fulfill(
        create200('{"numbers":{"chain_name":"crypto-org","block_height":0,"address":"cro1hf236ddjyf8vr04tlrd85euzy2c73jnkhck7ct","sequence_number":6,"account_number":411293}}')
      )
      */
    default:
      route.continue();
      return;
  }
}
