import { createCounter } from './counter';

describe(createCounter.name, () => {
  test('starts at 0 by default', () => {
    expect(createCounter().getValue()).toEqual(0);
  });

  test('starts at a custom position', () => {
    expect(createCounter(5).getValue()).toEqual(5);
  });

  test('increment adds one and returns the new value', () => {
    const counter = createCounter();
    expect(counter.increment()).toEqual(1);
    expect(counter.increment()).toEqual(2);
    expect(counter.getValue()).toEqual(2);
  });

  test('incrementBy adds the given amount and returns the new value', () => {
    const counter = createCounter(2);
    expect(counter.incrementBy(3)).toEqual(5);
    expect(counter.incrementBy(-1)).toEqual(4);
    expect(counter.getValue()).toEqual(4);
  });

  test('decrement subtracts one and returns the new value', () => {
    const counter = createCounter(3);
    expect(counter.decrement()).toEqual(2);
    expect(counter.decrement()).toEqual(1);
    expect(counter.getValue()).toEqual(1);
  });
});
