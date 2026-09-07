export type DeckState = { index: number; total: number };

export type DeckAction =
  { type: 'GOTO'; index: number } | { type: 'OBSERVED'; index: number };

export function clampIndex(index: number, total: number): number {
  if (total <= 0 || !Number.isFinite(index)) return 0;
  return Math.min(Math.max(Math.trunc(index), 0), total - 1);
}

export function deckReducer(state: DeckState, action: DeckAction): DeckState {
  const index = clampIndex(action.index, state.total);
  return index === state.index ? state : { ...state, index };
}
