import { withWalletAuthenticationWriteLock } from './wallet-write-lock';

function createFakeLockManager() {
  const tails = new Map<string, Promise<unknown>>();
  return {
    request: vi.fn((name: string, _options: { mode: string }, callback: () => Promise<unknown>) => {
      const previous = tails.get(name) ?? Promise.resolve();
      async function runAfterPrevious() {
        await previous.catch(() => undefined);
        return callback();
      }
      const current = runAfterPrevious();
      tails.set(name, current);
      return current;
    }),
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe(withWalletAuthenticationWriteLock.name, () => {
  test('requests the exclusive wallet authentication write lock', async () => {
    const locks = createFakeLockManager();
    vi.stubGlobal('navigator', { locks });

    await expect(withWalletAuthenticationWriteLock(() => Promise.resolve('done'))).resolves.toBe(
      'done'
    );
    expect(locks.request).toHaveBeenCalledWith(
      'leather:wallet-authentication-write',
      { mode: 'exclusive' },
      expect.any(Function)
    );
  });

  test('serializes overlapping writes', async () => {
    vi.stubGlobal('navigator', { locks: createFakeLockManager() });
    const events: string[] = [];
    const firstWrite = Promise.withResolvers<void>();

    const first = withWalletAuthenticationWriteLock(async () => {
      events.push('first:start');
      await firstWrite.promise;
      events.push('first:end');
    });
    const second = withWalletAuthenticationWriteLock(() => {
      events.push('second:start');
      return Promise.resolve();
    });

    await vi.waitFor(() => expect(events).toEqual(['first:start']));
    firstWrite.resolve();
    await Promise.all([first, second]);

    expect(events).toEqual(['first:start', 'first:end', 'second:start']);
  });

  test('propagates errors from the locked write', async () => {
    vi.stubGlobal('navigator', { locks: createFakeLockManager() });
    await expect(
      withWalletAuthenticationWriteLock(() => Promise.reject(new Error('write failed')))
    ).rejects.toThrow('write failed');
  });

  test('fails closed without the Web Locks API', async () => {
    vi.stubGlobal('navigator', {});
    const write = vi.fn(() => Promise.resolve());
    await expect(withWalletAuthenticationWriteLock(write)).rejects.toThrow(
      'Wallet writes cannot be serialized without the Web Locks API'
    );
    expect(write).not.toHaveBeenCalled();
  });
});
