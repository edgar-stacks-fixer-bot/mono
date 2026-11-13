import { truncateMiddle } from './truncate-middle';

describe(truncateMiddle.name, () => {
  test('keeps 4 characters on each side by default', () => {
    expect(truncateMiddle('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7')).toEqual('SP2J…9EJ7');
  });

  test('keeps the contract name and truncates the address by default', () => {
    expect(truncateMiddle('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.my-contract')).toEqual(
      'SP2J…9EJ7.my-contract'
    );
  });

  test('keeps the 0x prefix and 4 characters on each side of hex by default', () => {
    expect(truncateMiddle('0x1234567890abcdef1234567890abcdef')).toEqual('0x1234…cdef');
  });

  test('uses an explicit offset when given', () => {
    expect(truncateMiddle('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', 5)).toEqual('SP2J6…V9EJ7');
  });

  test('returns empty input unchanged', () => {
    expect(truncateMiddle('')).toEqual('');
  });
});
