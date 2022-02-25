export const messages = {
  en: {
    appInit: {
      title: 'Entering the portal',
      status: {
        initializing: 'Initializing...',
        assetLoading: 'Loading assets...',
        chainLoading: 'Loading chains...',
        priceFetching: 'Fetching prices...',
        relayerChecking: 'Checking relayers...',
        chainDetails: "Fetching '{displayChain}' details...",
        chainStatus: "Checking '{displayChain}' status...",
        relayerBalanceFetching: 'Fetching relayer balances...',
        liquidityConfigure: 'Configuring liquidity module...',
        poolFetching: 'Fetching liquidity pools...',
        signingIn: 'Signing in...',
      },
    },
    generic_cta: {
      seeall: 'See all',
      done: 'Done',
      agree: 'Agree',
      cancel: 'Cancel',
      confirm: 'Confirm',
      close: 'Close',
      continue: 'Continue',
      noFunds: 'Insufficient funds',
      insufficientAmount: 'Insufficient amount',
      filterNoResults: "No results for '{keyword}'",
      filterRetry: 'Try adjusting your search',
      max: 'Max',
      noSupply: 'Supply amount must be > 1',
      understand: 'I understand',
      getAtom: 'Get ATOM',
      proceed: 'Proceed',
      learnMore: 'Learn more',
      get: 'Get',
      connectToEmeris: 'Connect to Emeris',
      tryTheDemo: 'Try the demo',
      chainDown: '{displayChain} chain appears to be down.',
      balancesInaccurate: 'Your balances on this chain may be temporarily inaccurate.',
      showDetails: 'Show details',
      hideDetails: 'Hide details',
    },
    navbar: {
      portfolio: 'Portfolio',
      assets: 'Assets',
      pools: 'Pools',
      airdrops: 'Airdrops',
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
          text: 'Emeris is only supported on Chrome, Brave, and Edge. We are working hard on supporting for more browsers.',
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
      chainDown: {
        assetsUnavailable: 'Your assets on this chain may be unavailable for some time.',
        appearsDown: 'Emeris connection to {chain} appears to be down',
        partUnavailable:
          'Emeris connection to {chain} appears to be down. Part of your {denom} may be temporarily unavailable.',
        fullUnavailable: 'Your {denom} on {chain} is unavailable right now.',
        fullUnavailableMultiple: 'Your {denom} on {chains} are unavailable right now.',
      },
      cookieConsent: {
        message: 'By using this website, you agree to our',
        linkText: 'Cookie Policy.',
      },
      asset: {
        pooledTooltip: 'Pooled assets are not added to your balance because pool ratios continuously change.',
      },
      withdrawLiquidity: {
        title: 'Withdraw liquidity',
      },
      send: {
        send: 'Send',
        moveAssets: 'Move assets',
        moveAssetsDescription: 'Move assets between your addresses on different chains.',
        sendToAddress: 'Send to address',
        sendToAddressDescription: 'Send assets to someone else or another account with a crypto address.',
      },
      chainSelect: {
        text1: 'You have {asset} on {chainNo} {chains}.',
        text2: 'Select the chain you wish to use.',
      },
      coinList: {
        tooltip: '{asset} on {chain}',
        available: ' available',
        unavailable: ' unavailable',
      },
      denomSelect: {
        select: 'Select asset',
        otherAssets: 'Other assets',
        unavailableSwapPair: 'Unavailable to swap with {pair}',
      },
      feeLevelSelector: {
        feesIncl: 'Fees (included)',
        transactionFee: 'Transaction fee (x{txCount})',
        slowWarning: 'Your transaction may take longer to be processed.',
        swapFee: 'Swap fee',
        estimate: 'Estimated total fees',
      },
      validatorCard: {
        commissionTooltip: 'TODO: commission tooltip',
        maxCommissionTooltip: 'TODO: Max commission tooltip',
        maxChangeRateTooltip: 'TODO: maxChangeRate tooltip',
      },
      stakeForm: {
        selectTitle: 'Select a validator',
        title: 'Enter amount to stake',
      },
      switchForm: {
        selectTitle: 'Select a validator',
        title: 'Enter amount to restake',
      },
      unstakeForm: {
        title: 'Enter amount to unstake',
      },
      moveForm: {
        title: 'Move assets',
        action: 'Move',
        from: 'From',
        to: 'To',
        selectChain: 'Select chain',
        selectAsset: 'Select asset',
        selectChainToSwap: 'Select the chain to swap',
        tooltip: 'Enter amount in {type}',
      },
      sendForm: {
        title: 'Enter an address',
        amountSelect: 'Enter an amount',
        available: 'available',
        to: 'To',
        toPlaceholder: 'Recipient address',
        memo: 'Reference (memo)',
        memoHint:
          'If you are sending to a platform (like a centralized crypto exchange), a memo may be required to identify your transfer',
        memoPlaceholder: 'Add reference (memo)',
        agreeTerms: 'I have reviewed the address and understand that if it is incorrect, my sent funds may be lost.',
        tooltip: 'Enter amount in {type}',
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
        minReceivedLblHint: 'Minimum you will receive if your entire swap is fulfilled.',
        slippageValueError: 'Please enter a valid slippage rate.',
        highSlippageMessage: 'Your swap price may be significantly above the market price.',
      },
      stakeTable: {
        staking: 'Staking',
        unstaking: 'Unstaking',
        earnRewards: 'Earn rewards by staking',
        lockUpAndEarnRewards: 'Lock up your {ticker} and earn passive income with an average {apy}',
        apy: 'APY',
        reward: 'Rewards',
        stakeAsset: 'Stake {ticker}',
        selectValidator: 'Select a validator',
        searchValidator: 'Search validator',
        claimRewards: 'Claim rewards',
        stake: 'Stake',
        unstake: 'Unstake',
        switchValidator: 'Switch validator',
      },
      validatorTable: {
        validator: 'Validator',
        votingPower: 'Voting power',
        commission: 'Commission',
        staked: 'Staked',
        stake: 'Stake',
      },
      feeWarningModal: {
        missingOne: 'You need {denom} to pay fees',
        missingOneText: 'Lorem ipsum',
        missingOneTextAtom: 'Lorem ipsum Atom',
        missingMany: 'You have no assets to pay fees',
        missingManyText: 'For this transfer and swap, the following assets are required to pay fees.',
        claim: {
          missingMany: 'You have no assets to pay fees',
          missingManyText: 'To claim your rewards, the following assets are required to pay fees.',
        },
        stake: {
          missingMany: 'You have no assets to pay fees',
          missingManyText: 'To proceed, the following assets are required to pay fees.',
        },
        unstake: {
          missingMany: 'You have no assets to pay fees',
          missingManyText: 'To proceed, the following assets are required to pay fees.',
        },
        switch: {
          missingMany: 'You have no assets to pay fees',
          missingManyText: 'To proceed, the following assets are required to pay fees.',
        },
        swap: {
          missingMany: 'You have no assets to pay fees',
          missingManyText: 'For this transfer and swap, the following assets are required to pay fees.',
        },
        addliquidity: {
          missingMany: 'You have no assets to pay fees',
          missingManyText: 'To proceed, the following assets are required to pay fees.',
        },
        withdrawliquidity: {
          missingMany: 'You have no assets to pay fees',
          missingManyText: 'To proceed, the following assets are required to pay fees.',
        },
        createpool: {
          missingMany: 'You have no assets to pay fees',
          missingManyText: 'To proceed, the following assets are required to pay fees.',
        },
        transfer: {
          missingMany: 'You have no assets to pay fees',
          missingManyText: 'To proceed, the following assets are required to pay fees.',
        },
        move: {
          missingMany: 'You have no assets to pay fees',
          missingManyText: 'To proceed, the following assets are required to pay fees.',
        },
        ibcWarning: 'You may need {denom} to pay fees',
        ibcWarningText: 'In order to use your {ibcDenom} on {chain}, you may need {denom} to pay fees',
      },
      txStepsModal: {
        chainDown: 'appears to be down, action is temporarily unavailable.',
        chainsDown: 'appear to be down, action is temporarily unavailable.',
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
        couldNotFetchTransactionResult: "Couldn't fetch your transaction result",
        checkTransactionOnBlockExplorer: 'Please check your transaction result on a block explorer.',
        chainDown: 'Transaction failed, the chain is unavailable',
        chainDownDesc:
          'Unfortunately, the chain is unavailable. We are not able to do the transaction, please try later.',
        relayerDown: 'Transaction failed, the relayer is unavailable',
        relayerDownDesc:
          'Unfortunately, the relayer is unavailable. We are not able to do the transaction, please try later.',
        revertTx: 'Reverting transfer...',
        contactSupport: 'Contact support ↗️',
        backToPortfolio: 'Back to portfolio',
        genericAction: 'Transacting',
        transferAction: 'Transferring',
        swapAction: 'Swapping',
        createPoolAction: 'Creating pool',
        stakeAction: 'Staking',
        unstakeAction: 'Unstaking',
        claimAction: 'Claiming rewards',
        switchAction: 'Switching validators',
        addLiqAction: 'Adding liquidity',
        withdrawLiqAction: 'Withdrawing liquidity',
        withdrawing: 'Withdrawing',
        transferred: 'Transferred',

        reset: 'Send another',
        next: 'Next transaction',

        sendAfterSwap: 'Send {displayName} \u2192',
        genericActionComplete: 'Transaction complete',
        transferActionComplete: 'Assets transferred',
        swapActionComplete: 'Assets swapped',
        swapActionPartiallyComplete: 'Assets partially swapped',
        createPoolActionComplete: 'Pool created',
        addLiqActionComplete: 'Liquidity added',
        withdrawLiqActionComplete: 'Liquidity withdrawn',
        stakeActionComplete: 'Staked',
        switchActionComplete: 'Switched validator',
        claimActionComplete: 'Rewards claimed',
        unstakeActionComplete: 'Unstaked',
        swapActionFail: 'Assets failed to be swapped',
        createPoolActionFail: 'Create pool failed',
        addLiqActionFail: 'Add liquidity failed',
        withdrawLiqActionFail: 'Liquidity withdrawal failed',
        txFail: 'Transaction failed',
        stakeActionFail: 'Staking failed',
        switchActionFail: 'Switching validator failed',
        claimActionFail: 'Claiming rewards failed',
        unstakeActionFail: 'Unstaking failed',
        stakeDisclaimer:
          'Your tokens are blocked while staking. You start to earn rewards from the first day. You can unstake or switch validators at any time.',
        noRevert: 'Once executed, transactions cannot be reverted. By continuing, you agree to our',
        received: 'You received {amount} on {chainName}.',
        notSwapped: 'Your {amount} on {chainName} was not swapped.',
        notTransferredAtoB: 'Your {amount} on {chainA} could not be transferred to {chainB}.',
        notTransferred: 'Your {amount} on {chain} could not be transferred.',
        failedSwap: 'Your {amount} could not be swapped to {denom} on the Cosmos Hub.',
        failedAddLiquidity: 'Could not add liquidity to the {denomA} {denomB} pool on the Cosmos Hub.',
        failedCreatePool: 'Could not create a {denomA} / {denomB} pool on the Cosmos Hub.',
        failedWithdrawLiquidity: 'Could not withdraw liquidity from the {denom} on the Cosmos Hub.',
      },
      swap: {
        title: 'Swap',
        payHeader: 'Pay {amount}',
        receiveHeader: 'Receive {amount}',
        priceAlert: 'Prices have changed',
        noPool: 'No pool for this pair',
        swapLimit: 'Swap limit reached',
        insufficentFunds: 'Insufficent funds',
        unAvailable: 'Swap unavailable',
        updatePrice: 'Update prices',
        review: 'Review',
        swap: 'Swap',
        tooltipSwapLimit: `You cannot swap more than 10% of the pool's available liquidity. Try swapping a smaller amount.`,
        tooltipNoPool: 'Currently there is no pool for this pair, please select other pair',
        tooltipChainDown: 'Cosmos Hub appears to be down, swap is temporarily unavailable',
      },
      transferToHub: {
        swap: 'Assets are swapped on the Cosmos Hub',
        swapDescription: 'Your {denom} must first be transferred to the Cosmos Hub before they can be swapped.',
        stake: '{denom} are staked on the {chain} chain',
        stakeDescription:
          'In order to stake your {denom}, your {denom} must first be transferred to the {chain} chain.',
        addLiquidity: 'Pools are on the Cosmos Hub',
        addLiquidityDescription:
          'In order to add liquidity to a pool, your {denom} must be transferred to the Cosmos Hub.',
        addLiquidityDescriptionMultiple:
          'In order to add liquidity to a pool, your {denomA} and {denomB} must be transferred to the Cosmos Hub.',
        transfer: 'Cross-chain transfers',
        transferSubtitle: '{from} to {to}',
        transferDescription:
          'Emeris gives you the ability to transfer your assets to different chains. This is made possible through a brand new protocol for inter-blockchain communication.',
        transferDescriptionMultiple:
          'You are about to send {denom} from {fromChain} to {toChain}. Because your {denom} are not on their native chain ({nativeChain}), they will need to be transferred back to {nativeChain} before they can be sent to {toChain}. This means you will need to sign two transactions.',
        transferDescriptionMultipleMemo:
          'You are about to send {denom} from {fromChain} to {toChain}. Because your {denom} are not on their native chain ({nativeChain}), they will need to be transferred back to {nativeChain} before they can be sent to {toChain} and you specified a memo. This means you will need to sign three transactions.',
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
          txToSignHint:
            'The asset you are trying to send is not on its native chain. As a result, two transactions are required to perform this transfer',
          txToSignMemoHint:
            'The asset you are trying to send is not on its native chain and you specified a memo. As a result, three transactions are required to perform this transfer',
          txToSignMemoNoRedeemHint:
            'You are sending an asset to another chain and specified a memo. As a result, two transactions are required to perform this transfer',
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
          minReceivedLblHint: 'Minimum you will receive if your entire swap is fulfilled.',
          limitPriceLbl: 'Limit price',
          limitPriceLblHint: 'Assets will not be swapped at a higher rate than the limit rate.',
          feesLbl: 'Fees',
          feeLbl: 'Transaction fee',
          feeLblHint: 'Base fee paid to the network',
          swapFeeLbl: 'Swap fee',
          swapFeeLblHint: 'Swap fee paid to liquidity providers',
        },
        claim: {
          totalRewards: 'Total rewards',
          validators: 'Validators',
          transactionFee: 'Transaction fee',
          rewards: 'rewards',
        },
        stake: {
          stakeLbl: 'Stake',
          validatorsLbl: 'Validators',
          stakedLbl: 'Stake',
          feeLbl: 'Transaction fee',
          feeLblHint: 'Base fee paid to the network',
        },
        switch: {
          stakeLbl: 'Stake',
          fromLbl: 'From',
          toLbl: 'To',
          feeLbl: 'Transaction fee',
          feeLblHint: 'Base fee paid to the network',
        },
        unstake: {
          unstakeLbl: 'Unstake',
          claimLbl: 'Claim rewards',
          fromLbl: 'From',
          periodLbl: 'Unstaking period',
          periodVal: '{days} days',
          availLbl: 'Staked assets available',
          feeLbl: 'Transaction fee',
          feeLblHint: 'Base fee paid to the network',
        },
      },
      settingsMenu: {
        theme: 'Theme',
        system: 'System',
        light: 'Light',
        dark: 'Dark',
        advancedSettings: 'Advanced settings',
        settings: 'Settings',
        version: 'Version',
        connectedWallet: 'Connected wallet',
        disconnectWallet: 'Disconnect wallet',
        connectWallet: 'Connect wallet',
        support: 'Support',
        telegram: 'Telegram',
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
      poolBanner: {
        title: 'What is {denom} ?',
        body: `{denom} ({ticker}) is a liquidity pool (LP) asset. This token represents a share of
        the {pairName} liquidity pool.`,
        viewPool: 'View pool',
      },
      intro: {
        welcomeTo: 'Welcome to',
        introductoryGuide: 'Introductory guide',
      },
      moonpayBanner: {
        title: 'Purchase {asset}',
        poweredBy: 'Powered by Moonpay',
      },
      simplexBanner: {
        title: 'Purchase {asset}',
        poweredBy: 'Powered by Simplex',
      },
      avatar: {
        priceApiDown: 'Asset prices are currently unavailable.',
      },
      simplex: {
        transactionSuccessful: 'Transaction successful. Please refresh this page.',
        transactionFailed: 'Transaction failed. Please refresh this page.',
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
      moonpay: {
        cta: 'Add crypto to your account',
      },
      simplex: {
        cta: 'Add crypto to your account',
      },
      transaction: {
        viewOnExplorer: 'View on explorer',
      },
      assets: {
        title: 'Assets',
        totalBalance: 'Total balance',
        asset: 'Asset',
        ticker: 'Ticker',
        price: 'Price',
        marketCap: 'Market Cap',
        amount: 'Amount',
        balance: 'Balance',
        onchain: '{amount} on {chain}',
        lastWeek: 'Last 7 Days',
        lastDay: '24h',
        viewAll: 'View all',
      },
      airdrops: {
        title: 'Airdrops',
        asset: 'Asset',
        date: 'Date',
        action: 'Action',
        amount: 'Amount',
        viewAll: 'View all',
        allAirdrops: 'All airdrops',
        airdropContentDisclaimer:
          'Content in this section is provided by individual projects and may be subject to change at any time. It is not intended as financial advice.',
        featureProjects: 'Feature your project’s airdrop',
        airdropstableFilterItems: {
          all: 'All airdrops',
          mine: 'My airdrops',
          upcoming: 'Upcoming',
          live: 'Live',
          past: 'Past',
        },
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
      stake: {
        title: 'Stake',
        enterAmount: 'Enter amount to stake',
        claimRewards: 'Claim rewards',
      },
      transactions: {
        status: 'Status',
        ticket: 'Ticket',
        error: 'Error',
        transacting: {
          notifiedWhenCompleteSwap: 'You will be notified when your swap is complete.',
          notifiedWhenComplete: 'You will be notified when your transaction is complete.',
        },
        review: {
          transfer: 'Review your transfer details',
          move: 'Review your move details',
          swap: 'Review your swap details',
          addliquidity: 'Review your pool liquidity provision',
          withdrawliquidity: 'Review your liquidity withdrawal',
          createpool: 'Review your liquidity pool provision',
          claim: 'Claim rewards',
          stake: 'Review your stake',
          unstake: 'Review your unstaking details',
          switch: 'Review your restaking details',
        },
        cancel: {
          title: 'Are you sure you want to cancel this transaction?',
          description: 'This action cannot be reverted.',
        },
        type: {
          transfer: 'transfer',
          ibc_forward: 'transfer',
          ibc_backward: 'transfer',
          swap: 'swap',
          addliquidity: 'pool liquidity provision',
          withdrawliquidity: 'liquidity withdrawal',
          createpool: 'liquidity pool provision',
        },
        waitingPrevious: {
          title: 'Pending transaction',
          description: 'Your transaction is pending, waiting for other transactions to complete on the {chain} chain.',
        },
        receipt: {
          swappedOnHub: 'Swapped on the Cosmos Hub',
        },
        widget: {
          description: {
            validating: 'Preparing transaction...',
            transacting: 'Transaction in progress...',
            transactingPartial: 'Transaction in progress ({offset}/{total})...',
            signing: 'Signing...',
            waitingPreviousTransaction: 'Pending',
            success: 'Transaction completed',
            review: 'Sign in Keplr',
            reviewPartial: 'Sign in Keplr ({offset}/{total})',
            receipt: 'Partially completed ({offset}/{total})',
            failed: {
              sign: 'Transaction not signed',
              unknown: "Couldn't fetch result",
              default: 'Transaction failed',
            },
          },
        },
        controls: {
          ok: 'OK',
          cancel: 'Cancel',
          cancelTransaction: 'Cancel transaction',
          tryAgain: 'Try again',
          keepIt: 'Keep It',
          sign: 'Sign',
          waitingTransactionTooltip: 'Waiting for other transactions to complete on the {chain}.',
          next: 'Next',
          confirmAndContinue: 'Confirm and continue',
          connectWallet: 'Connect Wallet',
          done: 'Done',
          sendAmount: 'Send {amount}',
          sendAnotherAsset: 'Send another asset',
          swapAnotherAsset: 'Swap another asset',
          backToEmeris: 'Back to Emeris',
        },
      },
    },
    pages: {
      addLiquidity: {
        addLiquidity: 'Add liquidity',
        createNew: 'Create new pool',
        selectCTA: 'Select two assets',
        available: 'available',
        pool: 'pool',
        firstProvider: 'You are the first liquidity provider',
        insufficientAmountHint: 'The amount you are trying to supply is too low. Please try a greater amount',
        firstProviderWarning:
          'As the first liquidity provider to the {tickerA} · {tickerB} pool, you will be creating the pool and setting the price. Proceed with caution.',
        supplyLbl: 'Supply',
        fromLbl: 'From',
        hubWarning: 'Your assets will be transferred to Cosmos Hub',
        createWarning: 'Creating a pool is risky business',
        arbitrageWarning:
          'As the first liquidity provider, you are setting the pool price. This means that if you don’t know what you are doing, you may risk significant loss as a result of arbitrage.',
      },
      asset: {
        balance: 'Balance',
        available: 'Available',
        staked: 'Staked',
        pooled: 'Pooled',
        pooledWarning: 'Pooled Warning',
        chains: 'Chains',
        pools: 'Pools',
        pooled: 'Pooled',
        staking: 'Staking',
        unbonding: 'Unstaking',
        highLow: 'High {high} / Low {low}',
        priceDiff: '{diff} ({percent})',
      },
      assets: {
        assets: 'Assets',
      },
      chains: {
        chains: 'Chains',
      },
      portfolio: {},
      receive: {
        select: 'Select asset',
        receive: 'Receive',
        on: 'on',
        yourAddress: 'Your address',
      },
      redeem: {
        title: 'Redeeming assets',
        instructions:
          'You hold assets with a transfer history that is not supported by Demeris. If you wish to use these assets with Demeris, you must first redeem them.',
        learnMore: 'Learn more about redeeming',
        select: 'Select an asset to redeem',
        cta: 'Redeem',
      },
      send: {
        where: 'Where are you sending assets?',
      },
      welcome: {},
      withdrawLiquidity: {
        withdraw: 'Withdraw',
        from: 'From',
        available: 'available',
        receive: 'Receive',
        on: 'On',
        hubWarning: 'Your assets will be transferred to Cosmos Hub',
      },
    },
  },
};
