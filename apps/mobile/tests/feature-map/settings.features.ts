import { AppRoutes } from '@/shared/app-routes';
import { HomeSelectors } from '@/shared/selectors/home.selectors';
import { SettingsSelectors } from '@/shared/selectors/settings.selectors';
import { SharedSelectors } from '@/shared/selectors/shared.selectors';

import type { MobileFeatureEntry } from './mobile-feature-entry';

const smokeSpecs = [
  'apps/mobile/maestro/flows/smoke-tests.yaml',
  'apps/mobile/maestro/flows/smoke-tests-ci.yaml',
] as const;
const openDisplayStep =
  'On Settings tap "Display" (SettingsSelectors.DisplayButton) to open the Display screen';
const openSecurityStep =
  'On Settings tap "Security" (SettingsSelectors.SecurityButton) to open the Security screen';

export const settingsFeatures = [
  {
    id: 'settings',
    anchor: { kind: 'route' },
    routes: [AppRoutes.Settings],
    params: [],
    entry: [
      { kind: 'nav', steps: ['On Home tap the settings button (HomeSelectors.SettingsButton)'] },
      { kind: 'deepLink', steps: ['Open leather://settings'] },
    ],
    gate: 'splashScreen',
    flags: ['release_waitlist_features'],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: SettingsSelectors.Screen,
      others: [
        HomeSelectors.SettingsButton,
        SettingsSelectors.WalletAndAccountsButton,
        SettingsSelectors.DisplayButton,
        SettingsSelectors.SecurityButton,
        SettingsSelectors.NetworkButton,
        SettingsSelectors.AppIconButton,
        SettingsSelectors.HelpButton,
        SettingsSelectors.MoreOptionsButton,
        SettingsSelectors.ContactsButton,
        SettingsSelectors.FeesButton,
        SettingsSelectors.DeviceIdCopyButton,
        SettingsSelectors.LockAppButton,
        SharedSelectors.BackButton,
      ],
    },
    actions: [],
    specs: [...smokeSpecs],
    description:
      'The settings root (src/app/settings/index.tsx) lists "Wallets and accounts", "Display", "Security", "Networks" and "Help", which navigate to their screens, and "App Icon", which opens the app icon picker sheet. With release_waitlist_features on, a "More options" accordion reveals "Contacts" and "Fees", each opening a notify-me waitlist sheet ("Contacts", "Custom fees"). Below it shows the "Version", the "Device ID" (tapping it copies the id and toasts "ID copied to clipboard") and a "Lock app" button that locks the app. The smoke Maestro flows tap homeSettingsButton and assert the "SETTINGS" text.',
  },
  {
    id: 'settings-display',
    anchor: { kind: 'route' },
    routes: [AppRoutes.SettingsDisplay],
    params: [],
    entry: [
      { kind: 'nav', steps: [openDisplayStep] },
      { kind: 'deepLink', steps: ['Open leather://settings/display'] },
    ],
    gate: 'splashScreen',
    flags: ['release_btc_conversion_unit_feature', 'internationalization'],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: SettingsSelectors.DisplayScreen,
      others: [
        SettingsSelectors.DisplayThemeButton,
        SettingsSelectors.DisplayBitcoinUnitButton,
        SettingsSelectors.DisplayLanguageButton,
        SettingsSelectors.DisplayConversionUnitButton,
        SettingsSelectors.DisplayAccountIdentifierButton,
        SettingsSelectors.DisplayHapticsSwitch,
      ],
    },
    actions: [],
    specs: [],
    description:
      'The Display settings screen (src/app/settings/display/index.tsx). "Theme", "Conversion unit" and "Account identifier" open their sheets, each row captioned with the current preference; "Bitcoin unit" only renders with release_btc_conversion_unit_feature on, and "Language" only with internationalization on and more than one supported language (only English today, so it never shows). The "Haptics" switch ("Toggle tactile feedback for interactions") toggles the haptics preference in place.',
  },
  {
    id: 'settings-help',
    anchor: { kind: 'route' },
    routes: [AppRoutes.SettingsHelp],
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: ['On Settings tap "Help" (SettingsSelectors.HelpButton)'],
      },
      { kind: 'deepLink', steps: ['Open leather://settings/help'] },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: SettingsSelectors.HelpScreen,
      others: [
        SettingsSelectors.HelpContactUsButton,
        SettingsSelectors.HelpGuidesButton,
        SettingsSelectors.HelpLearnButton,
      ],
    },
    actions: [],
    specs: [],
    description:
      'The Help settings screen (src/app/settings/help/index.tsx) has three rows that open external pages through useOpenUrl: "Contact us" ("Get support or provide feedback") opens LEATHER_SUPPORT_URL, "Guides" ("Dive into feature details") opens LEATHER_GUIDES_URL and "Learn" ("Expand your Bitcoin knowledge") opens LEATHER_LEARN_URL.',
  },
  {
    id: 'settings-networks',
    anchor: { kind: 'route' },
    routes: [AppRoutes.SettingsNetworks],
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: ['On Settings tap "Networks" (SettingsSelectors.NetworkButton)'],
      },
      {
        kind: 'nav',
        steps: [
          'On a non-mainnet network tap the network badge (SharedSelectors.NetworkBadge) shown next to the balance',
        ],
      },
      { kind: 'deepLink', steps: ['Open leather://settings/networks'] },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: SettingsSelectors.NetworksScreen,
      others: [SettingsSelectors.NetworkOption, SharedSelectors.NetworkBadge],
    },
    actions: [],
    specs: ['apps/mobile/src/store/settings/settings.read.spec.ts'],
    description:
      'The Networks settings screen (src/app/settings/networks/index.tsx) lists the radio rows Mainnet, Testnet4 and Signet, each captioned "Enabled" or "Disabled"; tapping one changes the network preference and toasts "Changed network". Rows use the dynamic id settingsNetworkOption-<network> (prefix SettingsSelectors.NetworkOption). Off mainnet, the NetworkBadge (features/settings/network-badge.tsx) shows the network name and navigates here. settings.read.spec.ts covers getStacksNetworkFromNetworkConfig, which maps the chosen network to a Stacks network.',
  },
  {
    id: 'settings-security',
    anchor: { kind: 'route' },
    routes: [AppRoutes.SettingsSecurity],
    params: [],
    entry: [
      { kind: 'nav', steps: [openSecurityStep] },
      { kind: 'deepLink', steps: ['Open leather://settings/security'] },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: SettingsSelectors.SecurityScreen,
      others: [
        SettingsSelectors.SecurityAnalyticsButton,
        SettingsSelectors.SecurityAppAuthenticationButton,
      ],
    },
    actions: [],
    specs: [],
    description:
      'The Security settings screen (src/app/settings/security/index.tsx) has two rows: "Analytics", captioned "Enabled" when consent was given, opens the analytics sheet; "App authentication", captioned "Enabled" only for the secure security level ("Disabled" when insecure or not selected), opens the app authentication sheet.',
  },
  {
    id: 'settings-theme-sheet',
    anchor: { kind: 'selectors', objects: ['SettingsSelectors.ThemeSheet'] },
    routes: [],
    startRoute: AppRoutes.SettingsDisplay,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [openDisplayStep, 'Tap "Theme" (SettingsSelectors.DisplayThemeButton)'],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: { ready: SettingsSelectors.ThemeSheet, others: [] },
    actions: [],
    specs: [],
    description:
      'The "Theme" sheet (features/settings/theme-sheet.tsx) lists the radio options "Light", "Dark" and "System"; tapping one changes the theme preference and toasts "Theme updated".',
  },
  {
    id: 'settings-bitcoin-unit-sheet',
    anchor: { kind: 'selectors', objects: ['SettingsSelectors.BitcoinUnitSheet'] },
    routes: [],
    startRoute: AppRoutes.SettingsDisplay,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [openDisplayStep, 'Tap "Bitcoin unit" (SettingsSelectors.DisplayBitcoinUnitButton)'],
      },
    ],
    gate: 'splashScreen',
    flags: ['release_btc_conversion_unit_feature'],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: { ready: SettingsSelectors.BitcoinUnitSheet, others: [] },
    actions: [],
    specs: [],
    description:
      'The "Bitcoin unit" sheet (features/settings/bitcoin-unit-sheet.tsx), reachable only when release_btc_conversion_unit_feature shows its row on Display. It lists each bitcoin unit as a radio row titled by its symbol and captioned by its name; tapping one changes the unit preference and toasts "Bitcoin unit updated". The header question icon opens the bitcoin unit guide.',
  },
  {
    id: 'settings-conversion-unit-sheet',
    anchor: { kind: 'selectors', objects: ['SettingsSelectors.ConversionUnitSheet'] },
    routes: [],
    startRoute: AppRoutes.SettingsDisplay,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          openDisplayStep,
          'Tap "Conversion unit" (SettingsSelectors.DisplayConversionUnitButton)',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: { ready: SettingsSelectors.ConversionUnitSheet, others: [] },
    actions: [],
    specs: [],
    description:
      'The "Conversion unit" sheet (features/settings/conversion-unit-sheet.tsx) lists the quote currencies from currencyNameMap as radio rows (e.g. "United States Dollar", "Euro", "Bitcoin") captioned by their symbol; tapping one changes the fiat currency preference and toasts "Conversion unit updated".',
  },
  {
    id: 'settings-account-identifier-sheet',
    anchor: { kind: 'selectors', objects: ['SettingsSelectors.AccountIdentifierSheet'] },
    routes: [],
    startRoute: AppRoutes.SettingsDisplay,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          openDisplayStep,
          'Tap "Account identifier" (SettingsSelectors.DisplayAccountIdentifierButton)',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: { ready: SettingsSelectors.AccountIdentifierSheet, others: [] },
    actions: [],
    specs: [],
    description:
      'The "Account identifier" sheet (features/settings/account-identifier-sheet.tsx) lists the account display preferences ("Native Segwit address", "Taproot address", "BNS name", "Stacks address") as radio rows captioned with their chain; tapping one changes how accounts are labelled and toasts "Account identifier updated". The header question icon opens the account identifier guide.',
  },
  {
    id: 'settings-language-sheet',
    anchor: { kind: 'selectors', objects: ['SettingsSelectors.LanguageSheet'] },
    routes: [],
    startRoute: AppRoutes.SettingsDisplay,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [openDisplayStep, 'Tap "Language" (SettingsSelectors.DisplayLanguageButton)'],
      },
    ],
    gate: 'splashScreen',
    flags: ['internationalization'],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: { ready: SettingsSelectors.LanguageSheet, others: [] },
    actions: [],
    specs: [],
    description:
      'The "Language" sheet (features/settings/language-sheet.tsx) lists supportedLanguages as radio rows. Choosing a different language stores it as a user selection, shows a full-screen globe splash and reloads the app after one second. Its Display row only renders with internationalization on and more than one supported language; only English is supported today, so the sheet is unreachable.',
  },
  {
    id: 'settings-app-icon-sheet',
    anchor: { kind: 'selectors', objects: ['SettingsSelectors.AppIconSheet'] },
    routes: [],
    startRoute: AppRoutes.Settings,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: ['On Settings tap "App Icon" (SettingsSelectors.AppIconButton)'],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: SettingsSelectors.AppIconSheet,
      others: [SettingsSelectors.AppIconOption],
    },
    actions: [],
    specs: [],
    description:
      'The "App Icon" sheet (features/settings/choose-app-icon/app-icon-picker-sheet.tsx) shows a four-column grid of app icons, each with the dynamic id app-icon-<icon> (prefix SettingsSelectors.AppIconOption, e.g. app-icon-default). Tapping a different icon stores the preference and calls setAlternateAppIcon; on failure it restores the previous icon and toasts "Failed to change app icon". Opening, dismissing and selecting are tracked in analytics.',
  },
  {
    id: 'settings-analytics-sheet',
    anchor: { kind: 'selectors', objects: ['SettingsSelectors.AnalyticsSheet'] },
    routes: [],
    startRoute: AppRoutes.SettingsSecurity,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [openSecurityStep, 'Tap "Analytics" (SettingsSelectors.SecurityAnalyticsButton)'],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: SettingsSelectors.AnalyticsSheet,
      others: [SettingsSelectors.AnalyticsSwitch],
    },
    actions: [],
    specs: [],
    description:
      'The "Analytics" sheet (features/settings/analytics-sheet.tsx) has one switch, "Allow collection of data" ("Share anonymous usage details"), which toggles the analytics preference between consent given and rejected and toasts "Analytics updated". The header question icon opens the analytics guide.',
  },
  {
    id: 'settings-app-authentication-sheet',
    anchor: { kind: 'selectors', objects: ['SettingsSelectors.AppAuthenticationSheet'] },
    routes: [],
    startRoute: AppRoutes.SettingsSecurity,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          openSecurityStep,
          'Tap "App authentication" (SettingsSelectors.SecurityAppAuthenticationButton)',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: SettingsSelectors.AppAuthenticationSheet,
      others: [SettingsSelectors.AppAuthenticationSwitch],
    },
    actions: [],
    specs: [],
    description:
      'The "App authentication" sheet (features/settings/app-authentication-sheet.tsx) has one switch, "App authentication" ("Require biometrics or PIN"). Toggling it first asks for device authentication; on success it flips the security level between secure and insecure and toasts "App authorization updated", otherwise it toasts "Failed to authenticate".',
  },
  {
    id: 'description-sheet',
    anchor: { kind: 'selectors', objects: ['SettingsSelectors.DescriptionSheet'] },
    routes: [],
    startRoute: AppRoutes.SettingsWallet,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          'On Settings tap "Wallets and accounts" (SettingsSelectors.WalletAndAccountsButton)',
          'Tap the "Portfolio" label with the question icon above the total balance',
        ],
      },
      {
        kind: 'nav',
        steps: ['On Home tap the "Trending tokens" label with the info icon'],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: { ready: SettingsSelectors.DescriptionSheet, others: [] },
    actions: [],
    specs: [],
    description:
      'The global description sheet (features/settings/description-sheet.tsx), mounted once in src/app/_layout.tsx and opened through useGlobalSheets().descriptionSheetRef with a title and a list of paragraphs or titled bullets. Callers include the "Portfolio" header ("Your total tokens across all your accounts."), the account "Total balance" and available balance labels, and the home "Trending tokens" label ("Tokens trending across the Stacks ecosystem, ranked by recent trading activity.").',
  },
] as const satisfies readonly MobileFeatureEntry[];
