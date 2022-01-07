# emeris-web

Web version of Emeris, the Interface to the Internet of Blockchains.

## Develop

Before contributing, please familiarize yourself with the [Frontend Engineering Guidelines](https://www.notion.so/allinbits/Frontend-Engineering-Guidelines-873d2c6e2dda493fbf6601d527259efd).

### To start Emeris in development mode

⚠️ Since currently dev is unstable at best, please refer below to "To start Emeris in staging/production mode" section.

```
npm ci
npm run serve
```

At the moment, when running in development mode, the swap module will not be working (we need to fix this!).

The reason for this is that on development we need to have at least 3 chains (to allow for future redeem/multi-hop tests).

A potential way of solving this in the future would be if we provide 2 ways of running Emeris in development:

1. with simulated chains where we ourselves manage the data locally which you could locally change (so least dependencies)
2. by running multiple chains testnets

For the time being, if you want a fully functioning version of Emeris:

### To start Emeris in staging/production mode

```
npm run serve:staging
```

or

```
npm run serve:production
```

## Testing transactions / swaps

In order to do testing, we can send $10-$20 to devs from the demo account upon request. Ask in #emeris-frontend-team how to do this (docs to be added).

## Build

```
npm run build
```
