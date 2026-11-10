import { type FormEvent, type ReactNode, act } from 'react';
import { createRoot } from 'react-dom/client';

import { fireEvent, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { PageActions } from './page-actions';
import { PopupPage } from './popup-page';

const mounted: { root: ReturnType<typeof createRoot>; container: HTMLElement }[] = [];

function render(children: ReactNode) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => root.render(children));
  mounted.push({ root, container });
}

function click(name: string) {
  act(() => {
    fireEvent.click(screen.getByRole('button', { name }));
  });
}

function preventSubmit(onSubmit: () => void) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };
}

describe('PageActions in a form', () => {
  afterEach(() => {
    for (const { root, container } of mounted.splice(0)) {
      act(() => root.unmount());
      container.remove();
    }
  });

  test('submits the form from a primary action inside it', () => {
    const onSubmit = vi.fn();
    render(
      <form onSubmit={preventSubmit(onSubmit)}>
        <PageActions
          primary={{ label: 'Continue', type: 'submit' }}
          secondary={{ label: 'Cancel' }}
        />
      </form>
    );

    click('Continue');

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  test('never submits the form from the secondary action', () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();
    render(
      <form onSubmit={preventSubmit(onSubmit)}>
        <PageActions
          primary={{ label: 'Continue', type: 'submit' }}
          secondary={{ label: 'Cancel', onClick: onCancel }}
        />
      </form>
    );

    click('Cancel');

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('submits a form in the page body from the popup page footer', () => {
    const onSubmit = vi.fn();
    render(
      <PopupPage
        header={<h1>Send</h1>}
        footer={<PageActions primary={{ label: 'Continue', type: 'submit', form: 'send-form' }} />}
      >
        <form id="send-form" onSubmit={preventSubmit(onSubmit)}>
          <input aria-label="Amount" defaultValue="1" />
        </form>
      </PopupPage>
    );

    click('Continue');

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  test('does not submit while the primary action is disabled', () => {
    const onSubmit = vi.fn();
    render(
      <form onSubmit={preventSubmit(onSubmit)}>
        <PageActions primary={{ label: 'Continue', type: 'submit', disabled: true }} />
      </form>
    );

    click('Continue');

    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('defaults the primary action to a plain button', () => {
    const onSubmit = vi.fn();
    const onContinue = vi.fn();
    render(
      <form onSubmit={preventSubmit(onSubmit)}>
        <PageActions primary={{ label: 'Continue', onClick: onContinue }} />
      </form>
    );

    click('Continue');

    expect(onContinue).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
