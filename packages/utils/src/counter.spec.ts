import { createCounter } from './counter';

describe(createCounter.name, () => {
  test('starts at zero by default', () => {
    expect(createCounter().getValue()).toEqual(0);
  });

  test('starts at the given position', () => {
    expect(createCounter(5).getValue()).toEqual(5);
  });

  test('increment adds one and returns the new value', () => {
    const counter = createCounter();
    expect(counter.increment()).toEqual(1);
    expect(counter.increment()).toEqual(2);
    expect(counter.getValue()).toEqual(2);
  });

  test('incrementBy adds the given amount and returns the new value', () => {
    const counter = createCounter(3);
    expect(counter.incrementBy(4)).toEqual(7);
    expect(counter.incrementBy(-2)).toEqual(5);
    expect(counter.getValue()).toEqual(5);
  });

  test('decrement subtracts one and returns the new value', () => {
    const counter = createCounter(2);
    expect(counter.decrement()).toEqual(1);
    expect(counter.decrement()).toEqual(0);
    expect(counter.decrement()).toEqual(-1);
    expect(counter.getValue()).toEqual(-1);
  });

  test('getValue reflects a mix of operations', () => {
    const counter = createCounter(10);
    counter.increment();
    counter.incrementBy(5);
    counter.decrement();
    expect(counter.getValue()).toEqual(15);
  });
});
