export const messages = {
  en: {
    generic_cta: {
      seeall: 'See all',
      done: 'Done',
      cancel: 'Cancel',
      confirm: 'Confirm',
      continue: 'Continue',
      noFunds: 'Insufficient Funds',
      filterNoResults: "No results for '{keyword}'",
      filterRetry: 'Try again with another search',
      max: 'Max',
    },
    navbar: {
      portfolio: 'Portfolio',
      assets: 'Assets',
      pools: 'Pools',
      send: 'Send',
      receive: 'Receive',
      settings: 'Settings',
    },
    wallet: {
      connect: {
        button: 'Connect my wallet',
        modal: {
          title: 'Connect to Keplr',
          text1: 'Install Keplr in your browser and connect your wallet to start using Demeris.',
          text2: 'Demeris will support other wallets in the near future.',
          button: 'Connect to Keplr',
          missing: "Don't have Keplr installed?",
          opening: 'Opening Keplr',
          connecting: 'Connecting',
        },
      },
    },
    components: {
      chainSelect: {
        text1: 'You have {asset} on {chainNo} {chains}',
        text2: 'Select the chain you wish to swap from.',
      },
      coinList: {
        tooltip: '{asset} on {chain}',
        available: 'available',
      },
      denomSelect: {
        select: 'Select asset',
      },
      feeLevelSelector: {
        feesIncl: 'Fees (included)',
        transactionFee: 'Transaction fee (x{txCount})',
        slowWarning: 'Your transaction may take longer to be processed.',
        swapFee: 'Swap fee',
        estimate: 'Estimated total fees',
      },
      moveForm: {
        title: 'Move assets',
        action: 'Move',
        from: 'From',
        to: 'To',
        selectChain: 'Select chain',
      },
      sendForm: {
        title: 'Send to an address',
        amountSelect: 'Enter an amount',
        available: 'available',
        to: 'To',
        memo: 'Reference (memo)',
        memoHint: 'Memo hint',
        memoPlaceholder: 'Add reference/memo',
        agreeTerms: 'I have reviewed the address and understand that if it is incorrect, my sent funds may be lost.',
      },
    },
    context: {
      feeLevels: {
        low: 'Slow',
        average: 'Normal',
        high: 'Fast',
      },
      chains: {
        title: 'Chains',
      },
      assets: {
        title: 'Assets',
        totalBalance: 'Total Balance',
        asset: 'Asset',
        price: 'Price',
        amount: 'Amount',
        balance: 'Balance',
        chains: 'chains',
        onchain: '{amount} on {chain}',
      },
      pools: {
        title: 'Pools',
        equity: 'Equity',
        mine: 'My Pools',
        all: 'All Pools',
        pair: 'Token Pair',
        share: 'Your share',
        liquidity: 'Liquidity',
      },
    },
  },
};
