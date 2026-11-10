import { type ReactNode, act } from 'react';
import { createRoot } from 'react-dom/client';

import { fireEvent, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { AmountDisplay } from './amount-display';
import { InlineInfo } from './inline-info';
import { ListRow } from './list-row';
import { PageActions } from './page-actions';
import { PageHeader } from './page-header';
import { PageNotice } from './page-notice';
import { PopupPage } from './popup-page';
import { ReviewSheet } from './review-sheet';
import { SectionHeader } from './section-header';
import { TabPage } from './tab-page';

const mounted: { root: ReturnType<typeof createRoot>; container: HTMLElement }[] = [];

function render(children: ReactNode) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => root.render(children));
  mounted.push({ root, container });
  return container;
}

function click(element: HTMLElement) {
  act(() => {
    fireEvent.click(element);
  });
}

describe('recipe composition', () => {
  afterEach(() => {
    for (const { root, container } of mounted.splice(0)) {
      act(() => root.unmount());
      container.remove();
    }
  });

  test('composes a popup page with header, scrolling body and footer actions', () => {
    const onBack = vi.fn();
    const onClose = vi.fn();
    const onContinue = vi.fn();
    const container = render(
      <PopupPage
        header={<PageHeader title="Send" onBack={onBack} onClose={onClose} />}
        footer={<PageActions primary={{ label: 'Continue', onClick: onContinue }} />}
      >
        <SectionHeader title="Choose a token" />
        <ListRow title="Bitcoin" caption="Native SegWit" />
        <InlineInfo>Fees are estimated on the next screen.</InlineInfo>
      </PopupPage>
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Send' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: 'Choose a token' })).toBeTruthy();
    expect(screen.getByText('Fees are estimated on the next screen.')).toBeTruthy();

    const main = container.querySelector('main');
    const footer = container.querySelector('footer');
    expect(main?.textContent).toContain('Bitcoin');
    expect(main?.contains(screen.getByRole('button', { name: 'Continue' }))).toBe(false);
    expect(footer?.contains(screen.getByRole('button', { name: 'Continue' }))).toBe(true);

    click(screen.getByRole('button', { name: 'Go back' }));
    click(screen.getByRole('button', { name: 'Close' }));
    click(screen.getByRole('button', { name: 'Continue' }));
    expect(onBack).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  test('omits header actions that have no handler', () => {
    render(<PageHeader title="Receive" />);

    expect(screen.queryByRole('button')).toBeNull();
  });

  test('shows a chevron only on rows that can be selected', () => {
    const onSelect = vi.fn();
    render(
      <>
        <ListRow title="Static row" value="1 BTC" />
        <ListRow title="Selectable row" onSelect={onSelect} />
      </>
    );

    expect(screen.queryByRole('button', { name: /Static row/ })).toBeNull();
    expect(screen.getAllByTestId('list-row-chevron')).toHaveLength(1);

    click(screen.getByRole('button', { name: /Selectable row/ }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  test('renders amounts with tabular figures and the symbol', () => {
    render(<AmountDisplay amount="0.04812300" symbol="BTC" fiat="$4,592.18" />);

    const amount = screen.getByText('0.04812300 BTC');
    expect(amount.className).toContain('fv-num_tabular-nums');
    expect(screen.getByText('$4,592.18').className).toContain('fv-num_tabular-nums');
  });

  test('announces page notices with their title', () => {
    render(
      <PageNotice tone="warning" title="High fee">
        The network is busy.
      </PageNotice>
    );

    const notice = screen.getByRole('status');
    expect(within(notice).getByText('High fee')).toBeTruthy();
    expect(within(notice).getByText('The network is busy.')).toBeTruthy();
  });

  test('switches tab page content', () => {
    render(
      <TabPage
        label="Account sections"
        tabs={[
          { id: 'tokens', label: 'Tokens', content: <span>Token list</span> },
          { id: 'activity', label: 'Activity', content: <span>Activity list</span> },
        ]}
      />
    );

    expect(screen.getByText('Token list')).toBeTruthy();
    expect(screen.queryByText('Activity list')).toBeNull();

    act(() => {
      fireEvent.mouseDown(screen.getByRole('tab', { name: 'Activity' }), { button: 0 });
    });
    expect(screen.getByText('Activity list')).toBeTruthy();
  });

  test('composes a review sheet with rows and footer actions', () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    render(
      <ReviewSheet
        isShowing
        title="Review details"
        summary={<AmountDisplay amount="0.00125000" symbol="BTC" />}
        rows={[
          { label: 'Network', value: 'Bitcoin' },
          { label: 'Fee rate', value: '12 sats/vB', caption: 'About 30 minutes' },
        ]}
        confirmLabel="Confirm"
        onConfirm={onConfirm}
        onClose={onClose}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: 'Review details' })).toBeTruthy();
    expect(within(dialog).getByText('0.00125000 BTC')).toBeTruthy();
    expect(within(dialog).getByText('Network')).toBeTruthy();
    expect(within(dialog).getByText('12 sats/vB')).toBeTruthy();
    expect(within(dialog).getByText('About 30 minutes')).toBeTruthy();

    click(within(dialog).getByRole('button', { name: 'Confirm' }));
    click(within(dialog).getByRole('button', { name: 'Cancel' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
