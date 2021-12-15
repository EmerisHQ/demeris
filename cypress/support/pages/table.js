export class Table {
  getTable() {
    return cy.get('[class="assets-table -ml-6"]');
  }

  getAssetColumnValue() {
    this.getTable().get();
    return;
  }

  getTickerColumnValue() {
    return;
  }

  getPriceColumnValue() {
    return;
  }

  getMarketCapColumnValue() {
    return;
  }

  getTickerOfAsset(assetCode) {
    return this.getRowByAssetCode(assetCode);
  }
  getPriceOfAsset(assetCode) {
    return getRowByAssetCode(assetCode);
  }
  getMarketCapOfAsset(assetCode) {
    return getRowByAssetCode(assetCode);
  }
  getRowByAssetCode(assetCode) {
    return this.getTable().get('tr').contains(assetCode);
  }
}
