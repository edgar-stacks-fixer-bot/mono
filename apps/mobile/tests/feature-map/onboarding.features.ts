import { AppRoutes } from '@/shared/app-routes';
import { HomeSelectors } from '@/shared/selectors/home.selectors';
import { OnboardingSelectors } from '@/shared/selectors/onboarding.selectors';

import type { MobileFeatureEntry } from './mobile-feature-entry';

const tempMnemonicStoreSpec = 'apps/mobile/src/store/secure-store/temp-mnemonic-store.spec.ts';

export const onboardingFeatures = [
  {
    id: 'onboarding-create-wallet-card',
    anchor: { kind: 'selectors', objects: ['HomeSelectors.CreateWalletCard'] },
    routes: [],
    startRoute: AppRoutes.Home,
    params: [],
    entry: [{ kind: 'nav', steps: ['Launch the app with no wallet; Home shows the empty state'] }],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-out', mocks: [] },
    selectors: { ready: HomeSelectors.CreateWalletCard, others: [] },
    actions: [],
    specs: ['apps/mobile/maestro/flows/smoke-tests-ci.yaml'],
    description:
      'Home without a wallet (HomeScreenWithoutAccount) shows the Leather logomark, the network badge, the header actions and a single "Add account" card. Tapping the card presents the global add-wallet sheet. The CI smoke flow waits for "Add account" before continuing.',
  },
  {
    id: 'onboarding-add-wallet-sheet',
    anchor: { kind: 'selectors', objects: ['OnboardingSelectors.CreateNewWalletSheetButton'] },
    routes: [],
    startRoute: AppRoutes.Home,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          'Signed out: on Home tap the "Add account" card (HomeSelectors.CreateWalletCard)',
          'Signed in: open the add-wallet sheet from Settings > Wallets and accounts or from the add-account sheet',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-out', mocks: [] },
    selectors: {
      ready: OnboardingSelectors.CreateNewWalletSheetButton,
      others: [
        OnboardingSelectors.RestoreWalletSheetButton,
        OnboardingSelectors.AddWalletMoreOptionsButton,
      ],
    },
    actions: [],
    specs: [],
    description:
      'The global "Add wallet" sheet, mounted in the root layout. "Create new wallet" ("Generate new Secret Key for self-custody") navigates to /create-new-wallet and "Restore wallet" ("Import existing accounts from self-custody") navigates to /recover-wallet, each closing the sheet. A "More options" cell only renders with the release_waitlist_features flag on and only toggles local state.',
  },
  {
    id: 'onboarding-create-new-wallet',
    anchor: { kind: 'route' },
    routes: [AppRoutes.CreateNewWallet],
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          'Open the add-wallet sheet and tap "Create new wallet" (OnboardingSelectors.CreateNewWalletSheetButton)',
        ],
      },
      { kind: 'deepLink', steps: ['Open leather://create-new-wallet'] },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-out', mocks: [] },
    selectors: {
      ready: OnboardingSelectors.WalletCreationBackedUpButton,
      others: [OnboardingSelectors.WalletCreationTapToReveal],
    },
    actions: [],
    specs: [tempMnemonicStoreSpec],
    description:
      '"Back up your Secret Key" generates a new mnemonic on mount and stores it in the temporary mnemonic store. The words are covered until the user taps "Tap to view Secret Key" ("For your eyes only"). "I\'ve backed it up" is disabled while hidden; it then goes to /secure-your-wallet when no security level is chosen yet, otherwise creates the wallet directly via /generating-wallet.',
  },
  {
    id: 'onboarding-recover-wallet',
    anchor: { kind: 'route' },
    routes: [AppRoutes.RecoverWallet],
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          'Open the add-wallet sheet and tap "Restore wallet" (OnboardingSelectors.RestoreWalletSheetButton)',
        ],
      },
      { kind: 'deepLink', steps: ['Open leather://recover-wallet'] },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-out', mocks: [] },
    selectors: {
      ready: OnboardingSelectors.RestoreWalletTextInput,
      others: [
        OnboardingSelectors.RestoreWalletPasteButton,
        OnboardingSelectors.RestoreWalletAdvancedOptions,
        OnboardingSelectors.RestoreWalletPassphraseCell,
        OnboardingSelectors.RestoreWalletContinue,
      ],
    },
    actions: [],
    specs: [tempMnemonicStoreSpec],
    description:
      '"Enter your Secret Key" with a multiline input ("Paste or type Secret Key to add wallet") and a "Paste" button that fills it from the clipboard and hides once text is entered. On blur, unknown words show "Invalid words: ..."; "Continue" stays disabled until the mnemonic is valid, then stores it and the passphrase temporarily and continues like create-new-wallet. "Advanced options" expands a "BIP39 passphrase" cell (Enabled/Disabled) that opens the passphrase sheet.',
  },
  {
    id: 'onboarding-bip39-passphrase-sheet',
    anchor: { kind: 'selectors', objects: ['OnboardingSelectors.RestoreWalletPassphraseInput'] },
    routes: [],
    startRoute: AppRoutes.RecoverWallet,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          'On /recover-wallet tap "Advanced options" (OnboardingSelectors.RestoreWalletAdvancedOptions)',
          'Tap the "BIP39 passphrase" cell (OnboardingSelectors.RestoreWalletPassphraseCell)',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-out', mocks: [] },
    selectors: {
      ready: OnboardingSelectors.RestoreWalletPassphraseInput,
      others: [OnboardingSelectors.RestoreWalletPassphraseConfirmButton],
    },
    actions: [],
    specs: [],
    description:
      'The "BIP39 passphrase" input sheet (RecoverWalletSheet) with a "Passphrase" field prefilled with the current value. "Confirm" closes the sheet and sets the passphrase used when restoring, which flips the cell on the recover screen to "Enabled".',
  },
  {
    id: 'onboarding-secure-your-wallet',
    anchor: { kind: 'route' },
    routes: [AppRoutes.SecureYourWallet],
    deepLinkable: false,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          'With no security level chosen yet, tap "I\'ve backed it up" on /create-new-wallet or "Continue" on /recover-wallet',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-out', mocks: [] },
    selectors: {
      ready: OnboardingSelectors.SecureWalletEnableSecurityButton,
      others: [OnboardingSelectors.SecureWalletSkipButton],
    },
    actions: [],
    specs: [],
    description:
      '"Secure your wallet" asks to "Use your device PIN, Face ID or other biometrics to secure your wallets". "Enable device security" creates the wallet with biometrics if the device is enrolled; "Skip for now" opens the skip-security warning sheet. It reads the mnemonic the previous screen put in the temporary store, so it is not deep-linkable.',
  },
  {
    id: 'onboarding-skip-secure-wallet-sheet',
    anchor: {
      kind: 'selectors',
      objects: ['OnboardingSelectors.SkipSecureWalletContinueButton'],
    },
    routes: [],
    startRoute: AppRoutes.SecureYourWallet,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          'On /secure-your-wallet tap "Skip for now" (OnboardingSelectors.SecureWalletSkipButton)',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-out', mocks: [] },
    selectors: { ready: OnboardingSelectors.SkipSecureWalletContinueButton, others: [] },
    actions: [],
    specs: [],
    description:
      'Critical warning sheet "Continue without security": "Proceed with caution since your wallet will not be protected by your device’s native security mechanism." "Continue" closes the sheet and creates the wallet without biometrics; "Cancel" dismisses it.',
  },
  {
    id: 'onboarding-generating-wallet',
    anchor: { kind: 'route' },
    routes: [AppRoutes.GeneratingWallet],
    deepLinkable: false,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          'Finish create or restore: "Enable device security" or the skip sheet "Continue" on /secure-your-wallet, or "I\'ve backed it up" / "Continue" once a security level is set',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-out', mocks: [] },
    selectors: { ready: OnboardingSelectors.GeneratingWalletScreen, others: [] },
    actions: [],
    specs: [],
    description:
      'Transient "Adding wallet..." screen with the wallet generation animation, shown while the wallet is restored from the temporary mnemonic. On success it shows the "Wallet added" toast and replaces the stack with Home; on failure it shows "Wallet added already" or "An error occurred" and goes back.',
  },
] as const satisfies readonly MobileFeatureEntry[];
