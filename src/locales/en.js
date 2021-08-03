export const messages = {
  en: {
    generic_cta: {
      seeall: 'See all',
      done: 'Done',
      cancel: 'Cancel',
      confirm: 'Confirm',
      continue: 'Continue',
      noFunds: 'Insufficient funds',
      filterNoResults: "No results for '{keyword}'",
      filterRetry: 'Try again with another search',
      discoverMore: 'Discover more',
      max: 'Max',
      understand: 'I understand',
      getAtom: 'Get ATOM',
      proceed: 'Proceed',
      learnMore: 'Learn more',
      get: 'Get',
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
        modal1: {
          title: 'Connect to Keplr',
          text: 'To use Emeris beta, please allow this web app to connect to the Keplr browser extension wallet.',
          button: 'Connect to Keplr',
          needHelp: 'Need help?',
          opening: 'Opening Keplr',
          connecting: 'Connecting',
        },
        modal2: {
          title: 'Keplr is required',
          text: 'To use Emeris beta, please install the Keplr browser extension wallet from the Chrome Web Store.',
          button1: 'Get Keplr',
          button2: 'I got Keplr',
        },
        modal3: {
          title: 'Not compatible',
          text: 'Emeris beta is only compatible with Chromium-based web browsers. These include Google Chrome, Brave Browser, and Microsoft Edge.',
          button1: 'Get Chrome',
          button2: 'Get Brave',
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
        available: ' available',
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
      clipBoard: {
        copied: 'Copied!',
        copy: 'Copy to clipboard',
      },
      slippageSettingsModal: {
        title: 'Slippage tolerance',
        limitPrice: 'Limit price',
        disclaimer: 'Assets will not be swapped at a higher rate than the limit rate.',
        minReceivedLbl: 'Min. received/(if 100% swapped)',
        minReceivedLblHint: 'Minimum total received if your entire swap is fulfilled.',
      },
      feeWarningModal: {
        missingOne: 'You need {denom} to pay fees',
        missingOneText: 'Lorem ipsum',
        missingOneTextAtom: 'Lorem ipsum Atom',
        missingMany: 'You have no assets to pay fees',
        missingManyText: 'For this transfer and swap, the following assets are required to pay fees.',
        ibcWarning: 'You may need {denom} to pay fees',
        ibcWarningText: 'In order to use your {ibcDenom} on {chain}, you may need {denom} to pay fees',
      },
      txHandlingModal: {
        openKeplr: 'Opening Keplr',
        signTx: 'Signing transaction',
        signError: 'Transaction not signed!',
        tryAgain: 'Try again',
        keplrSupport: 'Keplr troubleshooting ↗️',
        ibcTransferSubtitle: 'This may take up to 1 minute',
        ibcTransferDelayTitle: 'Still transferring…',
        ibcTransferDelaySubtitle:
          'Your transaction appears to be taking longer than expected. If the transfer is not complete in 4 minutes, it will be reverted.',
        pleaseWait: 'Please wait',
        txProgress: 'Transaction in progress',
        somethingWentWrong: 'Something went wrong',
        revertTx: 'reverting transfer...',
        contactSupport: 'Contact support ↗️',
        backToPortfolio: 'Back to portfolio',
        genericAction: 'Transacting',
        transferAction: 'Transferring',
        swapAction: 'Swapping',
        createPoolAction: 'Creating pool',
        addLiqAction: 'Adding liquidity',
        withdrawLiqAction: 'Withdrawing liquidity',
        withdrawing: 'Withdrawing',
        transferred: 'transferred',

        reset: 'Send another',
        next: 'Next transaction',

        genericActionComplete: 'Transaction complete',
        transferActionComplete: 'Assets transferred',
        swapActionComplete: 'Assets swapped',
        swapActionPartiallyComplete: `Assets partially swapped ({swappedPercent}%)`,
        createPoolActionComplete: 'Pool created',
        addLiqActionComplete: 'Liquidity added',
        withdrawLiqActionComplete: 'Liquidity withdrawn',

        swapActionFail: 'Swap failed',
        createPoolActionFail: 'Create pool failed',
        addLiqActionFail: 'Add liquidity failed',
        withdrawLiqActionFail: 'Withdraw liquidity failed',
        txFail: 'Transaction failed',
      },
      swap: {
        title: 'Swap',
        payHeader: 'Pay {amount}',
        receiveHeader: 'Receive {amount}',
        priceAlert: 'Prices have changed',
      },
      transferToHub: {
        swap: 'Assets are swapped on the Cosmos Hub',
        swapDescription: 'Your {denom} must first be transferred to the Cosmos Hub before they can be swapped.',
        addLiquidity: 'Liquidity providing happens on the Cosmos Hub',
        addLiquidityDescription:
          'In order to add your liquidity, we need to transfer your {denom} to the Cosmos Hub before they can be add to the pool.',
        addLiquidityDescriptionMultiple:
          'In order to add your liquidity, we need to transfer your {denomA} and {denomB} to the Cosmos Hub before they can be add to the pool.',
        transfer: 'Cross-chain transfers from {from} to {to}',
        transferDescription:
          'Emeris gives you the ability to transfer your assets to different chains. This is made possible through a brand new protocol for inter-blockchain communication.',
      },
      previews: {
        addWithdrawLiquidity: {
          poolLbl: 'Pool',
          priceLbl: 'Pool price',
          supplyLbl: 'Supply',
          suppliedLbl: 'Supplied',
          refundedLbl: 'Refunded',
          receiveLbl: 'Receive (estimated)',
          receivedLbl: 'Received',
          receiveLblHint: 'LP token',
          feesLbl: 'Fees',
          feeLbl: 'Transaction fee',
        },
        createPool: {},
        transfer: {
          sendLbl: 'Send',
          fromLbl: 'Send address',
          txToSign: '{txCount} transactions to sign',
          txToSignHint: 'TODO',
          feeLbl: 'Transaction fee',
          toLbl: 'Recipient address',
        },
        redeem: {
          sendLbl: 'Send',
          txToSign: '{txCount} transactions to sign',
          txToSignHint: 'TODO',
          feeLbl: 'Transaction fee',
        },
        swap: {
          payLbl: 'Pay',
          receiveLbl: 'Receive',
          receiveLblHint: '(estimated)',
          priceLbl: 'Price',
          minReceivedLbl: 'Min. received',
          minReceivedLblHint: 'TODO',
          limitPriceLbl: 'Limit price',
          limitPriceLblHint: 'TODO',
          feesLbl: 'Fees',
          feeLbl: 'Transaction fee',
          feeLblHint: 'TODO',
          swapFeeLbl: 'Swap fee',
          swapFeeLblHint: 'TODO',
        },
      },
      settingsMenu: {
        theme: 'Theme',
        system: 'System',
        light: 'Light',
        advancedSettings: 'Advanced settings',
        settings: 'Settings',
        connectedWallet: 'Connected wallet',
        disconnectWallet: 'Disconnect wallet',
        support: 'Support',
        twitter: 'Twitter',
        privacy: 'Privacy',
        termsOfUse: 'Terms of use',
        cookiesPolicy: 'Cookies policy',
        allowCustomSlippage: 'Allow custom slippage',
        viewAllAssets: 'View all assets',
        viewLPAssetPools: 'View LP asset pools',
        warningCustomSlippage: 'Be careful, being able to change price slippage is an advanced setting.',
        warningViewUnverified: 'Be careful, being able to trade any asset is an advanced setting.',
        warningLPAssetPools: 'Be careful, being able to see and trade LP asset pools is an advanced setting.',
        warningSignificantLoss: 'This means that if you don’t know what you are doing, you may risk significant loss.',
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
        ticker: 'Ticker',
        price: 'Price',
        marketCap: 'Market Cap.',
        amount: 'Amount',
        balance: 'Balance',
        chains: 'chains',
        onchain: '{amount} on {chain}',
        viewAll: 'View all',
      },
      pools: {
        title: 'Pools',
        equity: 'Equity',
        mine: 'My Pools',
        all: 'All Pools',
        pair: 'Token Pair',
        share: 'Your share',
        liquidity: 'Liquidity',
        empty: 'Pools you add liquidity to will appear here.',
        explore: 'Explore pools',
      },
    },
  },
};
