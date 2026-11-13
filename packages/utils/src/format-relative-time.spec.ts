import { formatRelativeTime } from './format-relative-time';
import { hoursInMs, minutesInMs } from './time';

describe(formatRelativeTime.name, () => {
  const now = new Date('2026-01-01T12:00:00.000Z');

  test('formats a past date', () => {
    expect(formatRelativeTime(new Date(now.getTime() - minutesInMs(5)), now)).toEqual(
      '5 minutes ago'
    );
  });

  test('formats a future date', () => {
    expect(formatRelativeTime(new Date(now.getTime() + hoursInMs(2)), now)).toEqual('in 2 hours');
  });
});
