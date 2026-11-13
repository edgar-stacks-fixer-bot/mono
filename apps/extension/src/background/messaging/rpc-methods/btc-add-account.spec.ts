import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import type { ZodType } from 'zod';

import {
  instantiateBondDescriptor,
  makeNativeSegwitAccountXpub,
  makeNativeSegwitAddressPubkeyHex,
} from '@leather.io/bitcoin';
import { RpcErrorCode, maxBtcDescriptorLength } from '@leather.io/rpc';

import { createMockPort } from '../create-mock-port';
import { btcAddAccountHandler } from './btc-add-account';

type BtcAddAccountRequest = Parameters<(typeof btcAddAccountHandler)[1]>[0];

interface ValidateRequestParamsArgs {
  params: unknown;
  schema: ZodType;
}

const mocks = vi.hoisted(() => ({
  createConnectingAppMetadataSearchParams: vi.fn(),
  triggerRequestPopupWindowOpen: vi.fn(),
  sendErrorResponseOnUserPopupClose: vi.fn(),
  trackRpcRequestError: vi.fn(),
  trackRpcRequestSuccess: vi.fn(),
  sendMessage: vi.fn(),
}));

vi.mock('../define-rpc-request-handler', () => ({
  defineRpcRequestHandler: (method: string, handler: unknown) => [method, handler],
}));

vi.mock('../rpc-request-utils', () => ({
  getOriginatingFrameFromPort: (port: chrome.runtime.Port) => ({
    frameId: port.sender?.frameId ?? 0,
    tabId: port.sender?.tab?.id ?? 0,
  }),
  validateRequestParams: ({ params, schema }: ValidateRequestParamsArgs) => ({
    status: schema.safeParse(params).success ? 'success' : 'failure',
  }),
  createConnectingAppMetadataSearchParams: mocks.createConnectingAppMetadataSearchParams,
  triggerRequestPopupWindowOpen: mocks.triggerRequestPopupWindowOpen,
  sendErrorResponseOnUserPopupClose: mocks.sendErrorResponseOnUserPopupClose,
}));

vi.mock('../rpc-helpers', () => ({
  trackRpcRequestError: mocks.trackRpcRequestError,
  trackRpcRequestSuccess: mocks.trackRpcRequestSuccess,
}));

const frameId = 42;
const tabId = 7;
const requestingOrigin = 'https://app.example.com';

const xpubA = makeNativeSegwitAccountXpub(1);
const xpubB = makeNativeSegwitAccountXpub(2);
const counterpartyKey = makeNativeSegwitAddressPubkeyHex(9);
const hash = bytesToHex(sha256(new Uint8Array([1, 2, 3])));
const unlockHeight = 1000;

const multisigDescriptor = `wsh(sortedmulti(2,${xpubA}/0/0,${xpubB}/0/0))`;
const bondDescriptor = instantiateBondDescriptor({
  unlockHeight,
  hash,
  counterpartyKey,
  threshold: 2,
  keyExpressions: [`${xpubA}/0/0`, `${xpubB}/0/0`],
});

function makeBondDescriptor(vaultExpression: string) {
  return `wsh(and_v(v:or_i(after(${unlockHeight}),and_v(v:sha256(${hash}),pk(${counterpartyKey}))),${vaultExpression}))`;
}

function makeRequest(descriptor: string): BtcAddAccountRequest {
  return {
    jsonrpc: '2.0',
    id: 'req-1',
    method: 'btc_addAccount',
    params: { descriptor, name: 'Vault' },
  };
}

function invokeHandler(descriptor: string) {
  const [, handler] = btcAddAccountHandler;
  return handler(
    makeRequest(descriptor),
    createMockPort({ frameId, url: requestingOrigin, tab: { id: tabId } })
  );
}

function expectRejected() {
  expect(mocks.sendMessage).toHaveBeenCalledWith(
    tabId,
    expect.objectContaining({
      error: {
        code: RpcErrorCode.INVALID_PARAMS,
        message: 'Only multisig or timelocked wsh() descriptors are supported',
      },
    }),
    { frameId }
  );
  expect(mocks.triggerRequestPopupWindowOpen).not.toHaveBeenCalled();
}

function expectPopupOpened() {
  expect(mocks.sendMessage).not.toHaveBeenCalled();
  expect(mocks.triggerRequestPopupWindowOpen).toHaveBeenCalled();
  expect(mocks.sendErrorResponseOnUserPopupClose).toHaveBeenCalled();
}

describe('btcAddAccountHandler', () => {
  beforeEach(() => {
    vi.stubGlobal('chrome', { tabs: { sendMessage: mocks.sendMessage } });
    mocks.createConnectingAppMetadataSearchParams.mockReturnValue({
      frameId,
      urlParams: new URLSearchParams(),
      tabId,
    });
    mocks.triggerRequestPopupWindowOpen.mockResolvedValue({ id: 1 });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  test('opens the popup for a multisig descriptor', async () => {
    await invokeHandler(multisigDescriptor);
    expectPopupOpened();
  });

  test('opens the popup for a bond with a multisig vault', async () => {
    await invokeHandler(bondDescriptor);
    expectPopupOpened();
  });

  test('opens the popup for a bond with a single-key vault', async () => {
    await invokeHandler(makeBondDescriptor(`pk(${xpubA}/0/0)`));
    expectPopupOpened();
  });

  test('opens the popup for a bond with a raw-key vault', async () => {
    await invokeHandler(makeBondDescriptor(`pk(${makeNativeSegwitAddressPubkeyHex(1)})`));
    expectPopupOpened();
  });

  test('rejects miniscript that is not a bond', async () => {
    await invokeHandler(`wsh(or_d(pk(${xpubA}/0/0),pk(${xpubB}/0/0)))`);
    expectRejected();
  });

  test('rejects miniscript that wraps a multi leaf', async () => {
    await invokeHandler(`wsh(and_v(v:pk(${xpubA}/0/1),multi(1,${xpubA}/0/0,${xpubB}/0/0)))`);
    expectRejected();
  });

  test('rejects a ranged bond', async () => {
    await invokeHandler(makeBondDescriptor(`sortedmulti(2,${xpubA}/0/*,${xpubB}/0/*)`));
    expectRejected();
  });

  test('rejects a multisig that does not compile', async () => {
    await invokeHandler(`wsh(sortedmulti(2,${xpubA}/0/0,not-a-key))`);
    expectRejected();
  });

  test('rejects a descriptor over the maximum length without opening the popup', async () => {
    await invokeHandler(`wsh(sortedmulti(2,${'a'.repeat(maxBtcDescriptorLength)}))`);
    expect(mocks.triggerRequestPopupWindowOpen).not.toHaveBeenCalled();
  });
});
