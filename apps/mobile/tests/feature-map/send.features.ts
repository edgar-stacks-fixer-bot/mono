import { AppRoutes } from '@/shared/app-routes';
import { ApproverSelectors } from '@/shared/selectors/approver.selectors';
import { SendSelectors } from '@/shared/selectors/send.selectors';

import type { MobileFeatureEntry } from './mobile-feature-entry';

const recipientSuggestionsSpec =
  'apps/mobile/src/features/send/components/recipient/build-recipient-suggestions.spec.ts';
const openSendFromHome =
  'On Home tap the "Send" button in the account actions row (it renders only when a wallet exists)';
const openRecipientSheet =
  'On the send form tap the "Enter recipient" field (SendSelectors.RecipientToggle)';

export const sendFeatures = [
  {
    id: 'send-select-asset',
    anchor: { kind: 'selectors', objects: ['SendSelectors.AssetPickerItem'] },
    routes: [],
    startRoute: AppRoutes.Home,
    params: [],
    entry: [{ kind: 'nav', steps: [openSendFromHome] }],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: { ready: SendSelectors.AssetPickerItem, others: [] },
    actions: [],
    specs: [],
    description:
      'First step of the global send sheet when it opens without an asset: a "Select asset" screen with the "Send" subtitle listing the current account\'s Bitcoin and Stacks balances, followed by its SIP-10 tokens only when release_sip10_send_feature is on. Every row is a SendSelectors.AssetPickerItem; tapping one opens the send form for that asset. The same picker renders in a nested sheet when the asset row on the send form is tapped.',
  },
  {
    id: 'send-btc-form',
    anchor: { kind: 'selectors', objects: ['SendSelectors.BtcForm'] },
    routes: [],
    startRoute: AppRoutes.Home,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          openSendFromHome,
          'In "Select asset" tap the Bitcoin row (SendSelectors.AssetPickerItem)',
        ],
      },
      {
        kind: 'nav',
        steps: [
          'On the Bitcoin asset screen (AppRoutes.Asset) tap "Send": the sheet skips the asset picker',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: SendSelectors.BtcForm,
      others: [
        SendSelectors.RecipientToggle,
        SendSelectors.RecipientQrButton,
        SendSelectors.ReviewButton,
      ],
    },
    actions: [],
    specs: [],
    description:
      'The "Send" form for Bitcoin, shown after a loader fetches balance, fee rates, UTXOs and market data. It shows the "Bitcoin" asset row (tapping it reopens the asset picker in a nested sheet), an amount field with a "Max" button, the "Enter recipient" field with a "Scan a QR code" button, a numpad and a "Review" button that is disabled until the form is valid. "Review" builds the PSBT and moves to the approver step.',
  },
  {
    id: 'send-stx-form',
    anchor: { kind: 'selectors', objects: ['SendSelectors.StxForm'] },
    routes: [],
    startRoute: AppRoutes.Home,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          openSendFromHome,
          'In "Select asset" tap the Stacks row (SendSelectors.AssetPickerItem)',
        ],
      },
      {
        kind: 'nav',
        steps: [
          'On the Stacks asset screen (AppRoutes.Asset) tap "Send": the sheet skips the asset picker',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: SendSelectors.StxForm,
      others: [SendSelectors.RecipientToggle, SendSelectors.MemoToggle, SendSelectors.ReviewButton],
    },
    actions: [],
    specs: [],
    description:
      'The "Send" form for Stacks, shown after a loader fetches balance, nonce and market data. Like the Bitcoin form it has the "Stacks" asset row, an amount field with "Max", the "Enter recipient" field, a numpad and a "Review" button, plus an "Add memo" toggle (SendSelectors.MemoToggle, "Edit memo" once set) that opens an "Add memo" sheet with a "Memo" input and a "Confirm" button. "Review" builds the unsigned transaction and moves to the approver step.',
  },
  {
    id: 'send-sip10-form',
    anchor: { kind: 'selectors', objects: ['SendSelectors.Sip10Form'] },
    routes: [],
    startRoute: AppRoutes.Home,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          openSendFromHome,
          'In "Select asset" tap a SIP-10 token row (SendSelectors.AssetPickerItem); the rows are listed only with release_sip10_send_feature on',
        ],
      },
      {
        kind: 'nav',
        steps: [
          'On a SIP-10 token screen (AppRoutes.Asset) tap "Send": this path opens the form without the flag',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: ['release_sip10_send_feature'],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: SendSelectors.Sip10Form,
      others: [SendSelectors.RecipientToggle, SendSelectors.MemoToggle, SendSelectors.ReviewButton],
    },
    actions: [],
    specs: [],
    description:
      'The "Send" form for a SIP-10 token the account holds, with the token name and icon in the asset row and the token\'s decimals applied to the amount and numpad. Otherwise it matches the Stacks form: "Max", "Enter recipient", "Add memo", numpad and "Review". The asset picker lists SIP-10 tokens only when release_sip10_send_feature is on; the token screen\'s "Send" button opens this form whatever the flag.',
  },
  {
    id: 'send-recipient-selector',
    anchor: { kind: 'selectors', objects: ['SendSelectors.RecipientSheet'] },
    routes: [],
    startRoute: AppRoutes.Home,
    params: [],
    entry: [{ kind: 'nav', steps: [openSendFromHome, 'Pick an asset', openRecipientSheet] }],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: SendSelectors.RecipientSheet,
      others: [SendSelectors.RecipientSearchQrButton, SendSelectors.RecipientSelectorItem],
    },
    actions: [],
    specs: [recipientSuggestionsSpec],
    description:
      'Recipient sheet over the send form with a "Search for BNS name or address" input, a "Scan a QR code" button (SendSelectors.RecipientSearchQrButton) and, with the send_paste_button flag on iOS, a paste button. Below it suggestions are grouped under "Recents", "Your accounts" and "Matching" (build-recipient-suggestions.spec.ts); every row is a SendSelectors.RecipientSelectorItem. A search with no valid result shows "No results found". Selecting a row runs the recipient guard and, if it passes, fills the recipient field.',
  },
  {
    id: 'send-recipient-qr-scanner',
    anchor: { kind: 'selectors', objects: ['SendSelectors.QrScannerCloseButton'] },
    routes: [],
    startRoute: AppRoutes.Home,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          openSendFromHome,
          'Pick an asset',
          'Tap "Scan a QR code" in the recipient field (SendSelectors.RecipientQrButton) or in the recipient sheet (SendSelectors.RecipientSearchQrButton)',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: { ready: SendSelectors.QrScannerCloseButton, others: [] },
    actions: [],
    specs: [],
    description:
      'Full-screen camera sheet titled "Scan QR Code" with a "Close the scanner" back button (SendSelectors.QrScannerCloseButton); it needs camera permission. It accepts a Bitcoin or Stacks address or a BIP-21 Bitcoin URI and passes the address to the recipient guard; any other code flashes "Scan a Bitcoin or Stacks address" for a moment.',
  },
  {
    id: 'send-recipient-guard',
    anchor: { kind: 'selectors', objects: ['SendSelectors.RecipientGuardSheet'] },
    routes: [],
    startRoute: AppRoutes.Home,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          openSendFromHome,
          'Pick an asset',
          openRecipientSheet,
          'Pick or scan an address the account has not sent to before, its own address, or an address from another network',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: SendSelectors.RecipientGuardSheet,
      others: [
        SendSelectors.RecipientGuardConfirmButton,
        SendSelectors.RecipientGuardCancelButton,
        SendSelectors.RecipientGuardDismissButton,
      ],
    },
    actions: [],
    specs: [],
    description:
      'Sheet that opens by itself when a chosen recipient needs a check, showing the title, a description and the full address. Warnings ("Verify full address" for a new address, "Sending to the same address" when self-send is allowed) offer "Confirm" and "Cancel"; blocks ("Can’t send to the same address", "Address from another network", "Address blocked") offer only "Dismiss". With no issue the sheet does not render.',
  },
  {
    id: 'send-approver',
    anchor: { kind: 'selectors', objects: ['ApproverSelectors.ApproveButton'] },
    routes: [],
    startRoute: AppRoutes.Home,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          openSendFromHome,
          'Pick an asset, enter an amount and a recipient',
          'Tap "Review" (SendSelectors.ReviewButton)',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: { ready: ApproverSelectors.ApproveButton, others: [ApproverSelectors.CancelButton] },
    actions: [],
    specs: [],
    description:
      'Last step of the send sheet: the shared approver for the transaction built by the form. Bitcoin renders the PSBT signer ("Send token") with the fee editor and broadcast on; Stacks and SIP-10 render the Stacks transaction approver ("Sign Transaction" with "You’ll send", "To address" and "Show advanced options"). Back returns to the form; approving signs and broadcasts, a Stacks success toasts "Transaction is sent!", and closing dismisses the send sheet.',
  },
] as const satisfies readonly MobileFeatureEntry[];
