import {
  dateToUnixTimestamp,
  daysInMs,
  daysInSec,
  hoursInMs,
  hoursInSec,
  minutesInMs,
  minutesInSec,
  secondsInMs,
  weeksInMs,
  weeksInSec,
} from './time';

describe('time helpers', () => {
  test(secondsInMs.name, () => {
    expect(secondsInMs(1)).toBe(1000);
  });

  test(minutesInMs.name, () => {
    expect(minutesInMs(1)).toBe(60000);
  });

  test(hoursInMs.name, () => {
    expect(hoursInMs(1)).toBe(3600000);
  });

  test(daysInMs.name, () => {
    expect(daysInMs(1)).toBe(86400000);
  });

  test(weeksInMs.name, () => {
    expect(weeksInMs(1)).toBe(604800000);
  });

  test(minutesInSec.name, () => {
    expect(minutesInSec(1)).toBe(60);
  });

  test(hoursInSec.name, () => {
    expect(hoursInSec(1)).toBe(3600);
  });

  test(daysInSec.name, () => {
    expect(daysInSec(1)).toBe(86400);
  });

  test(weeksInSec.name, () => {
    expect(weeksInSec(1)).toBe(604800);
  });

  test(dateToUnixTimestamp.name, () => {
    expect(dateToUnixTimestamp(new Date('2024-01-01T00:00:00.999Z'))).toBe(1704067200);
  });
});
