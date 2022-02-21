# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

## 0.1.12 - 2022-02-18

### Features

- Update support url
- Added e2e testing
- Slippage tolerance
- Staking
- Documentation
- Analytics User ID Tracking
- Forced build to Node 16

### Fixes

- Simplex GA
- Webpack less verbose in logs
- Chart component fixes before starting feature

## 0.1.11 - 2022-02-11

### Features

- Price difference value and percentage implemented (under price)

### Fixes

- Minor fixes on base chart component and asset price performance chart

## 0.1.10 - 2022-02-10

### Features

- Dex Aggregation Exchanges Filter
- Simplex integration for US

### Fixes

- Display of wrong denom name in asset tables
- Prevent failure with min pool receive amount
- Pending transaction modal behavior

## 0.1.9 - 2022-02-07

### Features

- Adjust netlify builds

### Fixes

- Fixes Asset line chart component not displaying when switching between assets

## 0.1.8 - 2022-02-03

### Features

- Asset page Price Chart
- Transactions center widget
- Feature flags

### Fixes

- Hide unverified assets
- Fixed some copy in the transaction widget
- Fixes Ts error
- Fixes flickering in circlesymbol
- Fixes Asset line chart component not displaying when switching between assets

## 0.1.7 - 2022-01-17

### Updates

- Added Vega SDK update support
- Liquidity module update
- IBC module update
- Vuex store refactoring (performance enhancement)
- Limit reactivity when nothing to update (performance enhancement)

### Fixes

- Amount precision in add/withdraw liquidity forms
- Pool price variation fix
- Allow oepration when prices API is unavailable
- Asset flickering bug
- Ensure data is loaded before rendering
- Max amount calculation improvements
- Handle corrupt asset data from DB

## 0.1.6 - 2021-11-24

### Updates

- Likecoin, Bitcanna, Juno added to demo account
- Updated API endpoints & production deployment
- Updated descriptions for cross-chain transfers with Memo

### Fixes

- Correct pool asset price on pools with reserves of differing precision
- Fix swap calcuilation for pools with very small swap ratio
- Fix withdraw liquidity summary page
- Null checks for IBC reserve denom information

## 0.1.5 - 2021-10-26

- Includes 0.1.4 hotfixes

### Updates

- Added additional asset colors

### Fixes

- Fix inaccurate values on transaction receipt under certain conditions
- Show dash instead of 0 for assets lacking a price feed.
- Display balances when prices API is down
- Fixes in UX flow when operation is cancelled

## Hotfix - 2021-10-24

- Added endpoints for terra, microtick, bitcanna, juno and likecoin Keplr support

## Hotfix - 2021-10-20

- Fixed disappearing tx handling modal in certain cases

## 0.1.4 - 2021-10-19

### Updates

- Added fallback price calculation from relevant ATOM pool
- Refactored gas-price-level access

### Fixes

- Fixed total balance with staking decimal amounts
- Fixed user balance when price API is down
- Fixed getPrice for IBC denoms on chains other than cosmos-hub
- Added missing tooltip
- Cleaned up console and linting warnings
- Improved cancel flow

## 0.1.3 - 2021-10-13

### Updates

- Improve asset order in Receive page
- Add e-money support to demo account

### Fixes

- Update Chain Down banner text
- Improved pool name
- Improved partial swap result
- Fixed pool price display decimals
- Fixed ability to change chain on Withdraw page
- Replaced hardcoded text to i18n
- Fixed No pool warning in Swap
- Fixed balance check in Swap
- Temporarily remove relayer status warnings

### Perfomance

## 0.1.2 - 2021-09-29

### Updates

- Added additional data-tracking analytics
- Added notification components and tooltips for offline/unavailable chains

### Fixes

- Added an asset send button on the swap complete modal
- Fixed swap widget empty state switch button not working
- Fixed keplr account switching makes a swap button not working
- Added a correct tooltip for no pool status
- Improved empty wallet balance error handling
- Pre-select default asset in Send form
- Excluded a 0 amount asset on the chain select modal
- Added missing IBC info URL
- Fixed multi-tx transfer interstitial disclaimer
- Fixed add/withdraw liquidity dollar amount calculations
- Fixed a max button without fiat
- Fixed set a default coin for an empty wallet
- Added support URLs
- Added 404 redirects

### Perfomance

## 0.1.1 - 2021-09-01

### Updates

- A user's pooled assets now have a tooltip that breaks down how many assets are withdrawable in each liquidity pool
- Added a version number for each update, viewable in the Settings dropdown
- Enabled user analytics and cookie banner.
- Show default asset to swap based in the user's balance
- Support for more chromium-like browsers
- Order assets based in the user's amount
- Order pools based in the user's share
- Show LP token price

### Fixes

- Staking balances are now correctly added to a user's total balance
- Fixed text in several areas
- Fixed precision when clicking on Max button
- Fixed swap stuck loading for empty accounts
- Improved swap receive amount calculations
- Improved pool supply ratio
- Fixed scroll down not working in Receive page
- Fixed page reloading not loading data in multiple pages
- Fixed IBC transfer wrong address display
- Fixed focus on search inputs

### Perfomance

- Fixed stuck transactions continued to poll the backend
- Queue requests to staking balances and prices API
- Improved cache storage for all queries
- Reduced requests to fetch pool balances

## 0.1.0 - 2021-08-17

- First release 🎉
