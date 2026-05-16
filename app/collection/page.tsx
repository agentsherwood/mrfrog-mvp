"use client";

// /collection — placeholder preview (task 2291). Verifies the FrogImage
// compositor against the 10k manifest before the real grid lands in 2292.

import { useEffect, useState } from "react";

import FrogImage from "../components/FrogImage";
import PageNav from "../components/PageNav";
import { TIERS } from "../data/collection-traits";
import type { Frog } from "../lib/collection/types";

export default function CollectionPage() {
  const [frogs, setFrogs] = useState<Frog[] | null>(null);

  useEffect(() => {
    fetch("/collection/collection.json")
      .then((r) => r.json())
      .then((data: Frog[]) => setFrogs(data))
      .catch(() => setFrogs([]));
  }, []);

  return (
    <main className="flex min-h-screen flex-col">
      <PageNav />
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8">
        <header className="mb-8 text-center">
          <p className="tilt-r text-xs uppercase tracking-[0.3em] text-pencil">
            10,000 frogs
          </p>
          <h1 className="mt-1 text-3xl text-ink sm:text-5xl">
            The Mr Frog Collection
          </h1>
          <p className="mx-auto mt-1 max-w-xl text-sm text-ink-soft sm:text-base">
            Compositor preview — the full collectible grid arrives in task 2292.
          </p>
        </header>

        {frogs === null && (
          <p className="text-center text-ink-soft">Loading the pond…</p>
        )}
        {frogs?.length === 0 && (
          <p className="text-center text-red">
            Couldn&rsquo;t load collection.json — run{" "}
            <code>npm run collection:gen</code>.
          </p>
        )}

        {frogs && frogs.length > 0 && (
          <div className="space-y-10">
            {/* one large hero render */}
            <div className="mx-auto max-w-sm">
              <FrogImage
                traits={frogs[0].traits}
                className="paper-card rounded-2xl"
                priority
              />
              <p className="mt-2 text-center text-sm text-ink-soft">
                #{frogs[0].id} {frogs[0].name ?? ""} — {frogs[0].tier}
              </p>
            </div>

            {/* a row of sample frogs per tier */}
            {TIERS.map((tier) => {
              const sample = frogs
                .filter((f) => f.tier === tier.key)
                .slice(0, 8);
              return (
                <div key={tier.key}>
                  <h2 className="mb-3 text-xl text-ink sm:text-2xl">
                    {tier.label}{" "}
                    <span className="text-sm text-pencil">
                      ({tier.count})
                    </span>
                  </h2>
                  <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-8">
                    {sample.map((f) => (
                      <li key={f.id}>
                        <FrogImage
                          traits={f.traits}
                          className="paper-card rounded-xl"
                        />
                        <p className="mt-1 text-center text-xs text-ink-soft">
                          #{f.id}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
