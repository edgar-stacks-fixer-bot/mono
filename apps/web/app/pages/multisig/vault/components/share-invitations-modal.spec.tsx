import { type ReactNode, act } from 'react';
import { createRoot } from 'react-dom/client';

import { fireEvent, screen } from '@testing-library/react';
import { Tooltip } from 'radix-ui';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { ToastContext } from '~/features/toasts/use-toast';

import type { Vault } from '@leather.io/models';

import { ShareInvitationsModal } from './share-invitations-modal';

const mounted: { root: ReturnType<typeof createRoot>; container: HTMLElement }[] = [];
const toast = { success: vi.fn(), error: vi.fn(), info: vi.fn() };

const vault: Vault = {
  id: 'vault-1',
  name: 'Team vault',
  theme: null,
  icon: null,
  network: 'stx:mainnet',
  status: 'pending',
  createdBy: 'u0',
  createdAt: '',
  members: [
    {
      membershipId: 'm1',
      address: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQVX8X0G',
      name: 'Me',
      membershipStatus: 'joined',
      user: null,
    },
    {
      membershipId: 'm2',
      address: 'SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R',
      name: 'Jane',
      membershipStatus: 'invited',
      user: null,
    },
  ],
};

interface Deferred {
  promise: Promise<void>;
  resolve(): void;
}

function createDeferred(): Deferred {
  const handlers: { resolve?(): void } = {};
  const promise = new Promise<void>(onResolve => {
    handlers.resolve = onResolve;
  });
  return {
    promise,
    resolve() {
      handlers.resolve?.();
    },
  };
}

function mockClipboard(writeText: (value: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: vi.fn(writeText) },
  });
}

function modal(isShowing: boolean) {
  return (
    <ToastContext.Provider value={toast}>
      <Tooltip.Provider>
        <ShareInvitationsModal vault={vault} isShowing={isShowing} onClose={vi.fn()} />
      </Tooltip.Provider>
    </ToastContext.Provider>
  );
}

function render(children: ReactNode) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => root.render(children));
  mounted.push({ root, container });
  return root;
}

async function click(name: string) {
  act(() => {
    fireEvent.click(screen.getByRole('button', { name }));
  });
  await act(() => Promise.resolve());
}

describe('ShareInvitationsModal', () => {
  beforeEach(() => {
    toast.success.mockClear();
    toast.error.mockClear();
  });

  afterEach(() => {
    for (const { root, container } of mounted.splice(0)) {
      act(() => root.unmount());
      container.remove();
    }
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
  });

  test('confirms the copied invite message only after the write succeeds', async () => {
    mockClipboard(() => Promise.resolve());
    render(modal(true));

    await click('Copy message');

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('Hey Jane'));
    expect(toast.success).toHaveBeenCalledWith('Invite message copied');
    expect(toast.error).not.toHaveBeenCalled();
  });

  test('confirms the copied invite link only after the write succeeds', async () => {
    mockClipboard(() => Promise.resolve());
    render(modal(true));

    await click('Copy link');

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('invite=vault-1')
    );
    expect(toast.success).toHaveBeenCalledWith('Invite link copied');
  });

  test('reports a failed invite message copy', async () => {
    mockClipboard(() => Promise.reject(new Error('denied')));
    render(modal(true));

    await click('Copy message');

    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('Unable to copy invite message. Try again.');
  });

  test('reports a failed invite link copy when the clipboard is unavailable', async () => {
    render(modal(true));

    await click('Copy link');

    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('Unable to copy invite link. Try again.');
  });

  test('ignores a copy result that arrives after the modal closes', async () => {
    const write = createDeferred();
    mockClipboard(() => write.promise);
    const root = render(modal(true));

    await click('Copy link');
    act(() => root.render(modal(false)));
    await act(async () => {
      write.resolve();
      await write.promise;
    });

    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });
});
