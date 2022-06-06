[![Netlify Status](https://api.netlify.com/api/v1/badges/4cf6e90b-b924-4764-9adb-796ee24667f3/deploy-status)](https://app.netlify.com/sites/emeris-app/deploys) [![Unit & E2E](https://github.com/EmerisHQ/demeris/actions/workflows/test.yml/badge.svg)](https://github.com/EmerisHQ/demeris/actions/workflows/test.yml)

# emeris-web

Web version of Emeris, the Interface to the Internet of Blockchains.

## Develop

Before contributing, please familiarize yourself with the [Frontend Engineering Guidelines](https://www.notion.so/allinbits/Frontend-Engineering-Guidelines-873d2c6e2dda493fbf6601d527259efd).

## Running Emeris

⚠️ Since currently dev is unstable at best, we recommend to run Emeris in production mode.

```
npm ci
npm run serve
```

### Configuration

By default, Emeris will run on production API's, and there will be no mnemonic configured. There are 2 ways to configure Emeris to a different environment:

Ensure you create an `.env.local` file, with the following:

```
#This mnemonic is used for automated testing. Right now, our e2e tests expect ATOM to be present in the balance of the accountholder. Uncomment and replace your mnemonic to make the tests pass locally.
#VITE_EMERIS_MNEMONIC={ your mnemonic }

#Uncomment below to enable dev API's
#VITE_FEATURE_USE_DEV=true

#Uncomment below to enable staging API's
#VITE_FEATURE_USE_STAGING=true

#Uncomment below to enable DEBUG mode
#Debug mode means:
#- No constant polling of balances (be careful with this, as you see things different than our customers)
#VITE_FEATURE_DEBUG=true
```

You can also use URL parameters to easily switch evironment, like this:

- https://localhost:8080?VITE_FEATURE_USE_DEV=true
- https://localhost:8080?VITE_FEATURE_USE_STAGING=true

### Shortcomings on development mode

At the moment, when running in development mode, the swap module will not be working (we need to fix this!).

The reason for this is that on development we need to have at least 3 chains (to allow for future redeem/multi-hop tests).

A potential way of solving this in the future would be if we provide 2 ways of running Emeris in development:

1. with simulated chains where we ourselves manage the data locally which you could locally change (so least dependencies)
2. by running multiple chains testnets

## Testing

### Automated testing - Playwright (e2e testing)

Before you are able to run our automated tests locally, ensure you configured your `.env.local` file with a mnemonic with ATOM and AKT.

Test commands:

```
# Run all tests in headless mode
npm run dev && npm run e2e

# Run one specific (failing) test in debug mode
PWDEBUG=1 npx playwright test e2e/assets-page.spec.ts --retries=1

```

### Automated testing - Vitest (unit testing)

```
# Run all unit tests
npm run test:unit

# Run one specific unit test
npm run test:unit -t src/features/transactions/components/TransactionsCenterActionButton.spec.ts
```

### Manual testing transactions / swaps

In order to do testing, we can send $10-$20 to devs from the demo account upon request. Ask in #emeris-frontend-team how to do this (docs to be added).

## Build

```
npm run build
```

## Feature Flags

We are currently using Feature Flags in order to toggle on/off functionality. This helps us to separate release from deploy, and they function as a safety net.

Right now, because we don't have a [good feature management system in place](https://github.com/allinbits/demeris/issues/949), we list all the features in the codebase in the `.env` file as a comment.

[Learn more about feature flags](https://www.notion.so/allinbits/Working-with-Feature-Flags-c0bbf36cbb2646de9e6754564394bdc2)

## Maintenance Screen

In case of emergencies, for example the backend API's are down, it's possible for us to show a maintenance screen to the customers of Emeris. To do this, change `VITE_FEATURE_MAINTENANCE_SCREEN` to `true` in the [Netlify environment variables](https://app.netlify.com/sites/emeris-app/settings/deploys#environment), and [trigger a deploy](https://app.netlify.com/sites/emeris-app/deploys).

## Demo Account

Currently Emeris uses a specific account to be used as demo, you can override it using an environment variable with the wallet's public key:

```
VITE_EMERIS_DEMO_PUBKEY=A1OICufyXCvxCPl+humMapyHLXu3bdVMJCLEam3bmq1Q
```

To find the public key of a specific address, you will need to get a transaction signed by the wallet (in any chain):

- Go to https://www.mintscan.io
- Search the target address
- Click in any transaction sent\* to check its details
- Check the raw data by pressing the JSON button (at top-right)
- In the `auth_info` field, there is a `public_key` property, `key` is the value you need.
