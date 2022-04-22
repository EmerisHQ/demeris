## Swap implementation for DEX aggregator

### Dependencies

To be ready to work it requires 3 data providers:

- User balances, for UI purposes, such as calculating the maximum amount available, validating that there are sufficient funds.
- Swap routes (daggregation), trace all available routes to swap one denom to another.
- Swaps info (dexinfo), list of all available pools and its properties like fee rate, protocol, and reserve balances.

And `emeris-mapper`, a library that translates an agnostic transaction to a valid message in the corresponding blockchain/DEX to be signed by wallets (Keplr / Emeris Extension).

### Structure

```
├──SwapMultiDex.vue
Entry file

├──SwapViewDetails.vue
This component is used to display a transaction in the `review` or `receipt` state.

├── components/
Vue components that interacts with the swap machine instance

├── logic/
Folder with all the necessary methods that should be used by machine and components. Preferably it must be a pure function, that does not make side effects and receive the necessary data by parameters.

├── state/
    ├── machine.ts
    A finite-state machine built with XState that handles all the business logic and async flow necessary to swap one denom to another.
    It is not responsible for UI states like showing input asset list, can also be ported to another codebase like (extension) without noise.

    └── store.ts
    A Pinia-store that handles UI related variables, like components visibility and current machine service, also cache data used across instances.
```

### Learn more

- [daggregation](https://github.com/EmerisHQ/daggregation)
- [dexinfo](https://github.com/EmerisHQ/emeris-dexinfo)
- [emeris-mapper](https://github.com/EmerisHQ/emeris-libraries/tree/develop/packages/mapper)
- [Pinia](https://pinia.vuejs.org/)
- [XState](https://xstate.js.org/docs/)
