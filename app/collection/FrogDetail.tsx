"use client";

// Frog detail card — opens when a grid cell is tapped. Owned frogs show the
// full card (rarity, traits, stats); unowned stay a mystery.

import { useEffect } from "react";

import { STAT_LABELS, STAT_NAMES } from "../data/collection-traits";
import FrogImage, { MysteryFrog } from "../components/FrogImage";
import type { Frog } from "../lib/collection/types";
import { frogName, TIER_STYLE, visibleTraits } from "./lib/rarity";

function StatBar({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 shrink-0 text-sm text-ink-soft">{label}</span>
      <span className="relative h-3 flex-1 overflow-hidden rounded-full bg-paper-edge">
        <span
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${value}%`, background: accent }}
        />
      </span>
      <span className="w-8 shrink-0 text-right text-sm font-bold text-ink">{value}</span>
    </div>
  );
}

export default function FrogDetail({
  frog,
  owned,
  total,
  onClose,
}: {
  frog: Frog;
  owned: boolean;
  total: number;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const style = TIER_STYLE[frog.tier];
  const idLabel = `#${frog.id.toLocaleString()} / ${total.toLocaleString()}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/55 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="paper-card my-auto w-full max-w-md rounded-3xl p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-pencil">{idLabel}</p>
            <h2 className="text-2xl text-ink sm:text-3xl">
              {owned ? frogName(frog) : "Mystery Frog"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="paper-card -mr-1 -mt-1 h-9 w-9 shrink-0 rounded-full text-lg text-ink-soft hover:text-ink"
          >
            ✕
          </button>
        </div>

        {owned ? (
          <>
            <div
              className="mx-auto mb-3 w-full max-w-[19rem] overflow-hidden rounded-2xl"
              style={{ background: style.soft, border: `2px solid ${style.accent}` }}
            >
              <FrogImage traits={frog.traits} priority />
            </div>

            <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
              <span
                className="rounded-lg px-3 py-1 text-sm font-bold uppercase tracking-wide text-white"
                style={{ background: style.accent }}
              >
                {style.label}
              </span>
              <span className="rounded-lg bg-paper-edge px-3 py-1 text-sm text-ink-soft">
                Rarity rank #{frog.rarityRank.toLocaleString()}
              </span>
            </div>

            <div className="mb-4">
              <h3 className="mb-1.5 text-sm uppercase tracking-wide text-pencil">Traits</h3>
              <ul className="space-y-1">
                {visibleTraits(frog).map((t) => (
                  <li key={t.category} className="flex items-baseline justify-between gap-2 text-sm">
                    <span className="text-ink-soft">{t.label}</span>
                    <span className="flex-1 border-b border-dotted border-rule" />
                    <span className="font-bold text-ink">{t.valueLabel}</span>
                    <span className="w-14 text-right text-xs text-pencil">{t.percent}%</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-1.5 text-sm uppercase tracking-wide text-pencil">Stats</h3>
              <div className="space-y-1.5">
                {STAT_NAMES.map((s) => (
                  <StatBar
                    key={s}
                    label={STAT_LABELS[s]}
                    value={frog.stats[s]}
                    accent={style.accent}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="py-4 text-center">
            <div className="relative mx-auto mb-4 aspect-square w-full max-w-[15rem] overflow-hidden rounded-2xl bg-paper-edge/50">
              <MysteryFrog />
              <span className="absolute inset-0 flex items-center justify-center text-6xl text-pencil/40">
                ?
              </span>
            </div>
            <p className="text-ink-soft">
              You haven&rsquo;t collected this frog yet.
            </p>
            <p className="mt-1 text-sm text-pencil">
              Open packs to find frog {idLabel.split(" / ")[0]}!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
