import { fetchListOrEmpty } from './fetch-list-or-empty';

describe('fetchListOrEmpty', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the fetched list', async () => {
    await expect(fetchListOrEmpty(() => Promise.resolve(['a', 'b']))).resolves.toEqual(['a', 'b']);
  });

  it('returns an empty list when the fetch resolves to null', async () => {
    await expect(fetchListOrEmpty<string>(() => Promise.resolve(null))).resolves.toEqual([]);
  });

  it('returns an empty list when the fetch fails', async () => {
    await expect(
      fetchListOrEmpty<string>(() => Promise.reject(new Error('Sanity is down')))
    ).resolves.toEqual([]);
  });

  it('returns an empty list and aborts the fetch when it takes over the timeout', async () => {
    vi.useFakeTimers();
    const seenSignals: AbortSignal[] = [];
    const result = fetchListOrEmpty<string>(signal => {
      seenSignals.push(signal);
      return new Promise<string[]>(resolve => {
        setTimeout(() => resolve(['too late']), 60_000);
      });
    });

    await vi.advanceTimersByTimeAsync(5000);

    await expect(result).resolves.toEqual([]);
    expect(seenSignals[0]?.aborted).toBe(true);
  });
});
