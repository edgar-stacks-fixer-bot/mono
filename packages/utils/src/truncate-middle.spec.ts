import { truncateMiddle } from './truncate-middle';

describe(truncateMiddle.name, () => {
  test('returns an empty string unchanged', () => {
    expect(truncateMiddle('')).toEqual('');
  });

  test('truncates a 0x hex string keeping the prefix', () => {
    expect(truncateMiddle('0x1234567890abcdef')).toEqual('0x12345…bcdef');
  });

  test('truncates the address of a contract id and keeps the contract name', () => {
    expect(truncateMiddle('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.my-contract')).toEqual(
      'SP2J6…V9EJ7.my-contract'
    );
  });

  test('truncates a plain string', () => {
    expect(truncateMiddle('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh')).toEqual('bc1qx…x0wlh');
  });
});
