import { act, renderHook } from '@testing-library/react';
import { doNothing } from 'remeda';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useClipboard } from './use-clipboard.web';

const copiedResetMs = 1250;

interface Deferred {
  promise: Promise<void>;
  resolve(): void;
  reject(error: Error): void;
}

function createDeferred(): Deferred {
  const handlers: Pick<Deferred, 'resolve' | 'reject'> = {
    resolve: doNothing(),
    reject: doNothing(),
  };
  const promise = new Promise<void>((onResolve, onReject) => {
    handlers.resolve = onResolve;
    handlers.reject = onReject;
  });
  return {
    promise,
    resolve() {
      handlers.resolve();
    },
    reject(error) {
      handlers.reject(error);
    },
  };
}

function mockClipboard(writeText: (value: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: vi.fn(writeText) },
  });
}

function removeClipboard() {
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
}

describe('useClipboard', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    removeClipboard();
  });

  it('sets hasCopied only after the clipboard write resolves', async () => {
    const write = createDeferred();
    mockClipboard(() => write.promise);
    const { result } = renderHook(() => useClipboard('bc1qaddress'));

    let copyResult: Promise<boolean | undefined> = Promise.resolve(undefined);
    act(() => {
      copyResult = result.current.onCopy();
    });
    expect(result.current.hasCopied).toBe(false);

    await act(async () => {
      write.resolve();
      await copyResult;
    });

    await expect(copyResult).resolves.toBe(true);
    expect(result.current.hasCopied).toBe(true);
    expect(result.current.hasCopyFailed).toBe(false);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('bc1qaddress');
  });

  it('resets hasCopied after the copied duration', async () => {
    mockClipboard(() => Promise.resolve());
    const { result } = renderHook(() => useClipboard('value'));

    await act(async () => {
      await result.current.onCopy();
    });
    expect(result.current.hasCopied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(copiedResetMs - 1);
    });
    expect(result.current.hasCopied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.hasCopied).toBe(false);
  });

  it('returns false and reports a failure when the write rejects', async () => {
    mockClipboard(() => Promise.reject(new Error('denied')));
    const { result } = renderHook(() => useClipboard('value'));

    let copied: boolean | undefined;
    await act(async () => {
      copied = await result.current.onCopy();
    });

    expect(copied).toBe(false);
    expect(result.current.hasCopied).toBe(false);
    expect(result.current.hasCopyFailed).toBe(true);
  });

  it('returns false when the clipboard API is missing', async () => {
    removeClipboard();
    const { result } = renderHook(() => useClipboard('value'));

    let copied: boolean | undefined;
    await act(async () => {
      copied = await result.current.onCopy();
    });

    expect(copied).toBe(false);
    expect(result.current.hasCopied).toBe(false);
    expect(result.current.hasCopyFailed).toBe(true);
  });

  it('drops the result of a copy superseded by a newer one', async () => {
    const first = createDeferred();
    const second = createDeferred();
    const writes = [first, second];
    mockClipboard(() => writes.shift()?.promise ?? Promise.resolve());
    const { result } = renderHook(() => useClipboard('value'));

    let firstResult: Promise<boolean | undefined> = Promise.resolve(undefined);
    let secondResult: Promise<boolean | undefined> = Promise.resolve(undefined);
    act(() => {
      firstResult = result.current.onCopy();
      secondResult = result.current.onCopy();
    });

    await act(async () => {
      second.reject(new Error('denied'));
      await secondResult;
    });
    await act(async () => {
      first.resolve();
      await firstResult;
    });

    await expect(firstResult).resolves.toBeUndefined();
    await expect(secondResult).resolves.toBe(false);
    expect(result.current.hasCopied).toBe(false);
    expect(result.current.hasCopyFailed).toBe(true);
  });

  it('drops the result when the component unmounts before the write resolves', async () => {
    const write = createDeferred();
    mockClipboard(() => write.promise);
    const { result, unmount } = renderHook(() => useClipboard('value'));

    let copyResult: Promise<boolean | undefined> = Promise.resolve(undefined);
    act(() => {
      copyResult = result.current.onCopy();
    });
    unmount();

    write.resolve();
    await expect(copyResult).resolves.toBeUndefined();
  });
});
