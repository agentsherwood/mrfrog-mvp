"use client";

// The Collection — browse all the frogs, open packs, chase rarity.

import { useEffect, useMemo, useState } from "react";

import { tierCounts } from "../data/collection-traits";
import type { Frog, TierKey } from "../lib/collection/types";
import PageNav from "../components/PageNav";
import FrogCard from "./FrogCard";
import FrogDetail from "./FrogDetail";
import PackOpening from "./PackOpening";
import { drawPack } from "./lib/packs";
import { PACK_PRICE, useCollection } from "./lib/store";
import { TIER_ORDER, TIER_STYLE } from "./lib/rarity";

type Filter = "all" | "owned" | "missing";
type Sort = "number" | "rarity";

export default function CollectionView() {
  const store = useCollection();
  const [frogs, setFrogs] = useState<Frog[] | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("number");
  const [selected, setSelected] = useState<Frog | null>(null);
  const [pack, setPack] = useState<Frog[] | null>(null);

  useEffect(() => {
    fetch("/collection/collection.json")
      .then((r) => r.json())
      .then((data: Frog[]) => setFrogs(data))
      .catch(() => setFrogs([]));
  }, []);

  const total = frogs?.length ?? 0;
  const ownedCount = store.owned.size;
  const poolLeft = total - ownedCount;

  const tierTotals = useMemo(() => tierCounts(total), [total]);
  const tierOwned = useMemo(() => {
    const m: Record<string, number> = {};
    if (frogs) {
      for (const f of frogs) {
        if (store.owned.has(f.id)) m[f.tier] = (m[f.tier] ?? 0) + 1;
      }
    }
    return m;
  }, [frogs, store.owned]);

  const visible = useMemo(() => {
    if (!frogs) return [];
    let list = frogs;
    if (filter === "owned") list = list.filter((f) => store.owned.has(f.id));
    if (filter === "missing") list = list.filter((f) => !store.owned.has(f.id));
    return [...list].sort((a, b) =>
      sort === "rarity" ? a.rarityRank - b.rarityRank : a.id - b.id,
    );
  }, [frogs, filter, sort, store.owned]);

  function openBoughtPack() {
    if (poolLeft <= 0 || !frogs || store.coins < PACK_PRICE) return;
    store.spendCoins(PACK_PRICE);
    setPack(drawPack(frogs, store.owned));
  }

  function openFreePack() {
    if (poolLeft <= 0 || !frogs) return;
    store.claimDaily();
    setPack(drawPack(frogs, store.owned));
  }

  function finishPack() {
    if (pack) store.addOwned(pack.map((f) => f.id));
    setPack(null);
  }

  const loading = !store.ready || frogs === null;

  return (
    <main className="flex min-h-screen flex-col">
      <PageNav />

      <section className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
        <header className="mb-6 text-center">
          <p className="tilt-r text-xs uppercase tracking-[0.3em] text-pencil">
            a frog for every page
          </p>
          <h1 className="mt-1 text-4xl text-ink sm:text-6xl">
            The Mr Frog Collection
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-ink-soft">
            Open packs, fill the grid, chase the rarest frogs.
          </p>
        </header>

        {loading ? (
          <p className="py-20 text-center text-ink-soft">Loading the pond…</p>
        ) : total === 0 ? (
          <p className="py-20 text-center text-red">
            Couldn&rsquo;t load the collection — run{" "}
            <code>npm run collection:gen</code>.
          </p>
        ) : (
          <>
            {/* coins + pack actions */}
            <div className="paper-card mb-4 flex flex-wrap items-center justify-center gap-3 rounded-2xl p-3 sm:gap-5 sm:p-4">
              <span className="flex items-center gap-2 text-lg text-ink">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sun text-sm font-bold text-ink shadow-inner">
                  ¢
                </span>
                <strong>{store.coins.toLocaleString()}</strong> coins
              </span>
              <button
                type="button"
                onClick={openBoughtPack}
                disabled={store.coins < PACK_PRICE || poolLeft <= 0}
                className="rounded-xl bg-red px-5 py-2.5 text-lg font-bold text-paper shadow-[0_3px_0_#b8554c] transition active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-40"
              >
                Open a pack · {PACK_PRICE}¢
              </button>
              <button
                type="button"
                onClick={openFreePack}
                disabled={!store.dailyAvailable || poolLeft <= 0}
                className="rounded-xl bg-sage px-5 py-2.5 text-lg font-bold text-ink shadow-[0_3px_0_#7ba879] transition active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-40"
              >
                {store.dailyAvailable ? "Free daily pack ✦" : "Daily pack claimed"}
              </button>
            </div>

            {/* stats strip */}
            <div className="paper-card mb-4 rounded-2xl p-3 sm:p-4">
              <div className="flex flex-wrap items-baseline justify-center gap-x-5 gap-y-1">
                <span className="text-lg text-ink">
                  <strong>{ownedCount}</strong>
                  <span className="text-ink-soft"> / {total} collected</span>
                </span>
                <span className="text-ink-soft">
                  {total > 0 ? Math.round((ownedCount / total) * 100) : 0}% of the pool
                </span>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                {TIER_ORDER.map((tier: TierKey) => (
                  <span
                    key={tier}
                    className="rounded-md px-2 py-0.5 text-xs font-bold"
                    style={{
                      background: TIER_STYLE[tier].soft,
                      color: TIER_STYLE[tier].ink,
                    }}
                  >
                    {TIER_STYLE[tier].label} {tierOwned[tier] ?? 0}/{tierTotals[tier]}
                  </span>
                ))}
              </div>
            </div>

            {/* filters */}
            <div className="mb-5 flex flex-wrap items-center justify-center gap-2 text-sm">
              <div className="flex gap-1">
                {(["all", "owned", "missing"] as Filter[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={`rounded-lg px-3 py-1.5 capitalize ${
                      filter === f
                        ? "bg-ink text-paper"
                        : "paper-card text-ink-soft hover:text-ink"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <span className="text-pencil">·</span>
              <div className="flex gap-1">
                {(["number", "rarity"] as Sort[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSort(s)}
                    className={`rounded-lg px-3 py-1.5 capitalize ${
                      sort === s
                        ? "bg-ink text-paper"
                        : "paper-card text-ink-soft hover:text-ink"
                    }`}
                  >
                    by {s}
                  </button>
                ))}
              </div>
            </div>

            {/* grid */}
            {visible.length === 0 ? (
              <p className="py-16 text-center text-ink-soft">
                {filter === "owned"
                  ? "No frogs yet — open a pack to start your collection!"
                  : "Nothing to show."}
              </p>
            ) : (
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5">
                {visible.map((frog) => (
                  <li key={frog.id}>
                    <FrogCard
                      frog={frog}
                      owned={store.owned.has(frog.id)}
                      onClick={() => setSelected(frog)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>

      <footer className="px-6 py-8 text-center text-xs text-pencil">
        <p>The Mr Frog Collection — a frog for every page.</p>
      </footer>

      {selected && (
        <FrogDetail
          frog={selected}
          owned={store.owned.has(selected.id)}
          total={total}
          onClose={() => setSelected(null)}
        />
      )}
      {pack && <PackOpening frogs={pack} onDone={finishPack} />}
    </main>
  );
}
