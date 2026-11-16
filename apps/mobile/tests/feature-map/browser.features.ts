import { AppRoutes } from '@/shared/app-routes';
import { BrowserSelectors } from '@/shared/selectors/browser.selectors';
import { SharedSelectors } from '@/shared/selectors/shared.selectors';

import type { MobileFeatureEntry } from './mobile-feature-entry';

const messageRoutingSpec = 'apps/mobile/src/features/browser/browser/message-routing.spec.ts';
const openDappStep =
  'Open a dApp in the in-app Browser tab (type its URL in BrowserSelectors.SearchInput, or open leather://browser?url=<url>)';
const originNote =
  'resolveBrowserRpcRequest (message-routing.ts) drops the message without answering when the posting frame is not an http(s) frame on the top-frame origin, when the payload is not JSON or not a valid RPC request.';

export const browserFeatures = [
  {
    id: 'browser',
    anchor: { kind: 'route' },
    routes: [AppRoutes.Browser],
    params: [{ name: 'url', example: 'https://app.leather.io' }],
    entry: [
      { kind: 'nav', steps: ['Tap "Browser" in the tab bar (BrowserSelectors.Tab)'] },
      {
        kind: 'deepLink',
        steps: ['Open leather://browser, or leather://browser?url=<url> to load that URL'],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: BrowserSelectors.SearchInput,
      others: [
        BrowserSelectors.WebView,
        BrowserSelectors.ExploreButton,
        BrowserSelectors.ConnectionsButton,
        BrowserSelectors.RecentsButton,
        SharedSelectors.ToastContainer,
      ],
    },
    actions: [],
    specs: [messageRoutingSpec],
    description:
      'The in-app browser: a WebView with the injected Leather provider that starts on the Leather apps URL (or the url query param), a navigation bar with a back button and the current URL (tapping it focuses the search input), and a "Type URL or search" input. Submitting an invalid URL shows a "Wrong URL" error toast. The toolbar has "Explore" (loads the Leather apps URL), "Connections" (navigates to /app-connections) and "Recents" (navigates to /app-recently-viewed). Each page load is saved as a recently visited app with a screenshot, and dApp requests other than getInfo and supportedMethods present the approver sheet.',
  },
  {
    id: 'app-connections',
    anchor: { kind: 'route' },
    routes: [AppRoutes.AppConnections],
    params: [],
    entry: [
      {
        kind: 'nav',
        steps: ['In the Browser tab tap "Connections" (BrowserSelectors.ConnectionsButton)'],
      },
      { kind: 'deepLink', steps: ['Open leather://app-connections'] },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: BrowserSelectors.ConnectionsScreen,
      others: [
        BrowserSelectors.ConnectionCard,
        BrowserSelectors.ConnectionDisconnectButton,
        SharedSelectors.ToastContainer,
      ],
    },
    actions: [],
    specs: [],
    description:
      'The "Connections" screen lists the connected apps with their icon, name and origin. Tapping an app opens its origin in the Browser tab; the close button removes the connection and shows a "Disconnected" toast. With no connected apps it shows "You will find the apps you are connected to here".',
  },
  {
    id: 'app-recently-viewed',
    anchor: { kind: 'route' },
    routes: [AppRoutes.AppRecentlyViewed],
    params: [],
    entry: [
      { kind: 'nav', steps: ['In the Browser tab tap "Recents" (BrowserSelectors.RecentsButton)'] },
      { kind: 'deepLink', steps: ['Open leather://app-recently-viewed'] },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: {
      ready: BrowserSelectors.RecentlyViewedScreen,
      others: [BrowserSelectors.RecentlyViewedCard, BrowserSelectors.RecentlyViewedRemoveButton],
    },
    actions: [],
    specs: [],
    description:
      'The "Recently viewed" screen shows a card per recently visited app with its icon, name and page screenshot. Tapping a card opens the app in the Browser tab; its close button removes it from the list. With no visited apps it shows "You will find the apps you recently viewed here".',
  },
  {
    id: 'rpc-get-info',
    anchor: { kind: 'rpc', handlers: ['getInfo'] },
    routes: [],
    startRoute: AppRoutes.Browser,
    params: [],
    entry: [
      {
        kind: 'rpc',
        method: 'getInfo',
        steps: [
          openDappStep,
          "The dApp calls LeatherProvider.request('getInfo')",
          'The wallet answers immediately without an approver sheet',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: { others: [] },
    actions: [],
    specs: [messageRoutingSpec],
    description: `Browser.onMessageHandler answers getInfo with createGetInfoResponse: platform "mobile", version "<nativeApplicationVersion>/<nativeBuildVersion>" and the supported method names, and dismisses the approver sheet. ${originNote} The unit spec covers the routing, including dropping getInfo from a cross-origin subframe.`,
  },
  {
    id: 'rpc-supported-methods',
    anchor: { kind: 'rpc', handlers: ['supportedMethods'] },
    routes: [],
    startRoute: AppRoutes.Browser,
    params: [],
    entry: [
      {
        kind: 'rpc',
        method: 'supportedMethods',
        steps: [
          openDappStep,
          "The dApp calls LeatherProvider.request('supportedMethods')",
          'The wallet answers immediately without an approver sheet',
        ],
      },
    ],
    gate: 'splashScreen',
    flags: [],
    preconditions: { session: 'signed-in', accountType: 'software', mocks: [] },
    selectors: { others: [] },
    actions: [],
    specs: [messageRoutingSpec],
    description: `Browser.onMessageHandler answers supportedMethods with createSupportedMethodsResponse: the Leather developer docs URL as documentation and the list of supported method links, and dismisses the approver sheet. ${originNote} The unit spec covers auto-answering it for the main frame.`,
  },
] as const satisfies readonly MobileFeatureEntry[];
