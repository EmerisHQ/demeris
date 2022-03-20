import { Assets } from '../support/pages/assets';
import { goToWithKeplr } from '../support/pages/goto';

describe('Check availability of Assets page elements', function () {
  beforeEach(() => {
    goToWithKeplr('/assets');
  });

  it('go to Assets page', function () {
    let assets = new Assets();

    assets.aktRow().should('be.visible');
    assets.atomRow().should('be.visible');

    assets.tableAssetsRow('AKT');
    assets.tableAssetsRow('ATOM');
  });
});
