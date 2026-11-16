import { AppRoutes } from '@/shared/app-routes';
import { AccountSelectors } from '@/shared/selectors/account.selectors';
import { SettingsSelectors } from '@/shared/selectors/settings.selectors';
import { SharedSelectors } from '@/shared/selectors/shared.selectors';
import { WalletSettingsSelectors } from '@/shared/selectors/wallet-settings.selectors';

import type { MobileFeatureEntry } from './mobile-feature-entry';

const openWalletsStep =
  'On Settings tap "Wallets and accounts" (SettingsSelectors.WalletAndAccountsButton)';
const openConfigureWalletStep =
  'Tap the wallet settings gear "Open wallet settings" (WalletSettingsSelectors.ListSettingsButton) next to the wallet name';
const openConfigureAccountStep = 'Tap an account card (WalletSettingsSelectors.ListAccountCard)';

export const walletSettingsFeatures = [
  {
    id: 'settings-wallets',
    anchor: { kind: 'route' },
    routes: [AppRoutes.SettingsWallet],
    params: [],
    entry: [
      { kind: 'nav', steps: [openWalletsStep] },
      { kind: 'deepLink', steps: ['Open leather://settings/wallet'] },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: WalletSettingsSelectors.ListScreen,
      others: [
        SettingsSelectors.WalletAndAccountsButton,
        WalletSettingsSelectors.ListSettingsButton,
        WalletSettingsSelectors.ListAccountCard,
        SharedSelectors.DefaultAccountIcon,
        WalletSettingsSelectors.AddAccountButton,
        WalletSettingsSelectors.HiddenAccountsButton,
        WalletSettingsSelectors.AddWalletButton,
        WalletSettingsSelectors.EmptyWalletsAddButton,
      ],
    },
    actions: [],
    specs: [],
    description:
      'The "Wallets" screen (src/app/settings/wallet/index.tsx). With wallets it shows the "Portfolio" header and total balance, then one collapsible card per wallet (wallet-card.tsx) with a settings gear that opens Configure wallet, the active account cards (avatar id defaultAccountIcon_<icon>, prefix SharedSelectors.DefaultAccountIcon) that open Configure account, and an "Add account" button that creates an account and toasts "Account created". Below, "Hidden accounts" (only when some exist, captioned "# hidden account(s)") opens the hidden accounts screen and "Add wallet" opens the global add wallet sheet. Without wallets it shows "View and manage all your wallets in one place" and an "Add wallet" button that opens the same sheet.',
  },
  {
    id: 'settings-hidden-accounts',
    anchor: { kind: 'route' },
    routes: [AppRoutes.SettingsWalletHiddenAccounts],
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          openWalletsStep,
          'Tap "Hidden accounts" (WalletSettingsSelectors.HiddenAccountsButton), shown only when an account is hidden',
        ],
      },
      { kind: 'deepLink', steps: ['Open leather://settings/wallet/hidden-accounts'] },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: WalletSettingsSelectors.HiddenAccountsScreen,
      others: [WalletSettingsSelectors.ListAccountCard],
    },
    actions: [],
    specs: [],
    description:
      'The "Hidden accounts" screen (src/app/settings/wallet/hidden-accounts.tsx) lists the hidden accounts grouped by wallet, without the settings gear or "Add account"; tapping an account card opens Configure account, where "Reveal account" unhides it. With no hidden accounts it shows "View and manage your hidden accounts".',
  },
  {
    id: 'settings-configure-wallet',
    anchor: { kind: 'route' },
    routes: [AppRoutes.SettingsWalletConfigure],
    deepLinkable: false,
    params: [{ name: 'wallet', example: '1a2b3c4d' }],
    entry: [{ kind: 'nav', steps: [openWalletsStep, openConfigureWalletStep] }],
    gate: 'splashScreen',
    flags: ['release_waitlist_features'],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: WalletSettingsSelectors.ConfigureScreen,
      others: [
        WalletSettingsSelectors.ViewSecretKeyButton,
        WalletSettingsSelectors.RenameWalletButton,
        WalletSettingsSelectors.RemoveWalletButton,
        WalletSettingsSelectors.AdvancedOptionsButton,
      ],
    },
    actions: [],
    specs: [],
    description:
      'The "Configure wallet" screen (src/app/settings/wallet/configure/[wallet]/index.tsx) shows the wallet name and "Creation date". "View Secret Key" navigates to the secret key screen, "Rename wallet" opens the wallet name sheet and "Remove wallet" opens the remove wallet sheet. With release_waitlist_features on, an "Advanced options" accordion lists "Address reuse", "Address scan range", "Address types", "Export xPub" and "Export key", each opening a notify-me waitlist sheet. The screen parses a fingerprint search param that the wallet card passes next to the wallet path segment, so it cannot be deep-linked.',
  },
  {
    id: 'settings-view-secret-key',
    anchor: { kind: 'route' },
    routes: [AppRoutes.SettingsWalletViewSecretKey],
    deepLinkable: false,
    params: [{ name: 'wallet', example: '1a2b3c4d' }],
    entry: [
      {
        kind: 'nav',
        steps: [
          openWalletsStep,
          openConfigureWalletStep,
          'Tap "View Secret Key" (WalletSettingsSelectors.ViewSecretKeyButton)',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: WalletSettingsSelectors.ViewSecretKeyScreen,
      others: [WalletSettingsSelectors.ViewSecretKeyDoneButton],
    },
    actions: [],
    specs: [],
    description:
      'The "Your Secret Key" screen (src/app/settings/wallet/configure/[wallet]/view-secret-key.tsx) explains "Your Secret Key grants you access to your wallet and its assets. Store it securely since it can never be recovered if lost or stolen." and shows the wallet mnemonic (and passphrase) in MnemonicDisplay; "Done" goes back. It throws without the fingerprint search param Configure wallet passes, and renders an empty screen until the mnemonic loads.',
  },
  {
    id: 'settings-configure-account',
    anchor: { kind: 'route' },
    routes: [AppRoutes.SettingsAccountConfigure],
    deepLinkable: false,
    params: [
      { name: 'wallet', example: '1a2b3c4d' },
      { name: 'account', example: '0' },
    ],
    entry: [{ kind: 'nav', steps: [openWalletsStep, openConfigureAccountStep] }],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: AccountSelectors.ConfigureScreen,
      others: [
        SharedSelectors.DefaultAccountIcon,
        AccountSelectors.SettingsNameCell,
        AccountSelectors.SettingsAvatarCell,
        AccountSelectors.SettingsHideCell,
        AccountSelectors.SettingsRevealCell,
      ],
    },
    actions: [],
    specs: [],
    description:
      'The "Configure account" screen (src/app/settings/wallet/configure/[wallet]/[account]/index.tsx) shows the account card (avatar id defaultAccountIcon_<icon>, prefix SharedSelectors.DefaultAccountIcon) with address, balance and wallet name. "Name" opens the account name sheet, "Avatar" navigates to the avatar picker, and "Hide account" (active accounts) or "Reveal account" (hidden accounts) toggles visibility in place. It parses a fingerprint search param the wallet card passes, so it cannot be deep-linked.',
  },
  {
    id: 'settings-choose-avatar',
    anchor: { kind: 'route' },
    routes: [AppRoutes.SettingsAccountChooseAvatar],
    params: [
      { name: 'wallet', example: '1a2b3c4d' },
      { name: 'account', example: '0' },
    ],
    entry: [
      {
        kind: 'nav',
        steps: [
          openWalletsStep,
          openConfigureAccountStep,
          'Tap "Avatar" (AccountSelectors.SettingsAvatarCell)',
        ],
      },
      {
        kind: 'deepLink',
        steps: [
          'Open leather://settings/wallet/configure/<fingerprint>/<accountIndex>/choose-avatar',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: AccountSelectors.ChooseAvatarScreen,
      others: [SharedSelectors.DefaultAccountIcon, AccountSelectors.ChooseAvatarSaveButton],
    },
    actions: [],
    specs: [],
    description:
      'The avatar picker (src/app/settings/wallet/configure/[wallet]/[account]/choose-avatar.tsx), titled with the account name, shows a large preview and an "Icons" grid of avatar buttons with the dynamic id defaultAccountIcon_<icon> (prefix SharedSelectors.DefaultAccountIcon). Tapping one updates the preview; "Save" is disabled until a new icon is picked, then stores it and goes back. It throws when the wallet or account path params are missing or the account does not exist.',
  },
  {
    id: 'settings-wallet-name-sheet',
    anchor: {
      kind: 'selectors',
      objects: [
        'WalletSettingsSelectors.ChangeNameSheetInput',
        'WalletSettingsSelectors.ChangeNameSheetSaveButton',
      ],
    },
    routes: [],
    startRoute: AppRoutes.SettingsWalletConfigure,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          openWalletsStep,
          openConfigureWalletStep,
          'Tap "Rename wallet" (WalletSettingsSelectors.RenameWalletButton)',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: WalletSettingsSelectors.ChangeNameSheetInput,
      others: [WalletSettingsSelectors.ChangeNameSheetSaveButton],
    },
    actions: [],
    specs: [],
    description:
      'The "Change name" sheet (features/settings/wallet-and-accounts/wallet-name-sheet.tsx) prefills the wallet name in a "Name" input; "Save" renames the wallet and closes the sheet, or toasts "Wallet name cannot be empty" for an empty name and stays open.',
  },
  {
    id: 'settings-remove-wallet-sheet',
    anchor: {
      kind: 'selectors',
      objects: ['WalletSettingsSelectors.RemoveWalletSheetContinueButton'],
    },
    routes: [],
    startRoute: AppRoutes.SettingsWalletConfigure,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          openWalletsStep,
          openConfigureWalletStep,
          'Tap "Remove wallet" (WalletSettingsSelectors.RemoveWalletButton)',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: { ready: WalletSettingsSelectors.RemoveWalletSheetContinueButton, others: [] },
    actions: [],
    specs: [],
    description:
      'The critical "Remove wallet" warning sheet (features/settings/wallet-and-accounts/remove-wallet-sheet.tsx) warns "Proceed with caution since the wallet will be removed entirely from this device and its assets will not be recoverable unless you’ve stored its Secret Key elsewhere securely." "Continue" asks for device authentication when app authentication is on (toasting "Authentication failed" on failure), then goes back, switches the current account to another wallet if needed and removes the wallet; "Cancel" dismisses. The question icon opens the remove wallet guide.',
  },
  {
    id: 'settings-account-name-sheet',
    anchor: {
      kind: 'selectors',
      objects: [
        'AccountSelectors.ChangeNameSheetInput',
        'AccountSelectors.ChangeNameSheetSaveButton',
      ],
    },
    routes: [],
    startRoute: AppRoutes.SettingsAccountConfigure,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          openWalletsStep,
          openConfigureAccountStep,
          'Tap "Name" (AccountSelectors.SettingsNameCell)',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: AccountSelectors.ChangeNameSheetInput,
      others: [AccountSelectors.ChangeNameSheetSaveButton],
    },
    actions: [],
    specs: [],
    description:
      'The "Account label" sheet (features/settings/wallet-and-accounts/account-name-sheet.tsx) prefills the account name in a "Name" input; "Save" renames the account and closes the sheet, or toasts "Account name cannot be empty" for an empty name and stays open.',
  },
] as const satisfies readonly MobileFeatureEntry[];
