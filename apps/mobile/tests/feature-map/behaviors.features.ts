import { AppRoutes } from '@/shared/app-routes';
import { AppUpdateSelectors } from '@/shared/selectors/app-update.selectors';
import { GlobalSheetSelectors } from '@/shared/selectors/global-sheet.selectors';
import { SettingsSelectors } from '@/shared/selectors/settings.selectors';
import { SharedSelectors } from '@/shared/selectors/shared.selectors';

import type { MobileFeatureEntry } from './mobile-feature-entry';

export const behaviorsFeatures = [
  {
    id: 'app-update-required',
    anchor: { kind: 'selectors', objects: ['AppUpdateSelectors'] },
    routes: [],
    startRoute: AppRoutes.Home,
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          'Set the minimum_app_version LaunchDarkly flag above the installed app version',
          'Launch the app; VersionGuard presents the sheet once the version check has loaded',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: ['minimum_app_version'],
    preconditions: { session: 'signed-out', mocks: [] },
    selectors: {
      ready: AppUpdateSelectors.Sheet,
      others: [AppUpdateSelectors.UpdateButton, AppUpdateSelectors.MaybeLaterButton],
    },
    actions: [],
    specs: [],
    description:
      'Global sheet (components/app-update-required/app-update-required-sheet.tsx) that VersionGuard presents when useVersionCheck finds the installed version below the minimum_app_version string flag; an empty flag, a missing or invalid installed version never presents it. It shows "Get the latest version of the Leather app" and "Update the app to get access to the latest features.". The update button reads "Update from App Store" or "Update from Google Play" and opens the store, showing an "Unable to Open Store" alert when that fails; "Maybe later" dismisses the sheet.',
  },
  {
    id: 'app-lock',
    anchor: { kind: 'behavior' },
    routes: [],
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          'Turn on app authentication in Settings > Security',
          'Tap "Lock app" in Settings (SettingsSelectors.LockAppButton), or background and foreground the app',
        ],
      },
    ],
    gate: 'none',
    flags: [],
    preconditions: { session: 'locked', mocks: [] },
    selectors: {
      others: [
        GlobalSheetSelectors.LockScreen,
        GlobalSheetSelectors.UnlockButton,
        SettingsSelectors.LockAppButton,
      ],
    },
    actions: ['apps/mobile/maestro/shared/unlock.yaml'],
    specs: ['apps/mobile/maestro/shared/unlock.yaml'],
    description:
      'SplashScreenGuard (components/splash-screen-guard/splash-screen-guard.tsx) covers every screen with the lock overlay (GlobalSheetSelectors.LockScreen) until the user is authenticated. With the security level preference set to secure it asks for device authentication on open, on foreground and after "Lock app"; otherwise it plays the splash and bypasses security. When authentication fails it shows an "Unlock" button (GlobalSheetSelectors.UnlockButton) that retries.',
  },
  {
    id: 'toast',
    anchor: { kind: 'behavior' },
    routes: [],
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: [
          'Trigger any action that calls displayToast, for example tapping the device ID copy control in Settings, which shows "ID copied to clipboard"',
        ],
      },
    ],
    gate: 'none',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: { others: [SharedSelectors.ToastContainer] },
    actions: [],
    specs: [],
    description:
      'ToastWrapper (components/toast/toast-context.tsx) renders a single Toast above every screen. Each display call replaces the current toast, slides it in from the top and closes it after a fixed delay; swiping it up dismisses it early. Nothing renders until the first toast is shown.',
  },
] as const satisfies readonly MobileFeatureEntry[];
