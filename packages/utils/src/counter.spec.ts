import { createCounter } from './counter';

describe(createCounter.name, () => {
  test('starts at zero by default', () => {
    const counter = createCounter();
    expect(counter.getValue()).toEqual(0);
  });

  test('starts at a custom start position', () => {
    const counter = createCounter(5);
    expect(counter.getValue()).toEqual(5);
  });

  test('increment adds one and returns the new value', () => {
    const counter = createCounter();
    expect(counter.increment()).toEqual(1);
    expect(counter.increment()).toEqual(2);
    expect(counter.getValue()).toEqual(2);
  });

  test('incrementBy adds the amount and returns the new value', () => {
    const counter = createCounter(2);
    expect(counter.incrementBy(3)).toEqual(5);
    expect(counter.incrementBy(-1)).toEqual(4);
    expect(counter.getValue()).toEqual(4);
  });

  test('decrement subtracts one and returns the new value', () => {
    const counter = createCounter(1);
    expect(counter.decrement()).toEqual(0);
    expect(counter.decrement()).toEqual(-1);
    expect(counter.getValue()).toEqual(-1);
  });

  test('keeps separate counters independent', () => {
    const first = createCounter();
    const second = createCounter(10);
    first.increment();
    second.decrement();
    expect(first.getValue()).toEqual(1);
    expect(second.getValue()).toEqual(9);
  });
});
