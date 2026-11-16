import { AppRoutes } from '@/shared/app-routes';
import { SwapSelectors } from '@/shared/selectors/swap.selectors';

import type { MobileFeatureEntry } from './mobile-feature-entry';

const openSwapFromHome =
  'On Home tap the "Swap" button in the account actions row (it renders only with the swap flag on and a wallet present)';
const reachReview =
  'Pick both assets, enter an amount and tap "Review" once a quote loads (SwapSelectors.ReviewButton)';

export const swapFeatures = [
  {
    id: 'swap-form',
    anchor: { kind: 'selectors', objects: ['SwapSelectors.BaseAssetToggle'] },
    routes: [],
    startRoute: AppRoutes.Home,
    params: [],
    entry: [
      { kind: 'nav', steps: [openSwapFromHome] },
      {
        kind: 'nav',
        steps: [
          'On a swappable token screen (AppRoutes.Asset) tap "Swap": the token becomes the pay asset (Bitcoin shows the button only with swap_sbtc_bridging on)',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: ['swap'],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: SwapSelectors.BaseAssetToggle,
      others: [
        SwapSelectors.TargetAssetToggle,
        SwapSelectors.FlipButton,
        SwapSelectors.ReviewButton,
      ],
    },
    actions: [],
    specs: [],
    description:
      'The global "Swap" sheet, mounted in _layout.tsx only with the swap flag on; it opens with STX as the pay asset unless a token screen passes one. A pay card with the amount and its asset toggle, a receive card with the estimated amount and a target toggle ("Select" until chosen, disabled with no pay asset), a "Flip assets" button, a quote preview ("Rate", "Estimated fees", or states such as "No quotes available for this swap.", "Unable to load the quote" and "Amount too small"), 25%/50%/75%/"MAX" presets, a numpad and a "Review" button enabled once the swap can be submitted.',
  },
  {
    id: 'swap-asset-selector',
    anchor: { kind: 'selectors', objects: ['SwapSelectors.AssetSelector'] },
    routes: [],
    startRoute: AppRoutes.Home,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          openSwapFromHome,
          'Tap the pay asset toggle (SwapSelectors.BaseAssetToggle) or the receive asset toggle (SwapSelectors.TargetAssetToggle)',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: ['swap'],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: SwapSelectors.AssetSelector,
      others: [SwapSelectors.AssetSelectorItem],
    },
    actions: [],
    specs: [],
    description:
      'Nested sheet listing the assets that can be paid or received, with a "Search for asset" input and one SwapSelectors.AssetSelectorItem per asset showing its balance; tapping one sets it and closes the sheet. Empty states read "No assets found" with "Clear search", "No swaps available" when the pay asset has no target, or "No assets"; a failed load shows "Unable to load assets" with "Retry". Without swap_sbtc_bridging, BTC to anything and sBTC to BTC are disabled pairs.',
  },
  {
    id: 'swap-review',
    anchor: { kind: 'selectors', objects: ['SwapSelectors.ReviewDetails'] },
    routes: [],
    startRoute: AppRoutes.Home,
    params: [],
    entry: [{ kind: 'nav', steps: [openSwapFromHome, reachReview] }],
    gate: 'splashScreen',
    flags: ['swap'],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: SwapSelectors.ReviewDetails,
      others: [SwapSelectors.ConfirmButton, SwapSelectors.SlippageToggle],
    },
    actions: [],
    specs: [],
    description:
      'The "Review Swap" step with a back button to the form: a summary of both amounts, then "From", "Rate", "Min. receive", "Slippage" (a toggle opening the slippage sheet), "Price impact" above the warning threshold and "Estimated fees", the last four with info buttons. "Confirm" submits and shows an overlay ("Initiating the swap...", "Swap initiated" then the sheet closes, or "Failed to start a swap" with "Back to review"). A failed or empty quote shows "Unable to load swap details" with "Retry" or "No quotes available" with "Go back".',
  },
  {
    id: 'swap-slippage',
    anchor: { kind: 'selectors', objects: ['SwapSelectors.SlippageSheet'] },
    routes: [],
    startRoute: AppRoutes.Home,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          openSwapFromHome,
          reachReview,
          'Tap the slippage percentage next to "Slippage" (SwapSelectors.SlippageToggle); it shows only when slippage applies to the quote',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: ['swap'],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: SwapSelectors.SlippageSheet,
      others: [SwapSelectors.UpdateSlippageButton],
    },
    actions: [],
    specs: [],
    description:
      '"Edit Slippage" sheet explaining "Price moving against you past this percentage will cancel the swap." with a numeric input whose "Decrease slippage" and "Increase slippage" buttons step the value. "Update slippage" saves it to the swap state and closes the sheet.',
  },
  {
    id: 'swap-info-sheets',
    anchor: { kind: 'selectors', objects: ['SwapSelectors.InfoSheet'] },
    routes: [],
    startRoute: AppRoutes.Home,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          openSwapFromHome,
          reachReview,
          'Tap an "Info" button (SwapSelectors.InfoButton) next to "Min. receive", "Slippage", "Price impact" or "Estimated fees"',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: ['swap'],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: { ready: SwapSelectors.InfoSheet, others: [SwapSelectors.InfoButton] },
    actions: [],
    specs: [],
    description:
      'Informational sheets on the review step, each mounted only while open: "Minimum receive", "Slippage tolerance" and "Price impact" explain the term, and "Fees" lists the "Network fee" and the provider fee with their amounts. The info buttons share the SwapSelectors.InfoButton id, so pick one by position.',
  },
] as const satisfies readonly MobileFeatureEntry[];
