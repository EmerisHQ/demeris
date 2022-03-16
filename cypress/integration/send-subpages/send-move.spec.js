import { goToWithKeplr } from '../../support/pages/goto';
import { Navbar } from '../../support/pages/navbar';
import { MoveAssetsSubpage } from '../../support/pages/send-subpages/send-move';

describe('Check availability of send/move subpage elements', function () {
  beforeEach(() => {
    goToWithKeplr('/');
  });
  it('fill in form amount form', function () {
    let navbar = new Navbar();
    let moveAssetsSubpage = new MoveAssetsSubpage();

    navbar.send().click();
    moveAssetsSubpage.goTo();

    moveAssetsSubpage.header().should('be.visible');
    moveAssetsSubpage.continueButton().should('be.disabled');
    moveAssetsSubpage.inputAmountOfAssets().type('0.000001');
    moveAssetsSubpage.continueButton().should('not.be.disabled');
  });
});
