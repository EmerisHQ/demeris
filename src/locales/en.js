export const messages = {
  en: {
    generic_cta: {
      seeall: 'See all',
      done: 'Done',
      agree: 'Agree',
      cancel: 'Cancel',
      confirm: 'Confirm',
      continue: 'Continue',
      noFunds: 'Insufficient funds',
      filterNoResults: "No results for '{keyword}'",
      filterRetry: 'Try adjusting your search',
      max: 'Max',
      understand: 'I understand',
      getAtom: 'Get ATOM',
      proceed: 'Proceed',
      learnMore: 'Learn more',
      get: 'Get',
      connectToEmeris: 'Connect to Emeris',
      tryTheDemo: 'Try the demo',
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
        button: 'Connect wallet',
        modal1: {
          title: 'Connect your wallet',
          text: 'Connect your Keplr wallet via the Keplr browser extension to use Emeris.',
          button: 'Connect Keplr',
          demo: 'Try the demo',
          needHelp: 'Need help?',
          opening: 'Opening Keplr',
          connecting: 'Connecting',
          connectingHelp: 'Stuck connecting? Make sure you have created an account in Keplr first.',
        },
        modal2: {
          title: 'Keplr is required',
          text: 'Install the Keplr browser extension and connect your Keplr wallet to use Emeris.',
          button: 'Install Keplr',
        },
        modal3: {
          title: 'Not compatible',
          text: 'Emeris uses Keplr for accessing your accounts, which is only supported on Chromium-based browser like Google Chrome or Brave.',
          button1: 'Install Chrome',
          button2: 'Install Brave',
        },
        modal3welcome: {
          title: 'Your browser is not currently supported',
        },
        modal4: {
          title: 'Emeris is in beta',
          subtitle: 'Use at your own risk.',
          text1:
            'The current features available on the site are offered in "beta" form ("Beta Services").  By using the Beta Services, You understand and acknowledge that the Beta Services are being provided as a "Beta" version and made available on an "As Is" or "As Available" basis. The Beta Services may contain bugs, errors, and other problems. YOU ASSUME ALL RISKS AND ALL COSTS ASSOCIATED WITH YOUR USE OF THE BETA SERVICES.  By using this website, you also agree to these Terms of Service.',
          tos: 'Terms of Service',
        },
        modal5: {
          title: 'Unsupported device',
          text: 'Emeris will support mobile devices in the future. In the meantime please use the app on a desktop device.',
          button: 'Visit emeris.com',
        },
      },
    },
    components: {
      chainSelect: {
        text1: 'You have {asset} on {chainNo} {chains}.',
        text2: 'Select the chain you wish to use.',
      },
      coinList: {
        tooltip: '{asset} on {chain}',
        available: ' available',
      },
      denomSelect: {
        select: 'Select asset',
        otherAssets: 'Other assets',
        unavailableSwapPair: 'Unvailable to swap with {pair}',
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
        title: 'Enter an address',
        amountSelect: 'Enter an amount',
        available: 'available',
        to: 'To',
        toPlaceholder: 'Recipient address',
        memo: 'Reference (memo)',
        memoHint: 'Memo hint',
        memoPlaceholder: 'Add reference (memo)',
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
        minReceivedLbl: 'Min. received if 100% swapped',
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
        signTx: 'Sign transaction',
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
        revertTx: 'Reverting transfer...',
        contactSupport: 'Contact support ↗️',
        backToPortfolio: 'Back to portfolio',
        genericAction: 'Transacting',
        transferAction: 'Transferring',
        swapAction: 'Swapping',
        createPoolAction: 'Creating pool',
        addLiqAction: 'Adding liquidity',
        withdrawLiqAction: 'Withdrawing liquidity',
        withdrawing: 'Withdrawing',
        transferred: 'Transferred',

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
        withdrawLiqActionFail: 'Liquidity withdrawal failed',
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
        addLiquidity: 'Pools are on the Cosmos Hub',
        addLiquidityDescription:
          'In order to add liquidity to a pool, your {denom} must be transferred to the Cosmos Hub.',
        addLiquidityDescriptionMultiple:
          'In order to add liquidity to a pool, your {denomA} and {denomB} must be transferred to the Cosmos Hub.',
        transfer: 'Cross-chain transfers',
        transferSubtitle: '{from} to {to}',
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
          sentLbl: 'You sent',
          senderLbl: 'Send address',
          fromLbl: 'From address',
          txToSign: '{txCount} transactions to sign',
          feesLbl: 'Fees',
          txToSignHint: 'TODO',
          receiveLbl: 'Receive',
          recipientGotLbl: 'Recipient got',
          includedFee: 'included',
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
          minReceivedLbl: 'Min. received if 100% swapped',
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
        dark: 'Dark',
        advancedSettings: 'Advanced settings',
        settings: 'Settings',
        connectedWallet: 'Connected wallet',
        disconnectWallet: 'Disconnect wallet',
        connectWallet: 'Connect wallet',
        support: 'Support',
        twitter: 'Twitter',
        privacy: 'Privacy',
        tos: 'Terms of Service',
        cookiesPolicy: 'Cookies',
        setGasLimit: 'Set gas limit',
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
        totalBalance: 'Total balance',
        asset: 'Asset',
        ticker: 'Ticker',
        price: 'Price',
        marketCap: 'Market cap.',
        amount: 'Amount',
        balance: 'Balance',
        onchain: '{amount} on {chain}',
        viewAll: 'View all',
      },
      pools: {
        title: 'Pools',
        mine: 'My pools',
        all: 'All pools',
        pair: 'Token pair',
        share: 'Your share',
        liquidity: 'Liquidity',
        empty: 'Pools you add liquidity to will appear here.',
        explore: 'Explore pools',
      },
    },
  },
};
