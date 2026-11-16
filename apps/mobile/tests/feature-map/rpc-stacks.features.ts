import { AppRoutes } from '@/shared/app-routes';
import { ApproverSelectors } from '@/shared/selectors/approver.selectors';
import { RpcStacksSelectors } from '@/shared/selectors/rpc-stacks.selectors';

import type { MobileFeatureEntry } from './mobile-feature-entry';

const openBrowserStep =
  'Open the Browser tab and load the dApp; when the page finishes loading the Browser records its origin in the apps store as "recently_visited" (userAddsApp in browser.tsx)';
const routingStep =
  'The WebView message is accepted only from a frame on the top-frame origin (resolveBrowserRpcRequest in message-routing.ts) and opens the approver sheet (ApproverSelectors.Sheet) with the request and origin';
const connectedStep =
  'Connect the origin first: approve getAddresses or stx_getAddresses for it, which dispatches userConnectsApp and stores the origin as "connected" with the chosen accountId';
const nonceStep =
  'NonceLoader renders nothing until the next nonce of the account loads; on error it shows the toast "Failed to load latest nonce" and uses 0';
const sheetNote =
  'BrowserApprover renders nothing unless the origin has a record in the apps store (useAppByOrigin); any page loaded in the Browser tab has one.';
const connectedNote =
  'The origin must be "connected" (approved getAddresses or stx_getAddresses): getAccountIdFromConnectedApp throws "App is not connected" otherwise.';
const resultNote =
  'The Browser’s sendResult posts the response into the WebView and dismisses the approver sheet. "Cancel" (ApproverSelectors.CancelButton) posts 4001 "User rejected request" and dismisses the sheet (closeApprover in approver-sheet.tsx).';
const txLayoutNote =
  'The transaction approver (BaseStxTxApproverLayout) is titled "Sign Transaction" and shows the connected account card, a fee card (RpcStacksSelectors.TxFeeSection; it opens the Stacks fee sheet, or reads "Sponsored fee" "FREE" for a sponsored transaction) and "Show advanced options", which reveals the nonce card (RpcStacksSelectors.TxNonceSection, opens the nonce sheet).';
const contractCallNote =
  'For a contract call it lists the post conditions (RpcStacksSelectors.TxPostConditions), a "To address" outcome when the call is a token transfer, the function and contract id (RpcStacksSelectors.TxContractCallSummary) and "Contract arguments" under the advanced options. With post condition mode allow it shows the callout "This is an “Allow Mode” transaction" and opens a sheet "Careful. This transaction could drain your wallet.": "Proceed to transaction" (ApproverSelectors.AllowModeProceedButton) is enabled after "I’m aware of the risks" is switched on, and "Do not proceed" (ApproverSelectors.AllowModeDoNotProceedButton) closes the approver.';
const broadcastNote =
  '"Approve" signs and broadcasts and returns { transaction, txid }; a sponsored transaction is returned as { transaction } without a broadcast. A failed broadcast shows the error message as a toast and turns the button into "Retry" (ApproverSelectors.RetryButton).';
const fixedFeeNote =
  'The fee is the default Stacks fee (0 when sponsored: true) and the nonce comes from NonceLoader; the request fee, nonce and postConditions are not used.';
const stxTxOthers = [
  RpcStacksSelectors.TxFeeSection,
  RpcStacksSelectors.TxNonceSection,
  ApproverSelectors.ApproveButton,
  ApproverSelectors.CancelButton,
] as const;
const contractCallOthers = [
  RpcStacksSelectors.TxContractCallSummary,
  ApproverSelectors.AllowModeProceedButton,
  ApproverSelectors.AllowModeDoNotProceedButton,
] as const;
const getStxRequestParamsSpec = 'apps/mobile/src/features/browser/approver-sheet/stx/utils.spec.ts';

export const rpcStacksFeatures = [
  {
    id: 'rpc-stx-get-addresses',
    anchor: { kind: 'selectors', objects: ['ApproverSelectors.ConnectPermissions'] },
    routes: [],
    startRoute: AppRoutes.Browser,
    params: [],
    entry: [
      {
        kind: 'rpc',
        method: 'stx_getAddresses',
        steps: [
          openBrowserStep,
          "The dApp calls LeatherProvider.request('stx_getAddresses', { network? })",
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
    description: `Stacks connect approver, same layout as getAddresses: "Connect" with the dApp favicon, the account card or "Choose an account" (ApproverSelectors.ChooseAccountButton, opens the account selector sheet), and "This app would like to" "Request approval for transactions" and "View your wallet balance & activity" (ApproverSelectors.ConnectPermissions). "Approve" is disabled until an account is selected; it returns [{ address, publicKey, derivationPath }] for the account's Stacks signer and dispatches userConnectsApp, which marks the origin "connected" with that accountId. Approve then also calls closeApprover, which posts a 4001 "User rejected request" for the same request id after the success response. ${sheetNote} ${resultNote}`,
  },
  {
    id: 'rpc-stx-sign-transaction',
    anchor: { kind: 'selectors', objects: ['RpcStacksSelectors.TxFeeSection'] },
    routes: [],
    startRoute: AppRoutes.Browser,
    params: [],
    entry: [
      {
        kind: 'rpc',
        method: 'stx_signTransaction',
        steps: [
          openBrowserStep,
          connectedStep,
          "The dApp calls LeatherProvider.request('stx_signTransaction', { transaction, network? }) with a serialized unsigned transaction, or the legacy { txHex, stxAddress?, attachment?, accountIndex?, network? }",
          routingStep,
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: RpcStacksSelectors.TxFeeSection,
      others: [
        RpcStacksSelectors.TxTransferOutcome,
        RpcStacksSelectors.TxMemoSection,
        RpcStacksSelectors.TxPostConditions,
        RpcStacksSelectors.TxContractDeploySummary,
        ...contractCallOthers,
        ...stxTxOthers,
      ],
    },
    actions: [],
    specs: [],
    description: `${txLayoutNote} A token transfer shows "You’ll send" with amount plus fee (RpcStacksSelectors.TxTransferOutcome), "To address" and a disabled memo card (RpcStacksSelectors.TxMemoSection); a contract deploy shows the contract name (RpcStacksSelectors.TxContractDeploySummary). ${contractCallNote} "Approve" signs with the connected account and returns { txHex, transaction } without broadcasting; fee and nonce edits rewrite the transaction before signing. ${connectedNote} ${resultNote}`,
  },
  {
    id: 'rpc-stx-transfer-stx',
    anchor: { kind: 'selectors', objects: ['RpcStacksSelectors.TxTransferOutcome'] },
    routes: [],
    startRoute: AppRoutes.Browser,
    params: [],
    entry: [
      {
        kind: 'rpc',
        method: 'stx_transferStx',
        steps: [
          openBrowserStep,
          connectedStep,
          "The dApp calls LeatherProvider.request('stx_transferStx', { recipient, amount, memo?, network?, sponsored? }) with amount in µSTX",
          routingStep,
          nonceStep,
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: RpcStacksSelectors.TxTransferOutcome,
      others: [RpcStacksSelectors.TxMemoSection, ...stxTxOthers],
    },
    actions: [],
    specs: [],
    description: `${txLayoutNote} It builds an STX token transfer for the connected account and shows "You’ll send" with amount plus fee (RpcStacksSelectors.TxTransferOutcome), "To address" and a disabled memo card (RpcStacksSelectors.TxMemoSection). ${fixedFeeNote} ${broadcastNote} ${connectedNote} ${resultNote}`,
  },
  {
    id: 'rpc-stx-transfer-sip9-nft',
    anchor: { kind: 'selectors', objects: ['RpcStacksSelectors.TxPostConditions'] },
    routes: [],
    startRoute: AppRoutes.Browser,
    params: [],
    entry: [
      {
        kind: 'rpc',
        method: 'stx_transferSip9Nft',
        steps: [
          openBrowserStep,
          connectedStep,
          "The dApp calls LeatherProvider.request('stx_transferSip9Nft', { recipient, asset, assetId, network?, sponsored? }) with asset as <contract address>.<contract name>::<asset name> and assetId as a hex Clarity value",
          routingStep,
          nonceStep,
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: RpcStacksSelectors.TxPostConditions,
      others: [...contractCallOthers, ...stxTxOthers],
    },
    actions: [],
    specs: [],
    description: `${txLayoutNote} It builds a "transfer" contract call on the NFT contract with a post condition that the account will send that NFT, so the approver lists that post condition (RpcStacksSelectors.TxPostConditions) and the function and contract id (RpcStacksSelectors.TxContractCallSummary). ${fixedFeeNote} ${broadcastNote} ${connectedNote} ${resultNote}`,
  },
  {
    id: 'rpc-stx-transfer-sip10-ft',
    anchor: { kind: 'selectors', objects: ['RpcStacksSelectors.TxPostConditions'] },
    routes: [],
    startRoute: AppRoutes.Browser,
    params: [],
    entry: [
      {
        kind: 'rpc',
        method: 'stx_transferSip10Ft',
        steps: [
          openBrowserStep,
          connectedStep,
          "The dApp calls LeatherProvider.request('stx_transferSip10Ft', { recipient, asset, amount, network?, sponsored? })",
          routingStep,
          nonceStep,
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: RpcStacksSelectors.TxPostConditions,
      others: [...contractCallOthers, ...stxTxOthers],
    },
    actions: [],
    specs: [],
    description: `${txLayoutNote} It builds a SIP-10 transfer contract call (createTransferSip10TxHex) and shows its post conditions (RpcStacksSelectors.TxPostConditions), a "To address" outcome and the function and contract id (RpcStacksSelectors.TxContractCallSummary). ${fixedFeeNote} ${broadcastNote} ${connectedNote} ${resultNote}`,
  },
  {
    id: 'rpc-stx-sign-message',
    anchor: { kind: 'selectors', objects: ['RpcStacksSelectors.SignMessageMessage'] },
    routes: [],
    startRoute: AppRoutes.Browser,
    params: [],
    entry: [
      {
        kind: 'rpc',
        method: 'stx_signMessage',
        steps: [
          openBrowserStep,
          connectedStep,
          "The dApp calls LeatherProvider.request('stx_signMessage', { message, messageType?: 'utf8' }) or { messageType: 'structured', domain, message } with hex Clarity values",
          routingStep,
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: RpcStacksSelectors.SignMessageMessage,
      others: [
        RpcStacksSelectors.SignStructuredMessage,
        ApproverSelectors.ApproveButton,
        ApproverSelectors.CancelButton,
      ],
    },
    actions: [],
    specs: [],
    description: `Stacks message approver titled "Sign Message" with the connected account card. A utf8 message shows "Message" with the text (RpcStacksSelectors.SignMessageMessage); a structured one shows "Message" with the domain name, version and chain and the decoded Clarity value (RpcStacksSelectors.SignStructuredMessage), so ready is SignStructuredMessage for that variant. "Approve" signs with the connected account's Stacks signer and returns { signature, publicKey }. ${connectedNote} ${resultNote}`,
  },
  {
    id: 'rpc-stx-sign-structured-message',
    anchor: { kind: 'selectors', objects: ['RpcStacksSelectors.SignStructuredMessage'] },
    routes: [],
    startRoute: AppRoutes.Browser,
    params: [],
    entry: [
      {
        kind: 'rpc',
        method: 'stx_signStructuredMessage',
        steps: [
          openBrowserStep,
          connectedStep,
          "The dApp calls LeatherProvider.request('stx_signStructuredMessage', { domain, message }) with hex-serialized Clarity values",
          routingStep,
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: RpcStacksSelectors.SignStructuredMessage,
      others: [ApproverSelectors.ApproveButton, ApproverSelectors.CancelButton],
    },
    actions: [],
    specs: [],
    description: `Stacks structured message approver titled "Sign Message" with the connected account card and "Message" showing the domain name, version and chain and the decoded Clarity message (RpcStacksSelectors.SignStructuredMessage). "Approve" signs the structured message with the connected account's Stacks signer and returns { signature, publicKey }. ${connectedNote} ${resultNote}`,
  },
  {
    id: 'rpc-stx-call-contract',
    anchor: { kind: 'selectors', objects: ['RpcStacksSelectors.TxContractCallSummary'] },
    routes: [],
    startRoute: AppRoutes.Browser,
    params: [],
    entry: [
      {
        kind: 'rpc',
        method: 'stx_callContract',
        steps: [
          openBrowserStep,
          connectedStep,
          "The dApp calls LeatherProvider.request('stx_callContract', { contract, functionName, functionArgs?, address?, network?, fee?, nonce?, postConditions?, postConditionMode?, sponsored? })",
          routingStep,
          nonceStep,
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: RpcStacksSelectors.TxContractCallSummary,
      others: [
        RpcStacksSelectors.TxPostConditions,
        ApproverSelectors.AllowModeProceedButton,
        ApproverSelectors.AllowModeDoNotProceedButton,
        ...stxTxOthers,
      ],
    },
    actions: [],
    specs: [getStxRequestParamsSpec],
    description: `${txLayoutNote} ${contractCallNote} The request fee is µSTX (0 when sponsored, the default fee when absent) and a request nonce overrides the loaded one (getStxRequestParams, utils.spec.ts). ${broadcastNote} The signing account is the one owning params.address (an unknown address throws) or else the connected account, so without address the origin must be "connected". ${resultNote}`,
  },
  {
    id: 'rpc-stx-deploy-contract',
    anchor: { kind: 'selectors', objects: ['RpcStacksSelectors.TxContractDeploySummary'] },
    routes: [],
    startRoute: AppRoutes.Browser,
    params: [],
    entry: [
      {
        kind: 'rpc',
        method: 'stx_deployContract',
        steps: [
          openBrowserStep,
          connectedStep,
          "The dApp calls LeatherProvider.request('stx_deployContract', { name, clarityCode, clarityVersion?, address?, network?, fee?, nonce?, postConditions?, postConditionMode?, sponsored? })",
          routingStep,
          nonceStep,
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: RpcStacksSelectors.TxContractDeploySummary,
      others: [...stxTxOthers],
    },
    actions: [],
    specs: [getStxRequestParamsSpec],
    description: `${txLayoutNote} A contract deploy shows the contract name (RpcStacksSelectors.TxContractDeploySummary) and the Clarity code under the advanced options. The request fee is µSTX (0 when sponsored, the default fee when absent) and a request nonce overrides the loaded one (getStxRequestParams, utils.spec.ts). ${broadcastNote} The signing account is the one owning params.address (an unknown address throws) or else the connected account, so without address the origin must be "connected". ${resultNote}`,
  },
] as const satisfies readonly MobileFeatureEntry[];
