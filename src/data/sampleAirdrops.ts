export default {
  sampleAirdrops: [
    {
      project: 'LikeCoin',
      projectWebsiteUrl: 'https://about.like.co/',
      projectDescription:
        'LIKE is the native staking and governance token of LikeCoin chain, a Decentralized Publishing Infrastructure to empower content ownership, authenticity, and provenance.',
      chainName: 'LikeCoin',
      chainID: 'likecoin-mainnet-2',
      tokenTicker: 'LIKE',
      tokenIcon: 'https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/like.svg',
      twitterUrl: 'https://twitter.com/likecoin',
      discordUrl: 'https://discord.com/invite/W4DQ6peZZZ',
      mediumUrl: 'https://blog.like.co/',
      airdropBlogUrl:
        'https://blog.like.co/proposal-to-fairdrop-likecoin-to-the-cosmos-community-and-civic-likers-d64d841287d8',
      startDate: 'H1 2022',
      eligibilityTokens: ['OSMO', 'ATOM'],
      eligibilityCriteria: [
        {
          Criteria: 1,
          desc: 'ATOM and OSMO holders, delegators and liquidity providers ',
        },
        {
          Criteria: 2,
          desc: 'Civic Liker',
        },
      ],
      eligibilityCheckEndpoint: 'https://airdrop.like.co/api/claims?type=emeris&address=<address>',
    },
    {
      project: 'Comdex',
      projectWebsiteUrl: 'https://comdex.one/home',
      projectDescription:
        "Global Accessibiity in Finance. Comdex is an ecosystem of solutions to democratize finance and bridge Defi and CefI. Comdex's journey towards opening financial markets and growing investors' access progresses by creating the synthetics protocol. Through synthetics Comdex will innovate to enhance investors' access to a broad range of asset classes and generate a higher yield from safer avenues for investment.",
      chainName: 'Comdex',
      chainID: 'comdex-1',
      tokenTicker: 'CMDX',
      tokenIcon: 'https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/cmdx.png',
      twitterUrl: 'https://twitter.com/ComdexOfficial?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor',
      mediumUrl: 'https://comdexofficial.medium.com/',
      airdropBlogUrl: 'https://blog.comdex.one/how-to-claim-your-cmdx-airdrop-47873917e10',
      startDate: '9 Dec 2021',
      endDate: 'H1 2023',
      snapshotDate: '8 Oct 2021 14:30 UTC',
      eligibleTokens: ['OSMO', 'ATOM', 'LUNA', 'XPRT'],
      eligibilityCriteria: [
        {
          Criteria: 1,
          desc: 'ATOM, OSMO, LUNA or XPRT holders',
        },
      ],
      eligibilityCheckEndpoint: 'http://eligibility.comdex.one/check/v2/<address>',
      unanimousClaim: false,
      claimActions: [
        {
          actionType: 'plaintext',
          action: 1,
          desc: 'Navigate to the website, submit your address, accept the disclaimer and claim the airdrop. Your airdrop will be unlocked entirely in five phases. The first phase is when you are claiming your airdrop for the first time, and your subsequent four phases will be unlocked automatically in every 3-months.  ',
          actionURL: 'https://airdrop.comdex.one/',
        },
      ],
    },
    {
      project: 'LUM Network',
      projectWebsiteUrl: 'https://lum.network/',
      projectDescription:
        'Lum Network introduces the first decentralized protocol for businesses to build authentic trust with their customers.',
      chainName: 'Lum Network',
      chainID: 'lum-network-1',
      tokenTicker: 'LUM',
      tokenIcon: 'https://raw.githubusercontent.com/lum-network/mainnet/master/assets/lum.svg',
      twitterUrl: 'https://twitter.com/lum_network?lang=en',
      discordUrl: 'https://discord.com/invite/KwyVvnBcXF',
      mediumUrl: 'https://medium.com/lum-network',
      airdropBlogUrl: 'https://medium.com/lum-network/lum-airdrop-for-atom-stakers-osmo-lps-120d3e472f38',
      startDate: '14 Dec 2021',
      snapshotDate: '29 Sep 2021',
      eligibleTokens: ['OSMO', 'ATOM'],
      eligibilityCriteria: [
        {
          Criteria: 1,
          desc: 'ATOM stakers - minimum 5 ATOM staked, maximum cap at 3,000 ATOM, centralized exchanges and their delegators are excluded from the airdrop ',
        },
        {
          Criteria: 2,
          desc: 'OSMO liquidity providers - minimum 30 OSMO provided as liquidity, maximum cap at 20,000 OSMO, only bonded LPs have been taken into account, only the pools with an OSMO pair have been taken into account',
        },
      ],
      eligibilityCheckEndpoint: 'https://us-central1-lum-network.cloudfunctions.net/airdrop/<address>',
      unanimousClaim: true,
      claimActions: [
        {
          actionType: 'plaintext',
          action: 1,
          desc: 'Stake LUM to a validator',
          actionURL: 'url',
          unlockPercentage: '50',
        },
        {
          action: 2,
          desc: 'Vote on a Lum Network Governance proposal',
          unlockPercentage: '50',
        },
      ],
    },
  ],
};
