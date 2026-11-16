import { AppRoutes } from '@/shared/app-routes';
import { ApproverSelectors } from '@/shared/selectors/approver.selectors';
import { RpcBitcoinSelectors } from '@/shared/selectors/rpc-bitcoin.selectors';

import type { MobileFeatureEntry } from './mobile-feature-entry';

const openBrowserStep =
  'Open the Browser tab and load the dApp; when the page finishes loading the Browser records its origin in the apps store as "recently_visited" (userAddsApp in browser.tsx)';
const routingStep =
  'The WebView message is accepted only from a frame on the top-frame origin (resolveBrowserRpcRequest in message-routing.ts) and opens the approver sheet (ApproverSelectors.Sheet) with the request and origin';
const connectedStep =
  'Connect the origin first: approve getAddresses or stx_getAddresses for it, which dispatches userConnectsApp and stores the origin as "connected" with the chosen accountId';
const sheetNote =
  'BrowserApprover renders nothing unless the origin has a record in the apps store (useAppByOrigin); any page loaded in the Browser tab has one.';
const resultNote =
  'The Browser’s sendResult posts the response into the WebView and dismisses the approver sheet. "Cancel" (ApproverSelectors.CancelButton) posts 4001 "User rejected request" and dismisses the sheet (closeApprover in approver-sheet.tsx).';

export const rpcBitcoinFeatures = [
  {
    id: 'rpc-get-addresses',
    anchor: { kind: 'selectors', objects: ['ApproverSelectors.ConnectPermissions'] },
    routes: [],
    startRoute: AppRoutes.Browser,
    params: [],
    entry: [
      {
        kind: 'rpc',
        method: 'getAddresses',
        steps: [
          openBrowserStep,
          "The dApp calls LeatherProvider.request('getAddresses')",
          routingStep,
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: ApproverSelectors.ConnectPermissions,
      others: [
        ApproverSelectors.ChooseAccountButton,
        ApproverSelectors.ApproveButton,
        ApproverSelectors.CancelButton,
      ],
    },
    actions: [],
    specs: [],
    description: `Connect approver titled "Connect" with the dApp favicon: it lists "This app would like to" "Request approval for transactions" and "View your wallet balance & activity" (ApproverSelectors.ConnectPermissions). An origin that is already connected preselects its account card; otherwise "Choose an account" (ApproverSelectors.ChooseAccountButton) opens the account selector sheet, and "Approve" stays disabled until an account is chosen. "Approve" returns { addresses } with the account's taproot and native segwit addresses, public keys, derivation paths and descriptors plus its Stacks address and public key, and dispatches userConnectsApp, which marks the origin "connected" with that accountId; this is what the other approvers need. ${sheetNote} ${resultNote}`,
  },
  {
    id: 'rpc-sign-psbt',
    anchor: { kind: 'selectors', objects: ['RpcBitcoinSelectors.PsbtOutcome'] },
    routes: [],
    startRoute: AppRoutes.Browser,
    params: [],
    entry: [
      {
        kind: 'rpc',
        method: 'signPsbt',
        steps: [
          openBrowserStep,
          connectedStep,
          "The dApp calls LeatherProvider.request('signPsbt', { hex, broadcast?, signAtIndex?, allowedSighash?, network? })",
          routingStep,
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: RpcBitcoinSelectors.PsbtOutcome,
      others: [
        RpcBitcoinSelectors.PsbtRecipients,
        RpcBitcoinSelectors.PsbtFeeSection,
        RpcBitcoinSelectors.PsbtTotalSpend,
        ApproverSelectors.ApproveButton,
        ApproverSelectors.CancelButton,
      ],
    },
    actions: [],
    specs: ['apps/mobile/src/features/psbt-signer/signer.spec.ts'],
    description: `PSBT approver (PsbtSigner) titled "Send token": "You’ll send" with the BTC amount (RpcBitcoinSelectors.PsbtOutcome), "To address" with the non-wallet outputs (RpcBitcoinSelectors.PsbtRecipients), the account card, a read-only fee card (RpcBitcoinSelectors.PsbtFeeSection; feeEditorEnabled is false), "Show advanced options" with "Inputs and outputs", and "Total spend" in the footer (RpcBitcoinSelectors.PsbtTotalSpend). Warnings appear for a mutable sighash ("Be careful with this transaction") and for outputs without an address ("Unverified recipient"). It renders nothing unless the origin is "connected"; the connected account's inputs get BIP32 derivations added, and a PSBT asking to sign an input that is not the account's at a requested index throws "PSBT asks to sign an input that is not ours" (addBip32DerivationFieldToInputs in approver-sheet/utils.ts). "Approve" signs only the signAtIndex inputs (signer.spec.ts), finalizes, then returns { hex } when broadcast is false or broadcasts and returns { hex, txid }; a failure shows the toast "Failed to broadcast transaction" and turns the button into "Retry". ${resultNote}`,
  },
  {
    id: 'rpc-send-transfer',
    anchor: { kind: 'selectors', objects: ['RpcBitcoinSelectors.PsbtOutcome'] },
    routes: [],
    startRoute: AppRoutes.Browser,
    params: [],
    entry: [
      {
        kind: 'rpc',
        method: 'sendTransfer',
        steps: [
          openBrowserStep,
          connectedStep,
          "The dApp calls LeatherProvider.request('sendTransfer', { recipients: [{ address, amount }], network?, broadcast? }) with sat-denominated integer amounts, or the legacy { address, amount }",
          routingStep,
          'The approver renders nothing until the account UTXOs and the fee estimates load',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: RpcBitcoinSelectors.PsbtOutcome,
      others: [
        RpcBitcoinSelectors.PsbtRecipients,
        RpcBitcoinSelectors.PsbtFeeSection,
        RpcBitcoinSelectors.PsbtTotalSpend,
        RpcBitcoinSelectors.SendTransferFeesUnavailable,
        ApproverSelectors.ApproveButton,
        ApproverSelectors.CancelButton,
      ],
    },
    actions: [],
    specs: ['apps/mobile/src/features/browser/approver-sheet/send-transfer.utils.spec.ts'],
    description: `Bitcoin transfer approver: it builds a native segwit PSBT from the connected account's UTXOs at the half-hour fee rate (getSendTransferRecipients rejects fractional sat amounts, send-transfer.utils.spec.ts) and shows it in PsbtSigner with "You’ll send", "To address", the account card, an editable fee card (RpcBitcoinSelectors.PsbtFeeSection opens the bitcoin fee sheet; a change shows the toast "Fee updated") and "Total spend". The title is "Send token"; with broadcast: false it is "Sign transaction" with the "Leather won't broadcast this transaction" warning and the button reads "Sign transaction". When fee estimates fail it shows only "To address" (RpcBitcoinSelectors.SendTransferFeesUnavailable) with "Approve" disabled. "Approve" signs and broadcasts and returns { txid, transaction }. The app must be "connected": getAccountIdFromConnectedApp throws "App is not connected" otherwise. ${resultNote}`,
  },
  {
    id: 'rpc-sign-message',
    anchor: { kind: 'selectors', objects: ['RpcBitcoinSelectors.SignMessageMessage'] },
    routes: [],
    startRoute: AppRoutes.Browser,
    params: [],
    entry: [
      {
        kind: 'rpc',
        method: 'signMessage',
        steps: [
          openBrowserStep,
          "The dApp calls LeatherProvider.request('signMessage', { message, paymentType, type?, account?, network? })",
          routingStep,
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: RpcBitcoinSelectors.SignMessageMessage,
      others: [
        ApproverSelectors.ChooseAccountButton,
        ApproverSelectors.ApproveButton,
        ApproverSelectors.CancelButton,
      ],
    },
    actions: [],
    specs: [],
    description: `Bitcoin message approver titled "Sign Message" with the account card and "Message" showing the text (RpcBitcoinSelectors.SignMessageMessage). For a connected origin it preselects the connected account, or the account at index account - 1 of the same wallet when the request passes account; for an origin that is only visited it shows "Choose an account" (ApproverSelectors.ChooseAccountButton), which opens the account selector sheet. "Approve" signs the message with BIP-322 (signBip322Message) and returns the signature result; it does nothing without a selected account. ${sheetNote} ${resultNote}`,
  },
] as const satisfies readonly MobileFeatureEntry[];
