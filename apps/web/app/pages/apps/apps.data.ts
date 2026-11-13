const appsAssetPath = '/marketing/apps';

export interface CoreToken {
  symbol: string;
  name?: string;
  iconSrc: string;
  actionLabel: string;
  href: string;
  description: string;
  descriptionLink?: { label: string; href: string };
}

export const coreTokens: CoreToken[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    iconSrc: `${appsAssetPath}/btc.svg`,
    actionLabel: 'Buy',
    href: '/posts/how-to-buy-bitcoin',
    description:
      'The most secure and decentralized asset. BTC can be safely stored in Leather and used across Bitcoin and Stacks apps.',
  },
  {
    symbol: 'STX',
    name: 'Stacks',
    iconSrc: `${appsAssetPath}/stx.png`,
    actionLabel: 'Buy',
    href: '/posts/buy-stx',
    description:
      'The token that powers Stacks. STX is used to pay for transactions and can be staked to earn Bitcoin rewards on the network.',
  },
  {
    symbol: 'sBTC',
    iconSrc: `${appsAssetPath}/sbtc.png`,
    actionLabel: 'Get',
    href: 'https://sbtc.stacks.co/',
    description:
      'A 1:1 BTC backed that does not rely on a centralized custodian. Lets you use Bitcoin in Stacks apps.',
  },
  {
    symbol: 'USDCx',
    iconSrc: `${appsAssetPath}/usdcx.svg`,
    actionLabel: 'Get',
    href: 'https://bridge.stacks.co/usdc/eth/stx?recipient=SP1ZS9BX25WFYGHKHGY399057HT4MBH6TQMS8ZKTE',
    description:
      'A 1:1 USD-backed stablecoin issued by Circle via xReserve and native to Stacks for payments and on-chain stability.',
    descriptionLink: { label: 'Circle', href: 'https://www.circle.com' },
  },
];

export const dualStacking = {
  title: 'Dual stacking',
  yieldLabel: 'Up to 5% APY in sBTC',
  description: 'Hold sBTC & boost with STX Stacking or DeFi',
  actionLabel: 'Start earning',
  href: 'https://app.stacks.co/',
  imageSrc: `${appsAssetPath}/dual-stacking.png`,
};

interface YieldProvider {
  name: string;
  iconSrc: string;
  historicalYield: string;
}

export interface StakingOption {
  title: string;
  description: string;
  href: string;
  providers: YieldProvider[];
}

const stackingDaoIconSrc = `${appsAssetPath}/stacking-dao-provider.png`;

export const stakingOptions: StakingOption[] = [
  {
    title: 'Pooled staking',
    description:
      'Stake with others to earn BTC. Your STX stay locked for each cycle, and you earn steady rewards.',
    href: '/staking',
    providers: [
      { name: 'Stacking DAO', iconSrc: stackingDaoIconSrc, historicalYield: '9.27%' },
      {
        name: 'Fast pool',
        iconSrc: `${appsAssetPath}/fast-pool-provider.png`,
        historicalYield: '8.59%',
      },
      {
        name: 'PlanBetter',
        iconSrc: `${appsAssetPath}/planbetter-provider.png`,
        historicalYield: '8.57%',
      },
    ],
  },
  {
    title: 'Liquid Staking',
    description:
      'Keep your STX flexible and still earn BTC. Get a liquid token that lets you trade or use your staked STX anytime.',
    href: '/staking',
    providers: [{ name: 'Stacking DAO', iconSrc: stackingDaoIconSrc, historicalYield: '8.72%' }],
  },
];

export interface FeaturedApp {
  name: string;
  description: string;
  href: string;
  imageSrc: string;
  logoSrc: string;
}

const bitflowFeaturedApp: FeaturedApp = {
  name: 'Bitflow',
  description:
    'A Bitcoin-native DEX aggregator and liquidity hub that sources the best prices across Stacks-based protocols.',
  href: '/posts/bitflow',
  imageSrc: `${appsAssetPath}/bitflow-card.png`,
  logoSrc: `${appsAssetPath}/bitflow-logo.png`,
};

const zestFeaturedApp: FeaturedApp = {
  name: 'Zest Protocol',
  description:
    'A Bitcoin-native protocol on Stacks for borrowing, lending, and yield generation through overcollateralized loans and BTC staking pools',
  href: '/posts/zest',
  imageSrc: `${appsAssetPath}/zest-card.png`,
  logoSrc: `${appsAssetPath}/zest-logo.svg`,
};

const hermeticaFeaturedApp: FeaturedApp = {
  name: 'Hermetica',
  description:
    'A Bitcoin-backed synthetic dollar that generates up to 25% APY through delta-neutral strategies',
  href: '/posts/hermetica',
  imageSrc: `${appsAssetPath}/hermetica-card.png`,
  logoSrc: `${appsAssetPath}/hermetica-logo.svg`,
};

const graniteFeaturedApp: FeaturedApp = {
  name: 'Granite',
  description:
    'Use sBTC to borrow stablecoins non-custodially, without risk of forced liquidations',
  href: '/posts/granite',
  imageSrc: `${appsAssetPath}/granite-card.png`,
  logoSrc: `${appsAssetPath}/granite-logo.svg`,
};

const arkadikoFeaturedApp: FeaturedApp = {
  name: 'Arkadiko',
  description:
    'A Bitcoin-secured protocol for vault-based borrowing, USDA minting, and decentralized smart contract automation.',
  href: '/posts/arkadiko',
  imageSrc: `${appsAssetPath}/arkadiko-card.png`,
  logoSrc: `${appsAssetPath}/arkadiko-logo.svg`,
};

const alexFeaturedApp: FeaturedApp = {
  name: 'ALEX',
  description:
    'A DeFi platform on Stacks offering swaps, staking, fixed-term lending, and cross-chain liquidity with Bitcoin security',
  href: '/posts/alex',
  imageSrc: `${appsAssetPath}/alex-card.png`,
  logoSrc: `${appsAssetPath}/alex-logo.png`,
};

export const appsFeaturedApps: FeaturedApp[] = [
  bitflowFeaturedApp,
  zestFeaturedApp,
  hermeticaFeaturedApp,
  graniteFeaturedApp,
  arkadikoFeaturedApp,
];

export const explorerFeaturedApps: FeaturedApp[] = [
  bitflowFeaturedApp,
  zestFeaturedApp,
  hermeticaFeaturedApp,
  graniteFeaturedApp,
  alexFeaturedApp,
  arkadikoFeaturedApp,
];

interface Project {
  name: string;
  description: string;
  href: string;
  logoSrc: string;
}

export const projects: Project[] = [
  {
    name: 'ALEX',
    description: alexFeaturedApp.description,
    href: '/posts/alex',
    logoSrc: `${appsAssetPath}/alex-logo.png`,
  },
  {
    name: 'Arkadiko',
    description: arkadikoFeaturedApp.description,
    href: '/posts/arkadiko',
    logoSrc: `${appsAssetPath}/arkadiko-logo.svg`,
  },
  {
    name: 'Bitflow',
    description: bitflowFeaturedApp.description,
    href: '/posts/bitflow',
    logoSrc: `${appsAssetPath}/bitflow-logo.png`,
  },
  {
    name: 'BNS One',
    description:
      'BNS One is a Bitcoin Name System platform for registering and managing .btc domain names on Bitcoin via the Stacks blockchain.',
    href: '/posts/bns',
    logoSrc: `${appsAssetPath}/bns-one-logo.png`,
  },
  {
    name: 'BNSv2 Hub',
    description:
      'BNS Hub is the BNS V2 management platform for registering names, creating namespaces, and building with the BNS protocol on Stacks.',
    href: '/posts/bns',
    logoSrc: `${appsAssetPath}/bns-hub-logo.png`,
  },
  {
    name: 'Brotocol',
    description:
      'A Bitcoin-native DeFi platform accessible via Leather-connected apps like BroBridge and BroSwap',
    href: '/posts/brotocol',
    logoSrc: `${appsAssetPath}/brotocol-logo.jpg`,
  },
  {
    name: 'Charisma',
    description:
      'A modular DeFi platform for vaults, swaps, and programmable token infrastructure on Stacks',
    href: '/posts/charisma',
    logoSrc: `${appsAssetPath}/charisma-logo.png`,
  },
  {
    name: 'Granite',
    description: graniteFeaturedApp.description,
    href: '/posts/granite',
    logoSrc: `${appsAssetPath}/granite-logo.svg`,
  },
  {
    name: 'Hermetica',
    description: hermeticaFeaturedApp.description,
    href: '/posts/hermetica',
    logoSrc: `${appsAssetPath}/hermetica-logo.svg`,
  },
  {
    name: 'LISA',
    description:
      'A liquid staking protocol built on Stacks that lets you earn yield on assets like STX and ALEX—without locking them up.',
    href: '/posts/lisa',
    logoSrc: `${appsAssetPath}/lisa-logo.png`,
  },
  {
    name: 'Stacking DAO',
    description:
      'Stacking infrastructure offering native and liquid options with BTC and STX-based yield',
    href: '/posts/stacking-dao',
    logoSrc: `${appsAssetPath}/stacking-dao-logo.jpg`,
  },
  {
    name: 'STX City - BNS Gateway',
    description:
      'BNS Gateway on STX.CITY is a marketplace and registration platform for .btc domains, with analytics, social features, and domain exploration tools.',
    href: '/posts/bns',
    logoSrc: `${appsAssetPath}/bns-gateway-logo.png`,
  },
  {
    name: 'Velar',
    description:
      'A DeFi suite offering trading, liquidity, and launchpad access built on Bitcoin L2s like Stacks',
    href: '/posts/velar',
    logoSrc: `${appsAssetPath}/velar-logo.jpg`,
  },
  {
    name: 'Zest Protocol',
    description: zestFeaturedApp.description,
    href: '/posts/zest',
    logoSrc: `${appsAssetPath}/zest-logo.svg`,
  },
];
