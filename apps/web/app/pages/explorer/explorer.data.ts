const explorerAssetPath = '/marketing/explorer';

export interface ExplorerApp {
  name: string;
  href: string;
  iconSrc: string;
}

interface ExplorerAppTab {
  id: string;
  label: string;
  apps: ExplorerApp[];
}

export const explorerHero = {
  title: 'Grow your Bitcoin',
  subtitle: 'Up to 8% with direct wallet payouts',
  actionLabel: 'Get sBTC',
  href: '/sbtc',
};

const allApps: ExplorerApp[] = [
  { name: 'ALEX', href: 'https://www.alexlab.co/swap', iconSrc: `${explorerAssetPath}/alex.png` },
  {
    name: 'Arkadiko',
    href: 'https://app.arkadiko.finance/',
    iconSrc: `${explorerAssetPath}/arkadiko.png`,
  },
  {
    name: 'Bitflow',
    href: 'https://app.bitflow.finance/trade',
    iconSrc: `${explorerAssetPath}/bitflow.png`,
  },
  {
    name: 'Brotocol',
    href: 'https://brotocol.xyz/bitcoin/swap',
    iconSrc: `${explorerAssetPath}/brotocol.png`,
  },
  {
    name: 'Charisma',
    href: 'https://swap.charisma.rocks/swap',
    iconSrc: `${explorerAssetPath}/charisma.png`,
  },
  {
    name: 'Granite',
    href: 'https://app.granite.world/',
    iconSrc: `${explorerAssetPath}/granite.png`,
  },
  { name: 'LISA', href: 'https://app.lisalab.io/', iconSrc: `${explorerAssetPath}/lisa.png` },
  {
    name: 'Hermetica',
    href: 'https://app.hermetica.fi/swap',
    iconSrc: `${explorerAssetPath}/hermetica.png`,
  },
  { name: 'Velar', href: 'https://app.velar.com/swap', iconSrc: `${explorerAssetPath}/velar.png` },
  {
    name: 'StackingDAO',
    href: 'https://app.stackingdao.com/',
    iconSrc: `${explorerAssetPath}/stacking-dao.png`,
  },
  { name: 'Zest', href: 'https://app.zestprotocol.com/', iconSrc: `${explorerAssetPath}/zest.png` },
];

const fastPoolIconSrc = '/marketing/apps/fast-pool-provider.png';

const poolApps: ExplorerApp[] = [
  { name: 'Fast Pool', href: '/staking', iconSrc: fastPoolIconSrc },
  { name: 'Fast Pool V2', href: '/staking', iconSrc: fastPoolIconSrc },
  { name: 'Plan Better', href: '/staking', iconSrc: '/marketing/apps/planbetter-provider.png' },
  { name: 'Restake', href: '/staking', iconSrc: `${explorerAssetPath}/restake.png` },
  { name: 'Xverse', href: '/staking', iconSrc: `${explorerAssetPath}/xverse.png` },
  { name: 'Stacking DAO', href: '/staking', iconSrc: `${explorerAssetPath}/stacking-dao.png` },
];

const liquidApps: ExplorerApp[] = [
  {
    name: 'StackingDAO',
    href: 'https://app.stackingdao.com/',
    iconSrc: `${explorerAssetPath}/stacking-dao.png`,
  },
  { name: 'LISA', href: 'https://app.lisalab.io/', iconSrc: `${explorerAssetPath}/lisa.png` },
];

export const defaultExplorerTabId = 'all';

export const explorerAppTabs: ExplorerAppTab[] = [
  { id: defaultExplorerTabId, label: 'All apps', apps: allApps },
  { id: 'pool', label: 'Lock in a pool', apps: poolApps },
  { id: 'liquid', label: 'Stay liquid', apps: liquidApps },
];

export const explorerDisclaimer =
  'Leather does not operate or manage any Stacking pools or liquid Stacking protocols. Users are responsible for evaluating the risks, terms, and smart contracts involved in any third-party options they access through Leather.';
