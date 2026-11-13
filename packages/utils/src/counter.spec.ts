import { createCounter } from './counter';

describe(createCounter.name, () => {
  test('starts at zero by default', () => {
    expect(createCounter().getValue()).toBe(0);
  });

  test('starts at a custom position', () => {
    expect(createCounter(5).getValue()).toBe(5);
  });

  test('increment adds one and returns the new value', () => {
    const counter = createCounter();
    expect(counter.increment()).toBe(1);
    expect(counter.increment()).toBe(2);
    expect(counter.getValue()).toBe(2);
  });

  test('incrementBy adds the given amount and returns the new value', () => {
    const counter = createCounter(2);
    expect(counter.incrementBy(3)).toBe(5);
    expect(counter.getValue()).toBe(5);
  });

  test('incrementBy subtracts when the amount is negative', () => {
    const counter = createCounter(5);
    expect(counter.incrementBy(-2)).toBe(3);
    expect(counter.getValue()).toBe(3);
  });

  test('decrement subtracts one and returns the new value', () => {
    const counter = createCounter(1);
    expect(counter.decrement()).toBe(0);
    expect(counter.decrement()).toBe(-1);
    expect(counter.getValue()).toBe(-1);
  });

  test('getValue returns the same value on repeated calls without changing the counter', () => {
    const counter = createCounter(3);
    expect(counter.getValue()).toBe(3);
    expect(counter.getValue()).toBe(3);
    expect(counter.increment()).toBe(4);
  });

  test('keeps state separate between counters', () => {
    const first = createCounter();
    const second = createCounter(10);
    first.increment();
    second.decrement();
    expect(first.getValue()).toBe(1);
    expect(second.getValue()).toBe(9);
  });
});
