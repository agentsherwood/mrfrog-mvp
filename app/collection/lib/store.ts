"use client";

// The collection store — a single device-local collection in localStorage.
// No accounts, no backend. Coins are seeded so packs work standalone (the
// game-earned-coins wiring is task 2294, deferred).

import { useCallback, useEffect, useState } from "react";

/** Economy constants — all pack tuning lives here. */
export const STARTING_COINS = 500;
export const PACK_PRICE = 100;
export const PACK_SIZE = 5;

const STORAGE_KEY = "mrfrog-collection-v1";

interface StoredState {
  /** Owned frog ids. */
  owned: number[];
  coins: number;
  /** Calendar date (YYYY-MM-DD) the free daily pack was last claimed. */
  lastDailyClaim: string;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function freshState(): StoredState {
  return { owned: [], coins: STARTING_COINS, lastDailyClaim: "" };
}

function load(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    return {
      owned: Array.isArray(parsed.owned) ? parsed.owned : [],
      coins: typeof parsed.coins === "number" ? parsed.coins : STARTING_COINS,
      lastDailyClaim: typeof parsed.lastDailyClaim === "string" ? parsed.lastDailyClaim : "",
    };
  } catch {
    return freshState();
  }
}

export interface CollectionStore {
  /** False until localStorage has been read (avoids an SSR/client flash). */
  ready: boolean;
  owned: Set<number>;
  coins: number;
  /** True if the free daily pack hasn't been claimed today. */
  dailyAvailable: boolean;
  /** Add revealed frogs to the collection. */
  addOwned: (ids: number[]) => void;
  /** Spend coins (clamped at 0). Check `coins` before calling. */
  spendCoins: (amount: number) => void;
  /** Mark the free daily pack claimed for today. */
  claimDaily: () => void;
  /** Wipe the collection (dev / reset). */
  reset: () => void;
}

export function useCollection(): CollectionStore {
  const [state, setState] = useState<StoredState | null>(null);

  useEffect(() => {
    setState(load());
  }, []);

  useEffect(() => {
    if (state) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        /* storage full / unavailable — collection just won't persist */
      }
    }
  }, [state]);

  const addOwned = useCallback((ids: number[]) => {
    setState((s) => {
      if (!s) return s;
      const owned = new Set(s.owned);
      ids.forEach((id) => owned.add(id));
      return { ...s, owned: [...owned] };
    });
  }, []);

  const spendCoins = useCallback((amount: number) => {
    setState((s) => (s ? { ...s, coins: Math.max(0, s.coins - amount) } : s));
  }, []);

  const claimDaily = useCallback(() => {
    setState((s) => (s ? { ...s, lastDailyClaim: today() } : s));
  }, []);

  const reset = useCallback(() => setState(freshState()), []);

  return {
    ready: state !== null,
    owned: new Set(state?.owned ?? []),
    coins: state?.coins ?? STARTING_COINS,
    dailyAvailable: state !== null && state.lastDailyClaim !== today(),
    addOwned,
    spendCoins,
    claimDaily,
    reset,
  };
}
