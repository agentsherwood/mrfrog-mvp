"use client";

// The Frog Lab — a dev-only page for picking traits and watching the frog
// rebuild in real time. As each accessory layer comes online (headwear,
// eyewear, …) it just needs to land in ACTIVE_CATEGORIES and its picker
// shows up here automatically.

import { useMemo, useState } from "react";

import FrogImage from "../components/FrogImage";
import PageNav from "../components/PageNav";
import {
  ACTIVE_CATEGORIES,
  CATEGORY_BY_ID,
  TRAIT_CATEGORIES,
  type TraitCategory,
  type TraitCategoryId,
  type TraitValue,
} from "../data/collection-traits";
import type { FrogTraits } from "../lib/collection/types";

// Default genome — first value of every category, the plain green frog on
// notebook paper. New surfaces start here and pickers mutate from it.
function defaultTraits(): FrogTraits {
  const t = {} as Record<TraitCategoryId, string>;
  for (const cat of TRAIT_CATEGORIES) t[cat.id] = cat.values[0].key;
  return t as FrogTraits;
}

function randomTraits(): FrogTraits {
  const base = defaultTraits();
  for (const id of ACTIVE_CATEGORIES) {
    const values = CATEGORY_BY_ID[id].values;
    base[id] = values[Math.floor(Math.random() * values.length)].key;
  }
  return base;
}

export default function GenerateView() {
  const [traits, setTraits] = useState<FrogTraits>(defaultTraits);

  const setOne = (id: TraitCategoryId, key: string) =>
    setTraits((t) => ({ ...t, [id]: key }));

  const pickerCategories = useMemo(
    () => ACTIVE_CATEGORIES.map((id) => CATEGORY_BY_ID[id]),
    [],
  );

  return (
    <main className="flex min-h-screen flex-col">
      <PageNav />

      <section className="relative mx-auto w-full max-w-5xl px-4 py-8 sm:px-8">
        <header className="mb-6 text-center">
          <p className="tilt-r text-xs uppercase tracking-[0.3em] text-pencil">
            dev lab — not in the production game
          </p>
          <h1 className="mt-1 text-4xl text-ink sm:text-5xl">The Frog Lab</h1>
          <p className="mx-auto mt-2 max-w-lg text-ink-soft">
            Pick traits, watch Mr Frog rebuild — layer by layer.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          {/* Preview pane — sticks while you scroll pickers on desktop */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <div className="paper-card overflow-hidden rounded-3xl p-3 sm:p-4">
              <div className="overflow-hidden rounded-2xl border-2 border-paper-edge">
                <FrogImage traits={traits} priority />
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setTraits(randomTraits())}
                  className="rounded-xl bg-sage px-4 py-2 text-sm font-bold text-ink shadow-[0_3px_0_#7ba879] transition active:translate-y-0.5 active:shadow-none"
                >
                  Randomise ✦
                </button>
                <button
                  type="button"
                  onClick={() => setTraits(defaultTraits())}
                  className="paper-card rounded-xl px-4 py-2 text-sm text-ink-soft hover:text-ink"
                >
                  Reset
                </button>
              </div>
            </div>

            <CurrentTraits traits={traits} />
          </div>

          {/* Pickers — one row per active category, scrollable on mobile */}
          <div className="space-y-5">
            {pickerCategories.map((cat) => (
              <CategoryPicker
                key={cat.id}
                category={cat}
                selectedKey={traits[cat.id]}
                onPick={(key) => setOne(cat.id, key)}
              />
            ))}
            <p className="px-1 text-xs text-pencil">
              More layers (outfit, headwear, eyewear, held item, shoes, finish)
              will appear here as each one comes online.
            </p>
          </div>
        </div>
      </section>

      <footer className="px-6 py-8 text-center text-xs text-pencil">
        <p>The Frog Lab — dev only.</p>
      </footer>
    </main>
  );
}

// ─── Pickers ─────────────────────────────────────────────────────────────

function CategoryPicker({
  category,
  selectedKey,
  onPick,
}: {
  category: TraitCategory;
  selectedKey: string;
  onPick: (key: string) => void;
}) {
  const values = category.values;
  const idx = Math.max(
    0,
    values.findIndex((v) => v.key === selectedKey),
  );
  const current = values[idx];
  const step = (delta: number) => {
    const next = (idx + delta + values.length) % values.length;
    onPick(values[next].key);
  };

  return (
    <div className="paper-card rounded-2xl p-3 sm:p-4">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.18em] text-pencil">
            {category.label}
          </p>
          <p className="truncate text-lg text-ink">{current.label}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span className="mr-1 text-xs text-pencil">
            {idx + 1}/{values.length}
          </span>
          <StepButton label="Previous" onClick={() => step(-1)}>
            ‹
          </StepButton>
          <StepButton label="Next" onClick={() => step(+1)}>
            ›
          </StepButton>
        </div>
      </div>

      <div className="-mx-1 flex flex-wrap gap-2 px-1 pb-1">
        {values.map((v) => (
          <OptionTile
            key={v.key}
            category={category}
            value={v}
            selected={v.key === selectedKey}
            onClick={() => onPick(v.key)}
          />
        ))}
      </div>
    </div>
  );
}

function StepButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="paper-card grid h-8 w-8 place-items-center rounded-lg text-lg text-ink-soft hover:text-ink"
    >
      {children}
    </button>
  );
}

// One picker tile — figures out its own thumbnail based on the category.
function OptionTile({
  category,
  value,
  selected,
  onClick,
}: {
  category: TraitCategory;
  value: TraitValue;
  selected: boolean;
  onClick: () => void;
}) {
  const ring = selected
    ? "border-ink shadow-[0_4px_0_#2a2720]"
    : "border-paper-edge hover:border-pencil/40";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${category.label}: ${value.label}`}
      aria-pressed={selected}
      title={value.label}
      className={`group relative h-16 w-16 overflow-hidden rounded-xl border-2 bg-paper transition active:translate-y-0.5 ${ring}`}
    >
      <OptionThumb category={category} value={value} />
      {selected && (
        <span className="absolute -right-1 -top-1 rounded-full bg-ink px-1 text-[0.6rem] font-bold text-paper">
          ✓
        </span>
      )}
    </button>
  );
}

// Thumb dispatch — each render kind gets a sensible miniature so the
// picker reads at a glance.
function OptionThumb({
  category,
  value,
}: {
  category: TraitCategory;
  value: TraitValue;
}) {
  // Background — the scene itself, scaled to fit the tile.
  if (category.id === "background") {
    if (!value.layer) return <BlankThumb label={value.label} />;
    return (
      <img
        src={value.layer}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    );
  }

  // Frog colour — the canonical frog tinted, on a soft paper backdrop.
  if (category.id === "frogColour") {
    return (
      <div className="relative h-full w-full bg-paper-edge/60">
        <img
          src="/collection/layers/frog/none.png"
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-1 h-[calc(100%-0.5rem)] w-[calc(100%-0.5rem)] object-contain"
          style={value.filter ? { filter: value.filter } : undefined}
        />
      </div>
    );
  }

  // Outfit (frog-base) — miniature of the frog wearing it.
  if (category.render === "frog-base") {
    if (!value.layer) return <BlankThumb label={value.label} />;
    return (
      <img
        src={value.layer}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-contain"
      />
    );
  }

  // Other image categories (headwear/eyewear/heldItem/shoes) — miniature on
  // a faint silhouette so you can see where the accessory anchors.
  if (category.render === "image") {
    if (!value.layer) return <NoneThumb />;
    return (
      <div className="relative h-full w-full">
        <img
          src="/collection/layers/frog/none.png"
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain opacity-15"
          style={{ filter: "grayscale(1)" }}
        />
        <img
          src={value.layer}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain"
        />
      </div>
    );
  }

  // Finish — paint the overlay class onto a frog silhouette.
  if (category.render === "overlay") {
    return (
      <div className="relative h-full w-full bg-paper-edge/60">
        <img
          src="/collection/layers/frog/none.png"
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-1 h-[calc(100%-0.5rem)] w-[calc(100%-0.5rem)] object-contain"
        />
        {value.finishClass && (
          <div className={`fx-layer ${value.finishClass}`} />
        )}
      </div>
    );
  }

  return <BlankThumb label={value.label} />;
}

function NoneThumb() {
  return (
    <div className="grid h-full w-full place-items-center text-xs text-pencil">
      none
    </div>
  );
}

function BlankThumb({ label }: { label: string }) {
  return (
    <div className="grid h-full w-full place-items-center px-1 text-[0.6rem] leading-tight text-pencil">
      {label}
    </div>
  );
}

// ─── Current-traits summary ──────────────────────────────────────────────

function CurrentTraits({ traits }: { traits: FrogTraits }) {
  return (
    <div className="paper-card mt-4 rounded-2xl p-3 sm:p-4">
      <p className="mb-1 text-xs uppercase tracking-[0.18em] text-pencil">
        Current genome
      </p>
      <ul className="space-y-0.5 text-sm">
        {ACTIVE_CATEGORIES.map((id) => {
          const cat = CATEGORY_BY_ID[id];
          const value = cat.values.find((v) => v.key === traits[id]);
          return (
            <li
              key={id}
              className="flex items-baseline justify-between gap-2"
            >
              <span className="text-ink-soft">{cat.label}</span>
              <span className="flex-1 border-b border-dotted border-rule" />
              <span className="font-bold text-ink">{value?.label ?? "—"}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
