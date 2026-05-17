"use client";

// Pack-opening overlay — the dopamine core. Tap the pack, the 5 frogs pop
// over one at a time with the rarity glow building, then drop into the
// collection.

import { useCallback, useEffect, useState } from "react";

import FrogImage from "../components/FrogImage";
import type { Frog } from "../lib/collection/types";
import { frogName, TIER_STYLE } from "./lib/rarity";

const RARE_PLUS = new Set(["rare", "epic", "legendary", "one-of-one"]);

export default function PackOpening({
  frogs,
  onDone,
}: {
  frogs: Frog[];
  onDone: () => void;
}) {
  const [opened, setOpened] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const allRevealed = revealed >= frogs.length;

  // Once the pack is torn open, pop the cards over one at a time.
  useEffect(() => {
    if (!opened || allRevealed) return;
    const t = window.setTimeout(() => setRevealed((n) => n + 1), 760);
    return () => window.clearTimeout(t);
  }, [opened, revealed, allRevealed]);

  const revealAll = useCallback(() => {
    if (opened && !allRevealed) setRevealed(frogs.length);
  }, [opened, allRevealed, frogs.length]);

  const best = frogs.reduce(
    (b, f) => (f.rarityRank < b.rarityRank ? f : b),
    frogs[0],
  );

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
      onClick={revealAll}
    >
      {!opened ? (
        <button
          type="button"
          onClick={() => setOpened(true)}
          className="sprite-btn flex flex-col items-center"
        >
          <div className="idle-bounce paper-card relative flex h-64 w-48 flex-col items-center justify-center rounded-3xl border-2 border-sage bg-sage/25">
            <span className="text-xs uppercase tracking-[0.3em] text-ink-soft">
              Mr Frog
            </span>
            <span className="my-1 text-3xl text-ink">Frog Pack</span>
            <img
              src="/collection/layers/frog/none.png"
              alt=""
              aria-hidden
              className="h-24 w-24 object-contain"
            />
            <span className="sparkle absolute -right-3 -top-3 text-3xl">✦</span>
          </div>
          <span className="mt-4 text-lg text-paper">Tap the pack to open!</span>
        </button>
      ) : (
        <>
          <h2 className="mb-1 text-2xl text-paper sm:text-3xl">
            {allRevealed ? "Your new frogs!" : "Opening…"}
          </h2>
          <p className="mb-4 h-5 text-sm text-paper/80">
            {!allRevealed && "Tap to reveal all"}
          </p>

          <div className="flex max-w-2xl flex-wrap justify-center gap-3">
            {frogs.map((frog, i) => {
              const isUp = i < revealed;
              const style = TIER_STYLE[frog.tier];
              const rare = RARE_PLUS.has(frog.tier);
              return (
                <div
                  key={frog.id}
                  className="relative aspect-square w-28 sm:w-32"
                >
                  {isUp ? (
                    <div
                      className="card-pop absolute inset-0 overflow-hidden rounded-xl border-2"
                      style={{
                        background: style.soft,
                        borderColor: style.accent,
                        boxShadow: rare ? `0 0 24px ${style.accent}` : undefined,
                      }}
                    >
                      <FrogImage traits={frog.traits} priority />
                      <span
                        className="absolute inset-x-0 bottom-0 py-0.5 text-center text-[0.62rem] font-bold uppercase tracking-wide text-white"
                        style={{ background: style.accent }}
                      >
                        {style.label}
                      </span>
                      {rare && (
                        <span className="performing-pop absolute -right-1.5 -top-1.5 text-xl">
                          ✦
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="paper-card absolute inset-0 flex items-center justify-center rounded-xl border-2 border-sage bg-sage/25">
                      <span className="text-3xl text-ink-soft">?</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {allRevealed && (
            <div className="wobble-in mt-5 text-center">
              <p className="text-paper">
                {frogs.length} new frog{frogs.length === 1 ? "" : "s"} — rarest is{" "}
                <span style={{ color: TIER_STYLE[best.tier].accent }}>
                  {frogName(best)}
                </span>{" "}
                ({TIER_STYLE[best.tier].label})
              </p>
              <button
                type="button"
                onClick={onDone}
                className="paper-card mt-3 rounded-xl bg-sun/40 px-6 py-2 text-lg text-ink hover:bg-sun/60"
              >
                Add to collection ▸
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
