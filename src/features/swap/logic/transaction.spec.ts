/* eslint-disable max-lines-per-function */
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
        key: 'YWNjX3NlcQ==',
        value: 'b3NtbzF6NW55eDg3YzAzbDR1dmR5MHZ0MnA4Nm5nMG1sNDJjeHo0d3I4Ny8zNTQ=',
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
          'M1BHNTJOTnAxRDluSE9PVllsTDkwaTk2QW1Xem9GcEhHT0lSbFpmVS9VdExMUllXMWRPa1MxQ3pZckhrYk9sckh0VWhHdExzbjJZYzZjMER1cWp6OVE9PQ==',
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
        value: 'MTAwMHVvc21v',
        index: true,
      },
    ],
  },
  {
    type: 'coin_received',
    attributes: [
      {
        key: 'cmVjZWl2ZXI=',
        value: 'b3NtbzFqdmU3emM5eTI5a2w4amFsdTBhYXo4djM4eTJ2cGp1Y2RrN3RoZzc5ZWt0cTR0N2Fzd2NzYTZ3NDVk',
        index: true,
      },
      {
        key: 'YW1vdW50',
        value: 'MTAwMHVvc21v',
        index: true,
      },
    ],
  },
  {
    type: 'transfer',
    attributes: [
      {
        key: 'cmVjaXBpZW50',
        value: 'b3NtbzFqdmU3emM5eTI5a2w4amFsdTBhYXo4djM4eTJ2cGp1Y2RrN3RoZzc5ZWt0cTR0N2Fzd2NzYTZ3NDVk',
        index: true,
      },
      {
        key: 'c2VuZGVy',
        value: 'b3NtbzF6NW55eDg3YzAzbDR1dmR5MHZ0MnA4Nm5nMG1sNDJjeHo0d3I4Nw==',
        index: true,
      },
      {
        key: 'YW1vdW50',
        value: 'MTAwMHVvc21v',
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
        value: 'b3NtbzFqdmU3emM5eTI5a2w4amFsdTBhYXo4djM4eTJ2cGp1Y2RrN3RoZzc5ZWt0cTR0N2Fzd2NzYTZ3NDVk',
        index: true,
      },
      {
        key: 'YW1vdW50',
        value: 'MTUxNjU3NWliYy85NzEyREJCMTNCOTYzMUVERkE5QkY2MUI1NUYxQjJEMjkwQjJBREI2N0UzQTRFQjNBODc1RjNCNjA4MUIzQjg0',
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
        value: 'MTUxNjU3NWliYy85NzEyREJCMTNCOTYzMUVERkE5QkY2MUI1NUYxQjJEMjkwQjJBREI2N0UzQTRFQjNBODc1RjNCNjA4MUIzQjg0',
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
        value: 'b3NtbzFqdmU3emM5eTI5a2w4amFsdTBhYXo4djM4eTJ2cGp1Y2RrN3RoZzc5ZWt0cTR0N2Fzd2NzYTZ3NDVk',
        index: true,
      },
      {
        key: 'YW1vdW50',
        value: 'MTUxNjU3NWliYy85NzEyREJCMTNCOTYzMUVERkE5QkY2MUI1NUYxQjJEMjkwQjJBREI2N0UzQTRFQjNBODc1RjNCNjA4MUIzQjg0',
        index: true,
      },
    ],
  },
  {
    type: 'message',
    attributes: [
      {
        key: 'c2VuZGVy',
        value: 'b3NtbzFqdmU3emM5eTI5a2w4amFsdTBhYXo4djM4eTJ2cGp1Y2RrN3RoZzc5ZWt0cTR0N2Fzd2NzYTZ3NDVk',
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
        value: 'MTkz',
        index: true,
      },
      {
        key: 'dG9rZW5zX2lu',
        value: 'MTAwMHVvc21v',
        index: true,
      },
      {
        key: 'dG9rZW5zX291dA==',
        value: 'MTUxNjU3NWliYy85NzEyREJCMTNCOTYzMUVERkE5QkY2MUI1NUYxQjJEMjkwQjJBREI2N0UzQTRFQjNBODc1RjNCNjA4MUIzQjg0',
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
        value: 'MTUxNjU3NWliYy85NzEyREJCMTNCOTYzMUVERkE5QkY2MUI1NUYxQjJEMjkwQjJBREI2N0UzQTRFQjNBODc1RjNCNjA4MUIzQjg0',
        index: true,
      },
    ],
  },
  {
    type: 'coin_received',
    attributes: [
      {
        key: 'cmVjZWl2ZXI=',
        value: 'b3NtbzFucHo4MG50eDN2d2t2M3c5cnl6YzhnMDc0aGx5a213NDk3YXIwajdkcXprNHlhbmp5bHFzaGFuNDRk',
        index: true,
      },
      {
        key: 'YW1vdW50',
        value: 'MTUxNjU3NWliYy85NzEyREJCMTNCOTYzMUVERkE5QkY2MUI1NUYxQjJEMjkwQjJBREI2N0UzQTRFQjNBODc1RjNCNjA4MUIzQjg0',
        index: true,
      },
    ],
  },
  {
    type: 'transfer',
    attributes: [
      {
        key: 'cmVjaXBpZW50',
        value: 'b3NtbzFucHo4MG50eDN2d2t2M3c5cnl6YzhnMDc0aGx5a213NDk3YXIwajdkcXprNHlhbmp5bHFzaGFuNDRk',
        index: true,
      },
      {
        key: 'c2VuZGVy',
        value: 'b3NtbzF6NW55eDg3YzAzbDR1dmR5MHZ0MnA4Nm5nMG1sNDJjeHo0d3I4Nw==',
        index: true,
      },
      {
        key: 'YW1vdW50',
        value: 'MTUxNjU3NWliYy85NzEyREJCMTNCOTYzMUVERkE5QkY2MUI1NUYxQjJEMjkwQjJBREI2N0UzQTRFQjNBODc1RjNCNjA4MUIzQjg0',
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
        value: 'b3NtbzFucHo4MG50eDN2d2t2M3c5cnl6YzhnMDc0aGx5a213NDk3YXIwajdkcXprNHlhbmp5bHFzaGFuNDRk',
        index: true,
      },
      {
        key: 'YW1vdW50',
        value: 'NTAzN2liYy8xNDgwQjhGRDIwQUQ1RkNBRTgxRUE4NzU4NEQyNjk1NDdERDRENDM2ODQzQzFEMjBGMTVFMDBFQjY0NzQzRUY0',
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
        value: 'NTAzN2liYy8xNDgwQjhGRDIwQUQ1RkNBRTgxRUE4NzU4NEQyNjk1NDdERDRENDM2ODQzQzFEMjBGMTVFMDBFQjY0NzQzRUY0',
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
        value: 'b3NtbzFucHo4MG50eDN2d2t2M3c5cnl6YzhnMDc0aGx5a213NDk3YXIwajdkcXprNHlhbmp5bHFzaGFuNDRk',
        index: true,
      },
      {
        key: 'YW1vdW50',
        value: 'NTAzN2liYy8xNDgwQjhGRDIwQUQ1RkNBRTgxRUE4NzU4NEQyNjk1NDdERDRENDM2ODQzQzFEMjBGMTVFMDBFQjY0NzQzRUY0',
        index: true,
      },
    ],
  },
  {
    type: 'message',
    attributes: [
      {
        key: 'c2VuZGVy',
        value: 'b3NtbzFucHo4MG50eDN2d2t2M3c5cnl6YzhnMDc0aGx5a213NDk3YXIwajdkcXprNHlhbmp5bHFzaGFuNDRk',
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
        value: 'Mjc0',
        index: true,
      },
      {
        key: 'dG9rZW5zX2lu',
        value: 'MTUxNjU3NWliYy85NzEyREJCMTNCOTYzMUVERkE5QkY2MUI1NUYxQjJEMjkwQjJBREI2N0UzQTRFQjNBODc1RjNCNjA4MUIzQjg0',
        index: true,
      },
      {
        key: 'dG9rZW5zX291dA==',
        value: 'NTAzN2liYy8xNDgwQjhGRDIwQUQ1RkNBRTgxRUE4NzU4NEQyNjk1NDdERDRENDM2ODQzQzFEMjBGMTVFMDBFQjY0NzQzRUY0',
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
        value: 'NTAzN2liYy8xNDgwQjhGRDIwQUQ1RkNBRTgxRUE4NzU4NEQyNjk1NDdERDRENDM2ODQzQzFEMjBGMTVFMDBFQjY0NzQzRUY0',
        index: true,
      },
    ],
  },
  {
    type: 'coin_received',
    attributes: [
      {
        key: 'cmVjZWl2ZXI=',
        value: 'b3NtbzFtcmx0ZnY4eTNqZjR2M2dndzBobmpqeHptd21xNzQ5cnNqZ3Zndmp1azBlenpzNGh5Y2Zza202YzZh',
        index: true,
      },
      {
        key: 'YW1vdW50',
        value: 'NTAzN2liYy8xNDgwQjhGRDIwQUQ1RkNBRTgxRUE4NzU4NEQyNjk1NDdERDRENDM2ODQzQzFEMjBGMTVFMDBFQjY0NzQzRUY0',
        index: true,
      },
    ],
  },
  {
    type: 'transfer',
    attributes: [
      {
        key: 'cmVjaXBpZW50',
        value: 'b3NtbzFtcmx0ZnY4eTNqZjR2M2dndzBobmpqeHptd21xNzQ5cnNqZ3Zndmp1azBlenpzNGh5Y2Zza202YzZh',
        index: true,
      },
      {
        key: 'c2VuZGVy',
        value: 'b3NtbzF6NW55eDg3YzAzbDR1dmR5MHZ0MnA4Nm5nMG1sNDJjeHo0d3I4Nw==',
        index: true,
      },
      {
        key: 'YW1vdW50',
        value: 'NTAzN2liYy8xNDgwQjhGRDIwQUQ1RkNBRTgxRUE4NzU4NEQyNjk1NDdERDRENDM2ODQzQzFEMjBGMTVFMDBFQjY0NzQzRUY0',
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
        value: 'b3NtbzFtcmx0ZnY4eTNqZjR2M2dndzBobmpqeHptd21xNzQ5cnNqZ3Zndmp1azBlenpzNGh5Y2Zza202YzZh',
        index: true,
      },
      {
        key: 'YW1vdW50',
        value: 'MTAzNjM5aWJjLzdDNEQ2MEFBOTVFNUE3NTU4QjBBMzY0ODYwOTc5Q0EzNEI3RkY4QUFGMjU1Qjg3QUY5RTg3OTM3NDQ3MENFQzA=',
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
        value: 'MTAzNjM5aWJjLzdDNEQ2MEFBOTVFNUE3NTU4QjBBMzY0ODYwOTc5Q0EzNEI3RkY4QUFGMjU1Qjg3QUY5RTg3OTM3NDQ3MENFQzA=',
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
        value: 'b3NtbzFtcmx0ZnY4eTNqZjR2M2dndzBobmpqeHptd21xNzQ5cnNqZ3Zndmp1azBlenpzNGh5Y2Zza202YzZh',
        index: true,
      },
      {
        key: 'YW1vdW50',
        value: 'MTAzNjM5aWJjLzdDNEQ2MEFBOTVFNUE3NTU4QjBBMzY0ODYwOTc5Q0EzNEI3RkY4QUFGMjU1Qjg3QUY5RTg3OTM3NDQ3MENFQzA=',
        index: true,
      },
    ],
  },
  {
    type: 'message',
    attributes: [
      {
        key: 'c2VuZGVy',
        value: 'b3NtbzFtcmx0ZnY4eTNqZjR2M2dndzBobmpqeHptd21xNzQ5cnNqZ3Zndmp1azBlenpzNGh5Y2Zza202YzZh',
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
        value: 'MzAx',
        index: true,
      },
      {
        key: 'dG9rZW5zX2lu',
        value: 'NTAzN2liYy8xNDgwQjhGRDIwQUQ1RkNBRTgxRUE4NzU4NEQyNjk1NDdERDRENDM2ODQzQzFEMjBGMTVFMDBFQjY0NzQzRUY0',
        index: true,
      },
      {
        key: 'dG9rZW5zX291dA==',
        value: 'MTAzNjM5aWJjLzdDNEQ2MEFBOTVFNUE3NTU4QjBBMzY0ODYwOTc5Q0EzNEI3RkY4QUFGMjU1Qjg3QUY5RTg3OTM3NDQ3MENFQzA=',
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
      "coin_received": [
        {
          "amount": "1000uosmo",
          "receiver": "osmo1jve7zc9y29kl8jalu0aaz8v38y2vpjucdk7thg79ektq4t7aswcsa6w45d",
        },
        {
          "amount": "1516575ibc/9712DBB13B9631EDFA9BF61B55F1B2D290B2ADB67E3A4EB3A875F3B6081B3B84",
          "receiver": "osmo1z5nyx87c03l4uvdy0vt2p86ng0ml42cxz4wr87",
        },
        {
          "amount": "1516575ibc/9712DBB13B9631EDFA9BF61B55F1B2D290B2ADB67E3A4EB3A875F3B6081B3B84",
          "receiver": "osmo1npz80ntx3vwkv3w9ryzc8g074hlykmw497ar0j7dqzk4yanjylqshan44d",
        },
        {
          "amount": "5037ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4",
          "receiver": "osmo1z5nyx87c03l4uvdy0vt2p86ng0ml42cxz4wr87",
        },
        {
          "amount": "5037ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4",
          "receiver": "osmo1mrltfv8y3jf4v3ggw0hnjjxzmwmq749rsjgvgvjuk0ezzs4hycfskm6c6a",
        },
        {
          "amount": "103639ibc/7C4D60AA95E5A7558B0A364860979CA34B7FF8AAF255B87AF9E879374470CEC0",
          "receiver": "osmo1z5nyx87c03l4uvdy0vt2p86ng0ml42cxz4wr87",
        },
      ],
      "coin_spent": [
        {
          "amount": "1000uosmo",
          "spender": "osmo1z5nyx87c03l4uvdy0vt2p86ng0ml42cxz4wr87",
        },
        {
          "amount": "1516575ibc/9712DBB13B9631EDFA9BF61B55F1B2D290B2ADB67E3A4EB3A875F3B6081B3B84",
          "spender": "osmo1jve7zc9y29kl8jalu0aaz8v38y2vpjucdk7thg79ektq4t7aswcsa6w45d",
        },
        {
          "amount": "1516575ibc/9712DBB13B9631EDFA9BF61B55F1B2D290B2ADB67E3A4EB3A875F3B6081B3B84",
          "spender": "osmo1z5nyx87c03l4uvdy0vt2p86ng0ml42cxz4wr87",
        },
        {
          "amount": "5037ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4",
          "spender": "osmo1npz80ntx3vwkv3w9ryzc8g074hlykmw497ar0j7dqzk4yanjylqshan44d",
        },
        {
          "amount": "5037ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4",
          "spender": "osmo1z5nyx87c03l4uvdy0vt2p86ng0ml42cxz4wr87",
        },
        {
          "amount": "103639ibc/7C4D60AA95E5A7558B0A364860979CA34B7FF8AAF255B87AF9E879374470CEC0",
          "spender": "osmo1mrltfv8y3jf4v3ggw0hnjjxzmwmq749rsjgvgvjuk0ezzs4hycfskm6c6a",
        },
      ],
      "message": [
        {
          "action": "/osmosis.gamm.v1beta1.MsgSwapExactAmountIn",
        },
        {
          "sender": "osmo1z5nyx87c03l4uvdy0vt2p86ng0ml42cxz4wr87",
        },
        {
          "sender": "osmo1jve7zc9y29kl8jalu0aaz8v38y2vpjucdk7thg79ektq4t7aswcsa6w45d",
        },
        {
          "sender": "osmo1z5nyx87c03l4uvdy0vt2p86ng0ml42cxz4wr87",
        },
        {
          "sender": "osmo1npz80ntx3vwkv3w9ryzc8g074hlykmw497ar0j7dqzk4yanjylqshan44d",
        },
        {
          "sender": "osmo1z5nyx87c03l4uvdy0vt2p86ng0ml42cxz4wr87",
        },
        {
          "sender": "osmo1mrltfv8y3jf4v3ggw0hnjjxzmwmq749rsjgvgvjuk0ezzs4hycfskm6c6a",
        },
        {
          "module": "gamm",
          "sender": "osmo1z5nyx87c03l4uvdy0vt2p86ng0ml42cxz4wr87",
        },
      ],
      "token_swapped": [
        {
          "module": "gamm",
          "pool_id": "193",
          "sender": "osmo1z5nyx87c03l4uvdy0vt2p86ng0ml42cxz4wr87",
          "tokens_in": "1000uosmo",
          "tokens_out": "1516575ibc/9712DBB13B9631EDFA9BF61B55F1B2D290B2ADB67E3A4EB3A875F3B6081B3B84",
        },
        {
          "module": "gamm",
          "pool_id": "274",
          "sender": "osmo1z5nyx87c03l4uvdy0vt2p86ng0ml42cxz4wr87",
          "tokens_in": "1516575ibc/9712DBB13B9631EDFA9BF61B55F1B2D290B2ADB67E3A4EB3A875F3B6081B3B84",
          "tokens_out": "5037ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4",
        },
        {
          "module": "gamm",
          "pool_id": "301",
          "sender": "osmo1z5nyx87c03l4uvdy0vt2p86ng0ml42cxz4wr87",
          "tokens_in": "5037ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4",
          "tokens_out": "103639ibc/7C4D60AA95E5A7558B0A364860979CA34B7FF8AAF255B87AF9E879374470CEC0",
        },
      ],
      "transfer": [
        {
          "amount": "1000uosmo",
          "recipient": "osmo1jve7zc9y29kl8jalu0aaz8v38y2vpjucdk7thg79ektq4t7aswcsa6w45d",
          "sender": "osmo1z5nyx87c03l4uvdy0vt2p86ng0ml42cxz4wr87",
        },
        {
          "amount": "1516575ibc/9712DBB13B9631EDFA9BF61B55F1B2D290B2ADB67E3A4EB3A875F3B6081B3B84",
          "recipient": "osmo1z5nyx87c03l4uvdy0vt2p86ng0ml42cxz4wr87",
          "sender": "osmo1jve7zc9y29kl8jalu0aaz8v38y2vpjucdk7thg79ektq4t7aswcsa6w45d",
        },
        {
          "amount": "1516575ibc/9712DBB13B9631EDFA9BF61B55F1B2D290B2ADB67E3A4EB3A875F3B6081B3B84",
          "recipient": "osmo1npz80ntx3vwkv3w9ryzc8g074hlykmw497ar0j7dqzk4yanjylqshan44d",
          "sender": "osmo1z5nyx87c03l4uvdy0vt2p86ng0ml42cxz4wr87",
        },
        {
          "amount": "5037ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4",
          "recipient": "osmo1z5nyx87c03l4uvdy0vt2p86ng0ml42cxz4wr87",
          "sender": "osmo1npz80ntx3vwkv3w9ryzc8g074hlykmw497ar0j7dqzk4yanjylqshan44d",
        },
        {
          "amount": "5037ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4",
          "recipient": "osmo1mrltfv8y3jf4v3ggw0hnjjxzmwmq749rsjgvgvjuk0ezzs4hycfskm6c6a",
          "sender": "osmo1z5nyx87c03l4uvdy0vt2p86ng0ml42cxz4wr87",
        },
        {
          "amount": "103639ibc/7C4D60AA95E5A7558B0A364860979CA34B7FF8AAF255B87AF9E879374470CEC0",
          "recipient": "osmo1z5nyx87c03l4uvdy0vt2p86ng0ml42cxz4wr87",
          "sender": "osmo1mrltfv8y3jf4v3ggw0hnjjxzmwmq749rsjgvgvjuk0ezzs4hycfskm6c6a",
        },
      ],
      "tx": [
        {
          "fee": "0uosmo",
        },
        {
          "acc_seq": "osmo1z5nyx87c03l4uvdy0vt2p86ng0ml42cxz4wr87/354",
        },
        {
          "signature": "3PG52NNp1D9nHOOVYlL90i96AmWzoFpHGOIRlZfU/UtLLRYW1dOkS1CzYrHkbOlrHtUhGtLsn2Yc6c0Duqjz9Q==",
        },
      ],
    }
  `);
});

it('should return swap result for osmosis dex', async () => {
  const response = {
    tx_result: {
      events: osmosisEvents,
    },
  };

  expect(await resolveSwapResponse(response, 'osmosis', 'osmo1z5nyx87c03l4uvdy0vt2p86ng0ml42cxz4wr87'))
    .toMatchInlineSnapshot(`
      {
        "inputAmount": "1000",
        "inputDenom": "uosmo",
        "orderPrice": "0",
        "outputAmount": "103639",
        "outputDenom": "ibc/7C4D60AA95E5A7558B0A364860979CA34B7FF8AAF255B87AF9E879374470CEC0",
        "poolId": "301",
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
