import { AppRoutes } from '@/shared/app-routes';
import { ActivitySelectors } from '@/shared/selectors/activity.selectors';
import { BrowserSelectors } from '@/shared/selectors/browser.selectors';
import { HomeSelectors } from '@/shared/selectors/home.selectors';
import { SharedSelectors } from '@/shared/selectors/shared.selectors';
import { TokenSelectors } from '@/shared/selectors/token.selectors';

import type { MobileFeatureEntry } from './mobile-feature-entry';

const smokeSpec = 'apps/mobile/maestro/flows/smoke-tests.yaml';
const unlockFlow = 'apps/mobile/maestro/shared/unlock.yaml';

export const homeFeatures = [
  {
    id: 'home',
    anchor: { kind: 'route' },
    routes: [AppRoutes.Home],
    params: [],
    entry: [
      { kind: 'nav', steps: ['Launch the app with a wallet; the Home tab is the first screen'] },
      { kind: 'deepLink', steps: ['Open leather://'] },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: HomeSelectors.AccountHeader,
      others: [
        HomeSelectors.PrivacyButton,
        HomeSelectors.SettingsButton,
        HomeSelectors.TokensTab,
        HomeSelectors.CollectiblesTab,
        HomeSelectors.ManageTokensButton,
        HomeSelectors.HiddenTokensButton,
        TokenSelectors.BalanceItem,
      ],
    },
    actions: [unlockFlow],
    specs: [smokeSpec],
    description:
      'Home with a wallet (HomeScreenWithAccount) shows the current account header, which opens the account selector sheet (disabled with a single account), the header actions ("Hide balances"/"Show balances" privacy toggle and "Settings", which navigates to /settings) and the account total balance with "Send", "Receive", "Buy", "Sell" and "Swap" buttons that present the global sheets ("Buy" needs release_onramper_buy, "Sell" release_onramper_sell, "Swap" swap). The "Tokens" and "Collectibles" tabs switch the list; the Tokens list shows "Available" with a slider button that opens the manage tokens sheet, the token rows (TokenSelectors.BalanceItem is a prefix, the id is tokenBalanceItem-<ticker>) that open the token details screen, a "# hidden token(s)" button that also opens the manage tokens sheet (only when hidden tokens have a balance) and "Trending tokens". With no activity yet it shows "Get your first token" and a "Learn" section instead of the available balance. The smoke flow taps the settings button on Home.',
  },
  {
    id: 'token-details',
    anchor: { kind: 'route' },
    routes: [AppRoutes.Asset],
    params: [{ name: 'assetId', example: 'nativeBtc|BTC' }],
    entry: [
      {
        kind: 'nav',
        steps: [
          'On Home tap a token row (TokenSelectors.BalanceItem prefix, e.g. tokenBalanceItem-BTC)',
        ],
      },
      {
        kind: 'deepLink',
        steps: [
          'Open leather://<serialized asset id> (protocol|id, e.g. nativeBtc|BTC, nativeStx|STX or sip10|<contract asset id>) with the "|" URL-encoded',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: { ready: TokenSelectors.DetailsOverview, others: [SharedSelectors.NetworkBadge] },
    actions: [],
    specs: [],
    description:
      'The [assetId] screen deserializes the assetId param and renders BTC, STX or SIP-10 token details, or the collectible details for a sip9 id (see collectible-details); it asserts a current account exists. Token details show the token name as header title with the network badge, the available and quote balance and "Send", "Receive", "Buy", "Sell" and "Swap" buttons that present the global sheets for this asset ("Swap" only for swappable assets with the swap flag; BTC swap also needs swap_sbtc_bridging; "Buy"/"Sell" need the onramper flags). Below come the description, a details table with price and price change, a "Balances" address list for BTC whose rows open the receive sheet, and the asset\'s "Activity" list.',
  },
  {
    id: 'collectible-details',
    anchor: { kind: 'selectors', objects: ['TokenSelectors.CollectibleDetails'] },
    routes: [],
    startRoute: AppRoutes.Home,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          'On Home tap the "Collectibles" tab (HomeSelectors.CollectiblesTab)',
          'Tap a collectible; it navigates to /[assetId] with a sip9 asset id only when the collectible_details flag is on',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: ['collectible_details'],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: { ready: TokenSelectors.CollectibleDetails, others: [] },
    actions: [],
    specs: [],
    description:
      'The [assetId] route renders Sip9Details for a sip9 asset id: a loading state, then BNS-V2 names as BnsDetails and other SIP-9 tokens as Sip9TokenDetails, falling back to an error tab when the collectible is missing. The screen header shows the collectible name, its collection name when present and the network badge; the details include a "Collectible Info" card ("Name", "Collection", "Creator", "Rarity rank", "Layer", "Protocol", "Contract", "File type") and "Attributes".',
  },
  {
    id: 'home-collectibles',
    anchor: { kind: 'selectors', objects: ['HomeSelectors.CollectiblesList'] },
    routes: [],
    startRoute: AppRoutes.Home,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: ['On Home tap the "Collectibles" tab (HomeSelectors.CollectiblesTab)'],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: HomeSelectors.CollectiblesList,
      others: [HomeSelectors.TokensTab, HomeSelectors.CollectiblesTab],
    },
    actions: [],
    specs: [],
    description:
      'The Collectibles tab of Home replaces the token list with a two-column grid of the account\'s SIP-9 collectibles under the same account details and tabs, with pull to refresh, a loading grid, an error fallback and an empty state. A collectible without content shows an image-unavailable tile. Tapping a collectible opens its details only when the collectible_details flag is on; otherwise it does nothing. "Tokens" switches back to the token list.',
  },
  {
    id: 'account-selector-sheet',
    anchor: {
      kind: 'selectors',
      objects: ['HomeSelectors.AccountSelectorSheet', 'HomeSelectors.AccountSelectorCard'],
    },
    routes: [],
    startRoute: AppRoutes.Home,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          'With more than one account, on Home tap the account header (HomeSelectors.AccountHeader)',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: HomeSelectors.AccountSelectorSheet,
      others: [HomeSelectors.AccountSelectorCard, SharedSelectors.DefaultAccountIcon],
    },
    actions: [],
    specs: [],
    description:
      'A full-height sheet headed by "Portfolio" (tapping it opens a description sheet: "Your total tokens across all your accounts.") and the total balance across accounts. It lists every non-hidden account as a card with its wallet name, account name, balance, address and connected app icons, the current account marked selected (SharedSelectors.DefaultAccountIcon is a prefix, the id is defaultAccountIcon_<icon>). Tapping a card closes the sheet and makes that account current.',
  },
  {
    id: 'manage-tokens-sheet',
    anchor: {
      kind: 'selectors',
      objects: ['HomeSelectors.ManageTokensSheet', 'HomeSelectors.ManageTokensDefaultSetItem'],
    },
    routes: [],
    startRoute: AppRoutes.Home,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          'On Home tap the slider button next to "Available" (HomeSelectors.ManageTokensButton), or the "# hidden tokens" button below the token list (HomeSelectors.HiddenTokensButton)',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: HomeSelectors.ManageTokensSheet,
      others: [HomeSelectors.ManageTokensDefaultSetItem, TokenSelectors.SwitchItem],
    },
    actions: [],
    specs: [
      'apps/mobile/src/features/balances/assets/utils/search-sip10-balances.spec.ts',
      'apps/mobile/src/features/balances/assets/utils/sort-sip10-balances.spec.ts',
    ],
    description:
      'A full-height "Manage tokens" sheet (a spinner while balances and visibility load). The "Default set" row shows the current preset and opens the token preset sheet; "Search tokens" filters the list. Each SIP-10 token (USDCx included) has a switch that changes its visibility on Home (TokenSelectors.SwitchItem is a prefix, the id is tokenSwitchItem-<ticker>). It shows "Failed to load tokens" on error and "No tokens found" when the search matches nothing.',
  },
  {
    id: 'token-preset-sheet',
    anchor: { kind: 'selectors', objects: ['HomeSelectors.TokenPresetItem'] },
    routes: [],
    startRoute: AppRoutes.Home,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          'Open the manage tokens sheet from Home (HomeSelectors.ManageTokensButton)',
          'Tap "Default set" (HomeSelectors.ManageTokensDefaultSetItem)',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: { ready: HomeSelectors.TokenPresetItem, others: [] },
    actions: [],
    specs: ['apps/mobile/src/store/settings/token-preset.spec.ts'],
    description:
      'A "Default set" sheet with three radio rows: "Gas only" ("BTC, STX"), "Main tokens" ("BTC, STX, sBTC, USDCx") and "All priced tokens" ("Same as the extension"); the current preset is selected. Tapping a row saves that preset and dismisses the sheet. HomeSelectors.TokenPresetItem is a prefix: the id is homeTokenPresetItem-<preset> (gasOnly, mainTokens, allPricedTokens).',
  },
  {
    id: 'activity',
    anchor: { kind: 'route' },
    routes: [AppRoutes.Activity],
    params: [],
    entry: [
      { kind: 'nav', steps: ['Tap "Activity" in the tab bar (ActivitySelectors.Tab)'] },
      { kind: 'deepLink', steps: ['Open leather://activity'] },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: ActivitySelectors.List,
      others: [ActivitySelectors.Item, ActivitySelectors.Empty],
    },
    actions: [],
    specs: [],
    description:
      'The "Activity" screen lists the current account\'s activity with pull to refresh and skeleton rows while loading. Each item shows its status or title, timestamp (prefixed "Swapping", "Swap failed" or "Swapped" for swaps) and balances; tapping an item with a link opens it in the in-app browser. With no activity, on error or with no wallet (no list then) it shows "Make your first transaction to get started" (ActivitySelectors.Empty).',
  },
  {
    id: 'tab-bar',
    anchor: {
      kind: 'selectors',
      objects: ['HomeSelectors.HomeTab', 'ActivitySelectors.Tab', 'BrowserSelectors.Tab'],
    },
    routes: [],
    startRoute: AppRoutes.Home,
    params: [],
    entry: [
      { kind: 'nav', steps: ['Visible at the bottom of the Home, Activity and Browser tabs'] },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: HomeSelectors.HomeTab,
      others: [ActivitySelectors.Tab, BrowserSelectors.Tab],
    },
    actions: [],
    specs: [],
    description:
      'The bottom tab bar has "Home", "Activity" and "Browser" tabs. Tapping an unfocused tab switches to it; tapping the focused Home tab on a nested route (e.g. token details) dismisses back to Home, and otherwise tapping the focused tab scrolls it to the top.',
  },
] as const satisfies readonly MobileFeatureEntry[];
