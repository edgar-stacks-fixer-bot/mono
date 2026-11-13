import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { ReceiveCollectibles } from './receive-collectibles';

const stxAddress = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';

const mocks = vi.hoisted(() => ({
  copyToClipboard: vi.fn(),
  toastSuccess: vi.fn(),
}));

vi.mock('@leather.io/ui', () => ({
  StxAvatarIcon: () => null,
}));

vi.mock('@app/common/utils/copy-to-clipboard', () => ({
  copyToClipboard: mocks.copyToClipboard,
}));

vi.mock('@app/features/toasts/use-toast', () => ({
  useToast: () => ({ success: mocks.toastSuccess }),
}));

vi.mock('./receive-item', () => ({
  ReceiveItem({ onCopyAddress }: { onCopyAddress(): void }) {
    return <button onClick={onCopyAddress}>Copy</button>;
  },
}));

describe(ReceiveCollectibles.name, () => {
  beforeEach(() => {
    mocks.copyToClipboard.mockReset().mockResolvedValue(undefined);
    mocks.toastSuccess.mockReset();
  });

  test('copies the address and shows the address copy toast', async () => {
    render(<ReceiveCollectibles stxAddress={stxAddress} onClickQrStacksNft={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));

    await vi.waitFor(() =>
      expect(mocks.toastSuccess).toHaveBeenCalledWith('Address copied to clipboard')
    );
    expect(mocks.copyToClipboard).toHaveBeenCalledWith(stxAddress);
  });
});
