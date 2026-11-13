import { getLedgerAppName, prepareLedgerDeviceForAppFn } from './generic-ledger-utils';

const noAccessibleDeviceError = {
  _tag: 'NoAccessibleDeviceError',
  originalError: new Error('No device selected'),
  message: 'No accessible device',
};

function connectAndSettle<App>(connectAppFn: () => Promise<App>) {
  const onError = vi.fn();
  const setLoadingState = vi.fn();
  const result = prepareLedgerDeviceForAppFn(connectAppFn)({ onError, setLoadingState });
  return { onError, setLoadingState, result };
}

describe(prepareLedgerDeviceForAppFn.name, () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('resolves with the connected app and clears the loading state', async () => {
    const app = { name: 'Stacks' };
    const { onError, setLoadingState, result } = connectAndSettle(
      vi.fn<() => Promise<typeof app>>().mockResolvedValue(app)
    );

    await vi.runAllTimersAsync();

    await expect(result).resolves.toBe(app);
    expect(onError).not.toHaveBeenCalled();
    expect(setLoadingState.mock.calls).toEqual([[true], [false]]);
  });

  test('passes the original device-kit error to onError', async () => {
    const { onError, setLoadingState, result } = connectAndSettle(
      vi.fn<() => Promise<never>>().mockRejectedValue(noAccessibleDeviceError)
    );
    const rejection = expect(result).rejects.toThrow('Unable to initiate Ledger app');

    await vi.runAllTimersAsync();

    await rejection;
    expect(onError).toHaveBeenCalledWith(noAccessibleDeviceError);
    expect(setLoadingState.mock.calls).toEqual([[true], [false]]);
  });
});

describe(getLedgerAppName.name, () => {
  test.each([
    ['bitcoin', 'mainnet', 'Bitcoin'],
    ['bitcoin', 'testnet', 'Bitcoin Test'],
    ['bitcoin', 'signet', 'Bitcoin Test'],
    ['bitcoin', 'regtest', 'Bitcoin Test'],
    ['stacks', 'mainnet', 'Stacks'],
    ['stacks', 'testnet', 'Stacks'],
    ['stacks', 'signet', 'Stacks'],
    ['stacks', 'regtest', 'Stacks'],
  ] as const)('names the %s app on %s as %s', (chain, network, appName) => {
    expect(getLedgerAppName(chain, network)).toBe(appName);
  });
});
