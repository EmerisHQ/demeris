# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

## 0.1.3 - TBD

### Updates

- Improve asset order in Receive page

### Fixes

- Improved pool name
- Improved partial swap result
- Fixed pool price display decimals
- Fixed ability to change chain on Withdraw page
- Replaced hardcoded text to i18n
- Fixed No pool warning in Swap
- Fixed balance check in Swap

### Perfomance

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
