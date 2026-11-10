import { isActionPopupWindow } from './action-popup-classifier';

function createWindow(pathname: string) {
  return { location: { pathname } };
}

describe(isActionPopupWindow.name, () => {
  test('is the action popup when the browser lists the window as a popup view', () => {
    const win = createWindow('/action-popup.html');
    expect(isActionPopupWindow(win, () => [win])).toBe(true);
  });

  test('is not the action popup when the page is opened outside the toolbar popup', () => {
    const win = createWindow('/action-popup.html');
    expect(isActionPopupWindow(win, () => [])).toBe(false);
    expect(isActionPopupWindow(win, () => [createWindow('/action-popup.html')])).toBe(false);
  });

  test('is not the action popup for other extension pages', () => {
    const win = createWindow('/popup.html');
    expect(isActionPopupWindow(win, () => [win])).toBe(false);
    const fullPage = createWindow('/index.html');
    expect(isActionPopupWindow(fullPage, () => [fullPage])).toBe(false);
  });

  test('is not the action popup when popup views cannot be read', () => {
    const win = createWindow('/action-popup.html');
    expect(
      isActionPopupWindow(win, () => {
        throw new Error('unavailable');
      })
    ).toBe(false);
  });

  test('reads popup views from the extension API by default', () => {
    const win = createWindow('/action-popup.html');
    const getViews = vi.fn(() => [win]);
    vi.stubGlobal('chrome', { ...chrome, extension: { getViews } });
    expect(isActionPopupWindow(win)).toBe(true);
    expect(getViews).toHaveBeenCalledWith({ type: 'popup' });
    vi.unstubAllGlobals();
  });
});
