import {
  dateToUnixTimestamp,
  daysInMs,
  daysInSec,
  fiveMinInMs,
  hoursInMs,
  hoursInSec,
  minutesInMs,
  minutesInSec,
  oneDayInMs,
  oneMinInMs,
  oneWeekInMs,
  secondsInMs,
  weeksInMs,
  weeksInSec,
} from './time';

describe('time constants', () => {
  test('oneMinInMs is sixty thousand milliseconds', () => {
    expect(oneMinInMs).toBe(60_000);
  });

  test('fiveMinInMs is five minutes in milliseconds', () => {
    expect(fiveMinInMs).toBe(300_000);
  });

  test('oneDayInMs is one day in milliseconds', () => {
    expect(oneDayInMs).toBe(86_400_000);
  });

  test('oneWeekInMs is seven days in milliseconds', () => {
    expect(oneWeekInMs).toBe(604_800_000);
  });
});

describe(dateToUnixTimestamp.name, () => {
  test('returns zero for the unix epoch', () => {
    expect(dateToUnixTimestamp(new Date(0))).toBe(0);
  });

  test('returns whole seconds for a date', () => {
    expect(dateToUnixTimestamp(new Date('2024-01-01T00:00:00.000Z'))).toBe(1_704_067_200);
  });

  test('drops the milliseconds of a date', () => {
    expect(dateToUnixTimestamp(new Date(1_704_067_200_999))).toBe(1_704_067_200);
  });

  test('rounds down for a date before the epoch', () => {
    expect(dateToUnixTimestamp(new Date(-1500))).toBe(-2);
  });
});

describe(weeksInMs.name, () => {
  test('converts weeks to milliseconds', () => {
    expect(weeksInMs(1)).toBe(oneWeekInMs);
    expect(weeksInMs(2)).toBe(1_209_600_000);
  });

  test('returns zero for zero weeks', () => {
    expect(weeksInMs(0)).toBe(0);
  });

  test('returns a negative value for negative weeks', () => {
    expect(weeksInMs(-1)).toBe(-604_800_000);
  });
});

describe(daysInMs.name, () => {
  test('converts days to milliseconds', () => {
    expect(daysInMs(1)).toBe(oneDayInMs);
    expect(daysInMs(0.5)).toBe(43_200_000);
  });

  test('returns zero for zero days', () => {
    expect(daysInMs(0)).toBe(0);
  });

  test('returns a negative value for negative days', () => {
    expect(daysInMs(-2)).toBe(-172_800_000);
  });
});

describe(hoursInMs.name, () => {
  test('converts hours to milliseconds', () => {
    expect(hoursInMs(1)).toBe(3_600_000);
    expect(hoursInMs(24)).toBe(oneDayInMs);
  });

  test('returns zero for zero hours', () => {
    expect(hoursInMs(0)).toBe(0);
  });

  test('returns a negative value for negative hours', () => {
    expect(hoursInMs(-3)).toBe(-10_800_000);
  });
});

describe(minutesInMs.name, () => {
  test('converts minutes to milliseconds', () => {
    expect(minutesInMs(1)).toBe(oneMinInMs);
    expect(minutesInMs(5)).toBe(fiveMinInMs);
  });

  test('returns zero for zero minutes', () => {
    expect(minutesInMs(0)).toBe(0);
  });

  test('returns a negative value for negative minutes', () => {
    expect(minutesInMs(-10)).toBe(-600_000);
  });
});

describe(secondsInMs.name, () => {
  test('converts seconds to milliseconds', () => {
    expect(secondsInMs(1)).toBe(1000);
    expect(secondsInMs(1.5)).toBe(1500);
  });

  test('returns zero for zero seconds', () => {
    expect(secondsInMs(0)).toBe(0);
  });

  test('returns a negative value for negative seconds', () => {
    expect(secondsInMs(-30)).toBe(-30_000);
  });
});

describe(weeksInSec.name, () => {
  test('converts weeks to seconds', () => {
    expect(weeksInSec(1)).toBe(604_800);
    expect(weeksInSec(2)).toBe(1_209_600);
  });

  test('returns zero for zero weeks', () => {
    expect(weeksInSec(0)).toBe(0);
  });

  test('returns a negative value for negative weeks', () => {
    expect(weeksInSec(-1)).toBe(-604_800);
  });
});

describe(daysInSec.name, () => {
  test('converts days to seconds', () => {
    expect(daysInSec(1)).toBe(86_400);
    expect(daysInSec(7)).toBe(weeksInSec(1));
  });

  test('returns zero for zero days', () => {
    expect(daysInSec(0)).toBe(0);
  });

  test('returns a negative value for negative days', () => {
    expect(daysInSec(-2)).toBe(-172_800);
  });
});

describe(hoursInSec.name, () => {
  test('converts hours to seconds', () => {
    expect(hoursInSec(1)).toBe(3600);
    expect(hoursInSec(24)).toBe(daysInSec(1));
  });

  test('returns zero for zero hours', () => {
    expect(hoursInSec(0)).toBe(0);
  });

  test('returns a negative value for negative hours', () => {
    expect(hoursInSec(-3)).toBe(-10_800);
  });
});

describe(minutesInSec.name, () => {
  test('converts minutes to seconds', () => {
    expect(minutesInSec(1)).toBe(60);
    expect(minutesInSec(0.5)).toBe(30);
  });

  test('returns zero for zero minutes', () => {
    expect(minutesInSec(0)).toBe(0);
  });

  test('returns a negative value for negative minutes', () => {
    expect(minutesInSec(-10)).toBe(-600);
  });
});
