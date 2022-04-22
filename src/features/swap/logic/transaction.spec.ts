/* eslint-disable max-lines */
import { getGravityResultFromDecodedEvents, parseEncodedEvents, resolveSwapResponse } from './transaction';

const osmosisEvents = [
  {
    type: 'tx',
    attributes: [
      {
        key: 'ZmVl',
        value: 'MHVvc21v',
        index: true,
      },
    ],
  },
  {
    type: 'tx',
    attributes: [
      {
        key: 'c2lnbmF0dXJl',
        value:
          'ZGw5TU1RQ01yYnhEOFRaMzRKV1luM25YY2hiZ1k5VDhkOE1lUkxmbUh6NWxWM1cxYmNvRzZlNmFMbXBiWnNZWkJlNzB2QkNRVWZpMksrR1ZSRHFYT0E9PQ==',
        index: true,
      },
    ],
  },
  {
    type: 'message',
    attributes: [
      {
        key: 'YWN0aW9u',
        value: 'L29zbW9zaXMuZ2FtbS52MWJldGExLk1zZ1N3YXBFeGFjdEFtb3VudElu',
        index: true,
      },
    ],
  },
  {
    type: 'coin_spent',
    attributes: [
      {
        key: 'c3BlbmRlcg==',
        value: 'b3NtbzF6NW55eDg3YzAzbDR1dmR5MHZ0MnA4Nm5nMG1sNDJjeHo0d3I4Nw==',
        index: true,
      },
      {
        key: 'YW1vdW50',
        value: 'MTAwMDB1b3Ntbw==',
        index: true,
      },
    ],
  },
  {
    type: 'coin_received',
    attributes: [
      {
        key: 'cmVjZWl2ZXI=',
        value: 'b3NtbzFoZWszZndndGx4Z2p2c2dwbGhzdWNwejd3N3E5dmxwNm1qbTVtMGM4NG5hMHgyeTl5NDNxeW5yczZn',
        index: true,
      },
      {
        key: 'YW1vdW50',
        value: 'MTAwMDB1b3Ntbw==',
        index: true,
      },
    ],
  },
  {
    type: 'transfer',
    attributes: [
      {
        key: 'cmVjaXBpZW50',
        value: 'b3NtbzFoZWszZndndGx4Z2p2c2dwbGhzdWNwejd3N3E5dmxwNm1qbTVtMGM4NG5hMHgyeTl5NDNxeW5yczZn',
        index: true,
      },
      {
        key: 'c2VuZGVy',
        value: 'b3NtbzF6NW55eDg3YzAzbDR1dmR5MHZ0MnA4Nm5nMG1sNDJjeHo0d3I4Nw==',
        index: true,
      },
      {
        key: 'YW1vdW50',
        value: 'MTAwMDB1b3Ntbw==',
        index: true,
      },
    ],
  },
  {
    type: 'message',
    attributes: [
      {
        key: 'c2VuZGVy',
        value: 'b3NtbzF6NW55eDg3YzAzbDR1dmR5MHZ0MnA4Nm5nMG1sNDJjeHo0d3I4Nw==',
        index: true,
      },
    ],
  },
  {
    type: 'coin_spent',
    attributes: [
      {
        key: 'c3BlbmRlcg==',
        value: 'b3NtbzFoZWszZndndGx4Z2p2c2dwbGhzdWNwejd3N3E5dmxwNm1qbTVtMGM4NG5hMHgyeTl5NDNxeW5yczZn',
        index: true,
      },
      {
        key: 'YW1vdW50',
        value:
          'MTQ4NTMwODZpYmMvRTY5MzFGNzgwNTdGN0NDNURBMEZENkNFRjgyRkYzOTM3M0E2RTA0NTJCRjFGRDc2OTEwQjkzMjkyQ0YzNTZDMQ==',
        index: true,
      },
    ],
  },
  {
    type: 'coin_received',
    attributes: [
      {
        key: 'cmVjZWl2ZXI=',
        value: 'b3NtbzF6NW55eDg3YzAzbDR1dmR5MHZ0MnA4Nm5nMG1sNDJjeHo0d3I4Nw==',
        index: true,
      },
      {
        key: 'YW1vdW50',
        value:
          'MTQ4NTMwODZpYmMvRTY5MzFGNzgwNTdGN0NDNURBMEZENkNFRjgyRkYzOTM3M0E2RTA0NTJCRjFGRDc2OTEwQjkzMjkyQ0YzNTZDMQ==',
        index: true,
      },
    ],
  },
  {
    type: 'transfer',
    attributes: [
      {
        key: 'cmVjaXBpZW50',
        value: 'b3NtbzF6NW55eDg3YzAzbDR1dmR5MHZ0MnA4Nm5nMG1sNDJjeHo0d3I4Nw==',
        index: true,
      },
      {
        key: 'c2VuZGVy',
        value: 'b3NtbzFoZWszZndndGx4Z2p2c2dwbGhzdWNwejd3N3E5dmxwNm1qbTVtMGM4NG5hMHgyeTl5NDNxeW5yczZn',
        index: true,
      },
      {
        key: 'YW1vdW50',
        value:
          'MTQ4NTMwODZpYmMvRTY5MzFGNzgwNTdGN0NDNURBMEZENkNFRjgyRkYzOTM3M0E2RTA0NTJCRjFGRDc2OTEwQjkzMjkyQ0YzNTZDMQ==',
        index: true,
      },
    ],
  },
  {
    type: 'message',
    attributes: [
      {
        key: 'c2VuZGVy',
        value: 'b3NtbzFoZWszZndndGx4Z2p2c2dwbGhzdWNwejd3N3E5dmxwNm1qbTVtMGM4NG5hMHgyeTl5NDNxeW5yczZn',
        index: true,
      },
    ],
  },
  {
    type: 'token_swapped',
    attributes: [
      {
        key: 'bW9kdWxl',
        value: 'Z2FtbQ==',
        index: true,
      },
      {
        key: 'c2VuZGVy',
        value: 'b3NtbzF6NW55eDg3YzAzbDR1dmR5MHZ0MnA4Nm5nMG1sNDJjeHo0d3I4Nw==',
        index: true,
      },
      {
        key: 'cG9vbF9pZA==',
        value: 'Mjg1',
        index: true,
      },
      {
        key: 'dG9rZW5zX2lu',
        value: 'MTAwMDB1b3Ntbw==',
        index: true,
      },
      {
        key: 'dG9rZW5zX291dA==',
        value:
          'MTQ4NTMwODZpYmMvRTY5MzFGNzgwNTdGN0NDNURBMEZENkNFRjgyRkYzOTM3M0E2RTA0NTJCRjFGRDc2OTEwQjkzMjkyQ0YzNTZDMQ==',
        index: true,
      },
    ],
  },
  {
    type: 'message',
    attributes: [
      {
        key: 'bW9kdWxl',
        value: 'Z2FtbQ==',
        index: true,
      },
      {
        key: 'c2VuZGVy',
        value: 'b3NtbzF6NW55eDg3YzAzbDR1dmR5MHZ0MnA4Nm5nMG1sNDJjeHo0d3I4Nw==',
        index: true,
      },
    ],
  },
];

const gravityEvents = [
  {
    type: 'coin_spent',
    attributes: [
      {
        key: 'c3BlbmRlcg==',
        value: 'Y29zbW9zMXR5Z21zM3hoaHMzeXY0ODdwaHgzZHc0YTk1am43dDdscG00NzBy',
        index: true,
      },
      {
        key: 'YW1vdW50',
        value: 'NDAwMDAwMDB1YXRvbQ==',
        index: true,
      },
    ],
  },
  {
    type: 'coin_received',
    attributes: [
      {
        key: 'cmVjZWl2ZXI=',
        value: 'Y29zbW9zMWYzZ25tMm5nZDI2aDN0d3QwZDZldnZ0cHIwOWhhMHk3M2Vycmxq',
        index: true,
      },
      {
        key: 'YW1vdW50',
        value: 'NDAwMDAwMDB1YXRvbQ==',
        index: true,
      },
    ],
  },
  {
    type: 'complete_unbonding',
    attributes: [
      {
        key: 'YW1vdW50',
        value: 'NDAwMDAwMDB1YXRvbQ==',
        index: true,
      },
      {
        key: 'dmFsaWRhdG9y',
        value: 'Y29zbW9zdmFsb3BlcjFzamxsc25yYW10ZzNld3hxd3dyd2p4ZmdjNG40ZWY5dTJsY25qMA==',
        index: true,
      },
      {
        key: 'ZGVsZWdhdG9y',
        value: 'Y29zbW9zMWYzZ25tMm5nZDI2aDN0d3QwZDZldnZ0cHIwOWhhMHk3M2Vycmxq',
        index: true,
      },
    ],
  },
  {
    type: 'swap_transacted',
    attributes: [
      {
        key: 'cG9vbF9pZA==',
        value: 'Nw==',
        index: true,
      },
      {
        key: 'YmF0Y2hfaW5kZXg=',
        value: 'MTI2NDY=',
        index: true,
      },
      {
        key: 'bXNnX2luZGV4',
        value: 'MTA0MTQ=',
        index: true,
      },
      {
        key: 'c3dhcF9yZXF1ZXN0ZXI=',
        value: 'Y29zbW9zMXo1bnl4ODdjMDNsNHV2ZHkwdnQycDg2bmcwbWw0MmN4MndhbjN2',
        index: true,
      },
      {
        key: 'c3dhcF90eXBlX2lk',
        value: 'MQ==',
        index: true,
      },
      {
        key: 'b2ZmZXJfY29pbl9kZW5vbQ==',
        value: 'dWF0b20=',
        index: true,
      },
      {
        key: 'b2ZmZXJfY29pbl9hbW91bnQ=',
        value: 'MTAwMA==',
        index: true,
      },
      {
        key: 'ZGVtYW5kX2NvaW5fZGVub20=',
        value: 'aWJjLzQyRTQ3QTVCQTcwOEVCRTZFMEMyMjcwMDYyNTRGMjc4NEUyMDlGNERCRDNDNkJCNzdFREM0QjI5RUY4NzVFOEU=',
        index: true,
      },
      {
        key: 'b3JkZXJfcHJpY2U=',
        value: 'NTc3Ny45MDA5OTk5OTk5OTk4Mzk5Mjk=',
        index: true,
      },
      {
        key: 'c3dhcF9wcmljZQ==',
        value: 'NTgwMS4wODcxNjYxMTM2ODQ2NzEyNzQ=',
        index: true,
      },
      {
        key: 'dHJhbnNhY3RlZF9jb2luX2Ftb3VudA==',
        value: 'MTAwMA==',
        index: true,
      },
      {
        key: 'cmVtYWluaW5nX29mZmVyX2NvaW5fYW1vdW50',
        value: 'MA==',
        index: true,
      },
      {
        key: 'ZXhjaGFuZ2VkX29mZmVyX2NvaW5fYW1vdW50',
        value: 'MTAwMA==',
        index: true,
      },
      {
        key: 'ZXhjaGFuZ2VkX2RlbWFuZF9jb2luX2Ftb3VudA==',
        value: 'NTc4OTQ4NA==',
        index: true,
      },
      {
        key: 'b2ZmZXJfY29pbl9mZWVfYW1vdW50',
        value: 'Mg==',
        index: true,
      },
      {
        key: 'ZXhjaGFuZ2VkX2NvaW5fZmVlX2Ftb3VudA==',
        value: 'MTE2MDIuMTc0MzMyMjI3MzY5MzQyNTQ4',
        index: true,
      },
      {
        key: 'cmVzZXJ2ZWRfb2ZmZXJfY29pbl9mZWVfYW1vdW50',
        value: 'MA==',
        index: true,
      },
      {
        key: 'b3JkZXJfZXhwaXJ5X2hlaWdodA==',
        value: 'MTAxNzg0MDU=',
        index: true,
      },
      {
        key: 'c3VjY2Vzcw==',
        value: 'c3VjY2Vzcw==',
        index: true,
      },
    ],
  },
  {
    type: 'coin_spent',
    attributes: [
      {
        key: 'c3BlbmRlcg==',
        value: 'Y29zbW9zMXR4NjhhOGs5eXo1NHowNnFmdmU5bDJ6eHZnc3o0a2EzaHI4OTYy',
        index: true,
      },
      {
        key: 'YW1vdW50',
        value: 'MTAwMHVhdG9t',
        index: true,
      },
    ],
  },
  {
    type: 'message',
    attributes: [
      {
        key: 'c2VuZGVy',
        value: 'Y29zbW9zMXR4NjhhOGs5eXo1NHowNnFmdmU5bDJ6eHZnc3o0a2EzaHI4OTYy',
        index: true,
      },
    ],
  },
  {
    type: 'coin_spent',
    attributes: [
      {
        key: 'c3BlbmRlcg==',
        value: 'Y29zbW9zMTB0M2Vyc3llNjh2Z2VqejZuNzUycGh6azJ6bGNtaHNkbXpnNDBs',
        index: true,
      },
      {
        key: 'YW1vdW50',
        value: 'NTc4OTQ4NGliYy80MkU0N0E1QkE3MDhFQkU2RTBDMjI3MDA2MjU0RjI3ODRFMjA5RjREQkQzQzZCQjc3RURDNEIyOUVGODc1RThF',
        index: true,
      },
    ],
  },
  {
    type: 'message',
    attributes: [
      {
        key: 'c2VuZGVy',
        value: 'Y29zbW9zMTB0M2Vyc3llNjh2Z2VqejZuNzUycGh6azJ6bGNtaHNkbXpnNDBs',
        index: true,
      },
    ],
  },
  {
    type: 'coin_spent',
    attributes: [
      {
        key: 'c3BlbmRlcg==',
        value: 'Y29zbW9zMXR4NjhhOGs5eXo1NHowNnFmdmU5bDJ6eHZnc3o0a2EzaHI4OTYy',
        index: true,
      },
      {
        key: 'YW1vdW50',
        value: 'MnVhdG9t',
        index: true,
      },
    ],
  },
  {
    type: 'message',
    attributes: [
      {
        key: 'c2VuZGVy',
        value: 'Y29zbW9zMXR4NjhhOGs5eXo1NHowNnFmdmU5bDJ6eHZnc3o0a2EzaHI4OTYy',
        index: true,
      },
    ],
  },
  {
    type: 'coin_received',
    attributes: [
      {
        key: 'cmVjZWl2ZXI=',
        value: 'Y29zbW9zMTB0M2Vyc3llNjh2Z2VqejZuNzUycGh6azJ6bGNtaHNkbXpnNDBs',
        index: true,
      },
      {
        key: 'YW1vdW50',
        value: 'MTAwMHVhdG9t',
        index: true,
      },
    ],
  },
  {
    type: 'transfer',
    attributes: [
      {
        key: 'cmVjaXBpZW50',
        value: 'Y29zbW9zMTB0M2Vyc3llNjh2Z2VqejZuNzUycGh6azJ6bGNtaHNkbXpnNDBs',
        index: true,
      },
      {
        key: 'YW1vdW50',
        value: 'MTAwMHVhdG9t',
        index: true,
      },
    ],
  },
  {
    type: 'coin_received',
    attributes: [
      {
        key: 'cmVjZWl2ZXI=',
        value: 'Y29zbW9zMXo1bnl4ODdjMDNsNHV2ZHkwdnQycDg2bmcwbWw0MmN4MndhbjN2',
        index: true,
      },
      {
        key: 'YW1vdW50',
        value: 'NTc4OTQ4NGliYy80MkU0N0E1QkE3MDhFQkU2RTBDMjI3MDA2MjU0RjI3ODRFMjA5RjREQkQzQzZCQjc3RURDNEIyOUVGODc1RThF',
        index: true,
      },
    ],
  },
  {
    type: 'transfer',
    attributes: [
      {
        key: 'cmVjaXBpZW50',
        value: 'Y29zbW9zMXo1bnl4ODdjMDNsNHV2ZHkwdnQycDg2bmcwbWw0MmN4MndhbjN2',
        index: true,
      },
      {
        key: 'YW1vdW50',
        value: 'NTc4OTQ4NGliYy80MkU0N0E1QkE3MDhFQkU2RTBDMjI3MDA2MjU0RjI3ODRFMjA5RjREQkQzQzZCQjc3RURDNEIyOUVGODc1RThF',
        index: true,
      },
    ],
  },
  {
    type: 'coin_received',
    attributes: [
      {
        key: 'cmVjZWl2ZXI=',
        value: 'Y29zbW9zMTB0M2Vyc3llNjh2Z2VqejZuNzUycGh6azJ6bGNtaHNkbXpnNDBs',
        index: true,
      },
      {
        key: 'YW1vdW50',
        value: 'MnVhdG9t',
        index: true,
      },
    ],
  },
  {
    type: 'transfer',
    attributes: [
      {
        key: 'cmVjaXBpZW50',
        value: 'Y29zbW9zMTB0M2Vyc3llNjh2Z2VqejZuNzUycGh6azJ6bGNtaHNkbXpnNDBs',
        index: true,
      },
      {
        key: 'YW1vdW50',
        value: 'MnVhdG9t',
        index: true,
      },
    ],
  },
];

it('should parse encoded events', () => {
  expect(parseEncodedEvents(osmosisEvents)).toMatchInlineSnapshot(`
    {
      "coin_received": {
        "amount": "14853086ibc/E6931F78057F7CC5DA0FD6CEF82FF39373A6E0452BF1FD76910B93292CF356C1",
        "receiver": "osmo1z5nyx87c03l4uvdy0vt2p86ng0ml42cxz4wr87",
      },
      "coin_spent": {
        "amount": "14853086ibc/E6931F78057F7CC5DA0FD6CEF82FF39373A6E0452BF1FD76910B93292CF356C1",
        "spender": "osmo1hek3fwgtlxgjvsgplhsucpz7w7q9vlp6mjm5m0c84na0x2y9y43qynrs6g",
      },
      "message": {
        "action": "/osmosis.gamm.v1beta1.MsgSwapExactAmountIn",
        "module": "gamm",
        "sender": "osmo1z5nyx87c03l4uvdy0vt2p86ng0ml42cxz4wr87",
      },
      "token_swapped": {
        "module": "gamm",
        "pool_id": "285",
        "sender": "osmo1z5nyx87c03l4uvdy0vt2p86ng0ml42cxz4wr87",
        "tokens_in": "10000uosmo",
        "tokens_out": "14853086ibc/E6931F78057F7CC5DA0FD6CEF82FF39373A6E0452BF1FD76910B93292CF356C1",
      },
      "transfer": {
        "amount": "14853086ibc/E6931F78057F7CC5DA0FD6CEF82FF39373A6E0452BF1FD76910B93292CF356C1",
        "recipient": "osmo1z5nyx87c03l4uvdy0vt2p86ng0ml42cxz4wr87",
        "sender": "osmo1hek3fwgtlxgjvsgplhsucpz7w7q9vlp6mjm5m0c84na0x2y9y43qynrs6g",
      },
      "tx": {
        "fee": "0uosmo",
        "signature": "dl9MMQCMrbxD8TZ34JWYn3nXchbgY9T8d8MeRLfmHz5lV3W1bcoG6e6aLmpbZsYZBe70vBCQUfi2K+GVRDqXOA==",
      },
    }
  `);
});

it('should return swap result for osmosis dex', async () => {
  const response = {
    tx_result: {
      events: osmosisEvents,
    },
  };

  expect(await resolveSwapResponse(response, 'osmosis')).toMatchInlineSnapshot(`
    {
      "inputAmount": "10000",
      "inputDenom": "uosmo",
      "orderPrice": "0",
      "outputAmount": "14853086",
      "outputDenom": "ibc/E6931F78057F7CC5DA0FD6CEF82FF39373A6E0452BF1FD76910B93292CF356C1",
      "poolId": "285",
    }
  `);
});

it('should return swap result for gravity dex', async () => {
  expect(getGravityResultFromDecodedEvents(parseEncodedEvents(gravityEvents))).toMatchInlineSnapshot(`
    {
      "inputAmount": "1000",
      "inputDenom": "uatom",
      "orderPrice": "5777.900999999999839929",
      "outputAmount": "5789484",
      "outputDenom": "ibc/42E47A5BA708EBE6E0C227006254F2784E209F4DBD3C6BB77EDC4B29EF875E8E",
      "poolId": "7",
      "remainingInputAmount": "0",
    }
  `);
});
