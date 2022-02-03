## Machine

Responsible from validation to transmission for each step in the list.

A state machine created with [XState](https://xstate.js.org), with 13 possible states:

### idle

The initial state, where we are expecting to user send the data required to perform, you can start it by sending.

```js
// Please check all required data in the file
machine.send({ type: "SET_DATA", action: "swap", gasPriceLevel: "low", steps: [], ... })
```

### ibcConfirmation

The user needs to confirm that it will need to transfer funds to the Hub first.

### validating

Before signing we make some verifications to ensure that it can be brodcasted.

- If the user has assets necessary to perform.
- If the chain is down and will no process the transaction.
- If all IBC denoms are valid
- If there is any pending transaction for the same chain.

### feeWarning

If the fee validation fails, the user will be notified if they wish to proceed, when possible.

### waitingPreviousTransaction

If there is any pending transaction for the same chain, it will need to wait until the previous transaction emits an event when it completes to recheck.

### review

Verify informations that will be signed, then press to Sign.

### signing

Try to sign with Keplr.

### transacting

With the signed data, it will now try to broadcast, and then check the blockchain to confirm that it was correctly accepted.

### next

A helper state to choose where to go, if there are more steps or transactions then it will change to `receipt`, otherwise `success`.

### receipt

Transaction successfully broadcasted, but there is more to sign.

### success

All steps completed.

### failed

For some substates will can try again or just abort.

### aborted

Can not interact anymore. Create a new one to start again.

###

     ┌───────┐   ┌──────────────────┐
     │ *idle ├───► *ibcConfirmation │
     └───────┘   └──────────┬───────┘
                            │
                    ┌───────▼─────┐
                    │ *validating │
                    └───────┬─────┘
                        ┌───┴──┐               ┌─────────────┐
       ┌────────────────┤ fees ├───────────────┤ *feeWarning │
       │                └──┬───┘               └──────┬──────┘
       │                ┌──┴────────┐                 │
       ├────────────────┤ chainDown ◄─────────────────┘
       │                └──┬────────┘          ┌─────────────────────────────┐
       │                ┌──┴───────────┐       │ *waitingPreviousTransaction │
       ├────────────────┤ traceChannel │       └─────┬──────▲────────────────┘
       │                └──┬───────────┘             │      │
       │                ┌──┴──────────────────┐      │      │
       ├────────────────┤ previousTransaction ◄──────┘      │
       │                └────┬────────────────┘─────────────┘
       │                     │
       │                 ┌───┴─────┐
       │                 │ *review ◄─────────────────┐
       │   ┌─────────┐   └─────┬───┘                 │
       │   │ *failed ├────┐    │                     │
       │   └───┬─────┘    │ ┌──▼───────┐             │
       │       │    ┌─────┴─┤ *signing ◄──────────┐  │
       │   ┌───▼────▼─┐     └───┬──────┘          │  │
       └───► *aborted │         │                 │  │
           └──────────┘     ┌───▼──────────┐      │  │
                            │ *transacting │      │  │
                            └────────────┬─┘      │  │
                                ┌────────┴─────┐  │  │
                                │ broadcasting │  │  │
                                └────────┬─────┘  │  │
                                ┌────────┴───┐    │  │
                                │ confirming │    │  │
                                └───┬────────┘    │  │
                                    │             │  │
                                 ┌──▼────┐        │  │
                             ┌───┤ *next │        │  │
                             │   └─────┬─┘        │  │
                             │   ┌─────┴────┐     │  │
                             │   │ *receipt ├─────┴──┘
                             │   └──────────┘
                             │   ┌──────────┐
                             └───┤ *success │
                                 └──────────┘

## Store

Manages the UI state for all the components interacting with a machine, also store a list of pending transactions.
