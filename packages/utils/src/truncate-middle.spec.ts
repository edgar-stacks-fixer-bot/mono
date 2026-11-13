import { truncateMiddle } from './truncate-middle';

describe(truncateMiddle.name, () => {
  test('keeps 4 characters on each side by default', () => {
    expect(truncateMiddle('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7')).toEqual('SP2J…9EJ7');
  });

  test('keeps 4 characters on each side of a contract address by default', () => {
    expect(truncateMiddle('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.my-contract')).toEqual(
      'SP2J…9EJ7.my-contract'
    );
  });

  test('keeps 4 characters after the 0x prefix of a hex string by default', () => {
    expect(truncateMiddle('0x1234567890abcdef')).toEqual('0x1234…cdef');
  });

  test('respects an explicit offset', () => {
    expect(truncateMiddle('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', 6)).toEqual('SP2J6Z…RV9EJ7');
  });

  test('returns empty input unchanged', () => {
    expect(truncateMiddle('')).toEqual('');
  });
});
