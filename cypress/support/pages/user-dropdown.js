import { Navbar } from './navbar';

export class UserDropdown {
  expand() {
    let navbar = new Navbar();
    navbar.userSettings().click();
  }

  disconnectWallet() {
    return this.userDropdownExpanded().contains('Disconnect wallet');
  }

  settings() {
    return this.userDropdownExpanded().contains('Settings');
  }

  support() {
    return this.userDropdownExpanded().contains('Support');
  }

  twitter() {
    return this.userDropdownExpanded().contains('Twitter');
  }

  emerisCom() {
    return this.userDropdownExpanded().contains('emeris.com');
  }

  version() {
    return this.userDropdownExpanded().contains('Version');
  }

  userDropdownExpanded() {
    return cy.get(
      'div[class="settings-modal absolute right-0 bg-surface rounded-2xl w-full sm:w-72 z-30 shadow-panel"]',
    );
  }
}