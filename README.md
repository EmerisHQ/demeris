[![Netlify Status](https://api.netlify.com/api/v1/badges/4cf6e90b-b924-4764-9adb-796ee24667f3/deploy-status)](https://app.netlify.com/sites/emeris-app/deploys)

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
#VUE_APP_EMERIS_MNEMONIC={ your mnemonic }

#Uncomment below to enable dev API's
#VUE_APP_FEATURE_USE_DEV=true

#Uncomment below to enable staging API's
#VUE_APP_FEATURE_USE_STAGING=true
```

You can also use URL parameters to easily switch evironment, like this:

- https://localhost:8080?VUE_APP_FEATURE_USE_DEV=true
- https://localhost:8080?VUE_APP_FEATURE_USE_STAGING=true

### Shortcomings on development mode

At the moment, when running in development mode, the swap module will not be working (we need to fix this!).

The reason for this is that on development we need to have at least 3 chains (to allow for future redeem/multi-hop tests).

A potential way of solving this in the future would be if we provide 2 ways of running Emeris in development:

1. with simulated chains where we ourselves manage the data locally which you could locally change (so least dependencies)
2. by running multiple chains testnets

## Testing

### Automated testing - Cypress (e2e testing)

Before you are able to run our automated tests locally, ensure you configured your `.env.local` file with a mnemonic with ATOM.

Test commands:

```
# Run all tests in headless mode
npx cypress run

# Run one specific test in headed mode
npx cypress run --spec cypress/integration/welcome-page-visual.spec.js --headed --no-exit
```

### Automated testing - Jest (unit testing)

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
