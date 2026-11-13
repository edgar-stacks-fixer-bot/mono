const assetPath = '/marketing/home';

export function homeAsset(path: string) {
  return `${assetPath}/${path}`;
}

interface DownloadLink {
  label: string;
  href: string;
  icon: string;
}

export const downloadLinks: DownloadLink[] = [
  {
    label: 'Chrome',
    href: 'https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj',
    icon: homeAsset('logos/chrome.png'),
  },
  {
    label: 'iOS',
    href: 'https://apps.apple.com/us/app/leather-self-custody-wallet/id6499127775',
    icon: homeAsset('logos/app-store.png'),
  },
  {
    label: 'Android',
    href: 'https://play.google.com/store/apps/details?id=io.leather.mobilewallet',
    icon: homeAsset('logos/google-play.png'),
  },
];

export const heroWords = ['Buy.', 'send.', 'swap.', 'earn.', 'grow.'];

interface PartnerLogo {
  name: string;
  src: string;
  width: number;
  height: number;
}

export const buyPartners: PartnerLogo[] = [
  { name: 'Coinbase', src: homeAsset('logos/coinbase.svg'), width: 130, height: 23 },
  { name: 'Binance', src: homeAsset('logos/binance.svg'), width: 130, height: 26 },
  { name: 'MoonPay', src: homeAsset('logos/moonpay.svg'), width: 130, height: 24 },
  { name: 'Gate', src: homeAsset('logos/gate.svg'), width: 98, height: 23 },
];

export const swapProviders = ['Bitflow', 'Velar', 'sBTC Bridge', 'ALEX'];

export const ledgerHighlights = [
  'Smart signing for a safer Ledger experience',
  'Seamless multi-chain BTC & STX experience',
  'Connect once and sign smoothly',
];

export type TrustLogo = 'github' | 'least-authority' | 'hackerone';

export interface TrustPoint {
  title: string;
  logo: TrustLogo;
  description: string;
  href: string;
  icon: string;
}

export const trustPoints: TrustPoint[] = [
  {
    title: 'Open source by design',
    logo: 'github',
    description:
      'Transparent by design. Community-tested and reviewed to ensure the highest level of safety.',
    href: 'https://github.com/leather-io',
    icon: homeAsset('logos/icon-open-source.svg'),
  },
  {
    title: 'Audited by Least Authority',
    logo: 'least-authority',
    description: 'Reviewed by one of the most respected security firms in the crypto industry.',
    href: 'https://leastauthority.com/blog/audit-of-hiros-stacks-wallet/',
    icon: homeAsset('logos/icon-audited.svg'),
  },
  {
    title: 'Field tested by hackerone.com',
    logo: 'hackerone',
    description:
      'Validated by ethical hackers who continuously identify and resolve vulnerabilities.',
    href: 'https://hackerone.com/leather_wallet',
    icon: homeAsset('logos/icon-field-tested.svg'),
  },
];

interface YieldProvider {
  name: string;
  logo: string;
  yield: string;
}

export interface YieldProduct {
  title: string;
  description: string;
  providers: YieldProvider[];
}

export interface EarnOption {
  name: string;
  icon: string;
  href: string;
  cta: string;
  headlineYield: string;
  products: YieldProduct[];
}

export const earnOptions: EarnOption[] = [
  {
    name: 'sBTC',
    icon: homeAsset('logos/sbtc.png'),
    href: '/sbtc',
    cta: 'Earn BTC',
    headlineYield: '5%',
    products: [
      {
        title: 'Bitcoin on layer 2',
        description:
          'Turn your Bitcoin into an active asset. Earn rewards, use it in DeFi, and explore new ways to grow your BTC on layer 2.',
        providers: [
          {
            name: 'sBTC Rewards Program',
            logo: homeAsset('logos/sbtc.png'),
            yield: 'Up to 5% on your Bitcoin, paid in sBTC',
          },
          { name: 'Zest', logo: homeAsset('logos/zest.png'), yield: '5.2%' },
          { name: 'Bitflow', logo: homeAsset('logos/bitflow.png'), yield: '5.1%' },
        ],
      },
    ],
  },
  {
    name: 'Staking',
    icon: homeAsset('logos/staking.png'),
    href: '/staking',
    cta: 'Start Staking',
    headlineYield: '6–10%',
    products: [
      {
        title: 'Pooled staking',
        description:
          'Stake with others to earn BTC. Your STX stay locked for each cycle, and you earn steady rewards.',
        providers: [
          { name: 'Stacking DAO', logo: homeAsset('logos/stacking-dao.png'), yield: '9.27%' },
          { name: 'Fast pool', logo: homeAsset('logos/fast-pool.png'), yield: '8.59%' },
          { name: 'PlanBetter', logo: homeAsset('logos/planbetter.png'), yield: '8.57%' },
        ],
      },
      {
        title: 'Liquid Staking',
        description:
          'Keep your STX flexible and still earn BTC. Get a liquid token that lets you trade or use your staked STX anytime.',
        providers: [
          { name: 'Stacking DAO', logo: homeAsset('logos/stacking-dao.png'), yield: '8.72%' },
        ],
      },
    ],
  },
];
