import { AppRoutes } from '@/shared/app-routes';
import { RampSelectors } from '@/shared/selectors/ramp.selectors';

import type { MobileFeatureEntry } from './mobile-feature-entry';

export const rampFeatures = [
  {
    id: 'ramp-buy',
    anchor: { kind: 'selectors', objects: ['RampSelectors.OnramperWebView'] },
    routes: [],
    startRoute: AppRoutes.Home,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          'On Home tap the "Buy" button in the account actions row (it renders only with release_onramper_buy on)',
        ],
      },
      {
        kind: 'nav',
        steps: [
          'On a token screen (AppRoutes.Asset) tap "Buy" (also behind release_onramper_buy) to preselect that token',
        ],
      },
      {
        kind: 'nav',
        steps: [
          'On Home, while the account has no activity, tap "Buy" on the Bitcoin or Stacks deposit cell; this button does not check the flag',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: ['release_onramper_buy'],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: { ready: RampSelectors.OnramperWebView, others: [] },
    actions: [],
    specs: [],
    description:
      "Global ramp sheet in buy mode: a WebView loading the Onramper widget with the theme and the current account's Native Segwit and Stacks addresses (only the address of the token's chain when a token screen or deposit cell opens it), redirecting to the Leather portfolio on success or failure. The purchase itself happens inside the third-party widget; closing the sheet resets it.",
  },
  {
    id: 'ramp-sell',
    anchor: { kind: 'selectors', objects: ['RampSelectors'] },
    routes: [],
    startRoute: AppRoutes.Home,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          'On Home tap the "Sell" button in the account actions row (it renders only with release_onramper_sell on)',
        ],
      },
      {
        kind: 'nav',
        steps: ['On a token screen (AppRoutes.Asset) tap "Sell" to preselect that token'],
      },
    ],
    gate: 'splashScreen',
    flags: ['release_onramper_sell'],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: { ready: RampSelectors.OnramperWebView, others: [] },
    actions: [],
    specs: [],
    description:
      'The same ramp sheet in sell mode: the Onramper widget WebView opens with sell parameters (BTC as the default crypto and USD as the default fiat) and the account addresses for the relevant chain. The sale happens inside the third-party widget.',
  },
] as const satisfies readonly MobileFeatureEntry[];
