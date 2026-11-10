const actionPopupPathname = '/action-popup.html';

interface ClassifiableWindow {
  location: { pathname: string };
}

function getActionPopupViews(): readonly unknown[] {
  return chrome.extension.getViews({ type: 'popup' });
}

export function isActionPopupWindow(
  win: ClassifiableWindow,
  getPopupViews: () => readonly unknown[] = getActionPopupViews
) {
  if (win.location.pathname !== actionPopupPathname) return false;
  try {
    return getPopupViews().includes(win);
  } catch {
    return false;
  }
}
