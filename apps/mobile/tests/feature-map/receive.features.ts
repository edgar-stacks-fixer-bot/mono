import { AppRoutes } from '@/shared/app-routes';
import { ReceiveSelectors } from '@/shared/selectors/receive.selectors';

import type { MobileFeatureEntry } from './mobile-feature-entry';

const openReceiveFromHome =
  'On Home tap the "Receive" button in the account actions row (it renders only when a wallet exists)';

export const receiveFeatures = [
  {
    id: 'receive-select-asset',
    anchor: { kind: 'selectors', objects: ['ReceiveSelectors.AssetItem'] },
    routes: [],
    startRoute: AppRoutes.Home,
    params: [],
    entry: [{ kind: 'nav', steps: [openReceiveFromHome] }],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: ReceiveSelectors.AssetItem,
      others: [ReceiveSelectors.AssetItemCopyButton],
    },
    actions: [],
    specs: [],
    description:
      'First step of the global receive sheet opened for all assets: a "Select asset" screen with the "Receive" subtitle listing three rows (ReceiveSelectors.AssetItem): "Bitcoin" with the "Native Segwit" badge, "Bitcoin" with the "Taproot" badge and "Stacks", each with its truncated address. The "Copy address" icon on a row copies the address and toasts "Address copied"; tapping the row opens its address details.',
  },
  {
    id: 'receive-asset-details',
    anchor: { kind: 'selectors', objects: ['ReceiveSelectors.AssetDetails'] },
    routes: [],
    startRoute: AppRoutes.Home,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [openReceiveFromHome, 'Tap an asset row (ReceiveSelectors.AssetItem)'],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: ReceiveSelectors.AssetDetails,
      others: [
        ReceiveSelectors.QrCode,
        ReceiveSelectors.CopyAddressButton,
        ReceiveSelectors.ShareButton,
      ],
    },
    actions: [],
    specs: [],
    description:
      'The "Receive" screen for one address, titled with the account name: a QR code of the address with the Leather lettermark, the asset name and address-type badge, a description such as "This is your address for receiving tokens on the Stacks network.", the address in a pressable box that copies it ("Address copied") and a "Share" button that opens the system share sheet. The back button shows only when the screen was reached from "Select asset".',
  },
  {
    id: 'receive-from-asset',
    anchor: { kind: 'selectors', objects: ['ReceiveSelectors'] },
    routes: [],
    startRoute: AppRoutes.Asset,
    deepLinkable: false,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          'On a token screen (AppRoutes.Asset) tap "Receive", or tap an address row in its address list',
        ],
      },
      {
        kind: 'nav',
        steps: [
          'On Home switch to the collectibles tab; with no NFTs tap "Receive Stacks NFT" under "Get your first NFT"',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: ReceiveSelectors.AssetDetails,
      others: [ReceiveSelectors.AssetItem, ReceiveSelectors.QrCode],
    },
    actions: [],
    specs: [],
    description:
      'The receive sheet opened for one chain instead of all assets. Stacks and SIP-10 tokens, a single address row and "Receive Stacks NFT" open straight on the address details with no back button; Bitcoin opens "Select asset" with only the Native Segwit and Taproot rows (ReceiveSelectors.AssetItem).',
  },
] as const satisfies readonly MobileFeatureEntry[];
