import { describe, expect, test } from 'vitest';
import { clampIndex, deckReducer } from '@/components/deck/deckReducer';

describe('clampIndex', () => {
  test('keeps an index inside the range', () => {
    expect(clampIndex(3, 7)).toBe(3);
  });
  test('clamps below zero to zero', () => {
    expect(clampIndex(-1, 7)).toBe(0);
  });
  test('clamps past the end to the last index', () => {
    expect(clampIndex(7, 7)).toBe(6);
  });
  test('treats NaN as zero', () => {
    expect(clampIndex(Number.NaN, 7)).toBe(0);
  });
});

describe('deckReducer', () => {
  const state = { index: 2, total: 7 };
  test('GOTO sets a clamped index', () => {
    expect(deckReducer(state, { type: 'GOTO', index: 9 })).toEqual({
      index: 6,
      total: 7,
    });
  });
  test('OBSERVED sets the index', () => {
    expect(deckReducer(state, { type: 'OBSERVED', index: 4 })).toEqual({
      index: 4,
      total: 7,
    });
  });
  test('returns the same state object when the index does not change', () => {
    expect(deckReducer(state, { type: 'OBSERVED', index: 2 })).toBe(state);
  });
});
