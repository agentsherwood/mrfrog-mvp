"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { allOriginals, arcs, type Original } from "../data/originals";
import {
  arcIcon,
  arcLayouts,
  sizeToSpan,
  standaloneSizes,
} from "../data/drawings-layout";
import FloatingSprite from "./FloatingSprite";
import Lightbox, { type LightboxImage } from "./Lightbox";

const tiltByIndex = ["tilt-l", "", "tilt-r", "", "tilt-l", "tilt-r"];

function toLightboxItem(o: Original): LightboxImage {
  return {
    src: `/originals/${o.slug}.jpg`,
    alt: o.caption,
    title: o.title,
    caption: o.caption,
  };
}

function Tile({
  original,
  spanClass,
  tilt,
  onOpen,
  sizeHint = "(max-width: 640px) 46vw, (max-width: 1024px) 24vw, 180px",
}: {
  original: Original;
  spanClass: string;
  tilt: string;
  onOpen: () => void;
  sizeHint?: string;
}) {
  return (
    <li className={`paper-card ${tilt} overflow-hidden rounded-xl ${spanClass}`}>
      <button
        type="button"
        onClick={onOpen}
        className="group relative block h-full w-full cursor-zoom-in text-left"
        aria-label={`Open ${original.title}`}
      >
        <Image
          src={`/originals/${original.slug}.jpg`}
          alt={original.caption}
          fill
          sizes={sizeHint}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-[#1a1814]/92 via-[#1a1814]/75 to-transparent p-2 text-[#faf6ec] transition-transform duration-200 group-hover:translate-y-0 sm:p-3">
          <p className="text-sm leading-tight font-bold sm:text-base">
            {original.title}
          </p>
          <p className="mt-0.5 line-clamp-2 text-xs leading-snug opacity-85 sm:text-sm">
            {original.caption}
          </p>
        </div>
      </button>
    </li>
  );
}

function ArcHeader({
  arcId,
  title,
  blurb,
  count,
}: {
  arcId: string;
  title: string;
  blurb?: string;
  count: number;
}) {
  const icon = arcIcon[arcId];
  return (
    <div className="mb-3 flex items-center gap-3 border-b border-black/10 pb-2">
      {icon && (
        <div className="float-sway shrink-0">
          <Image
            src={icon.src}
            alt=""
            width={32}
            height={32}
            className="h-7 w-7 object-contain sm:h-8 sm:w-8"
          />
        </div>
      )}
      <h3 className="text-lg text-ink sm:text-xl">{title}</h3>
      {blurb && (
        <span className="hidden truncate text-xs text-ink-soft sm:inline sm:text-sm">
          &middot; {blurb}
        </span>
      )}
      <span className="ml-auto shrink-0 text-xs text-pencil sm:text-sm">
        {count} {count === 1 ? "scene" : "scenes"}
      </span>
    </div>
  );
}

export default function Originals() {
  const flat = allOriginals;
  const items = useMemo<LightboxImage[]>(() => flat.map(toLightboxItem), [flat]);

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const step = (delta: number) => {
    setOpenIndex((i) => {
      if (i === null) return null;
      return (i + delta + items.length) % items.length;
    });
  };

  const indexOfSlug = (slug: string) => flat.findIndex((o) => o.slug === slug);

  const storyArcs = arcs.filter((a) => a.id !== "more");
  const moreArc = arcs.find((a) => a.id === "more");

  return (
    <section className="relative overflow-hidden px-4 py-10 sm:px-8">
      <FloatingSprite
        src="/elements/nature/daisy-yellow.png"
        alt=""
        size={44}
        position="left-3 top-10 sm:left-8"
        loop="float-sway"
        behind
      />
      <FloatingSprite
        src="/elements/nature/daisy-white.png"
        alt=""
        size={36}
        position="right-4 top-28 sm:right-12"
        loop="float-bob"
        behind
        delayMs={500}
      />
      <FloatingSprite
        src="/elements/emotion/sparkle.png"
        alt=""
        size={28}
        position="right-6 bottom-24"
        loop="sparkle"
        behind
        delayMs={300}
      />
      <FloatingSprite
        src="/elements/emotion/heart-burst.png"
        alt=""
        size={34}
        position="left-4 top-[48%]"
        loop="float-bob"
        behind
        delayMs={900}
      />
      <FloatingSprite
        src="/elements/nature/rainbow.png"
        alt=""
        size={56}
        position="right-2 top-[64%]"
        loop="float-sway"
        behind
        delayMs={700}
      />
      <FloatingSprite
        src="/elements/emotion/starburst.png"
        alt=""
        size={36}
        position="left-6 bottom-10"
        loop="sparkle"
        behind
        delayMs={200}
      />

      <div className="mx-auto max-w-[1400px]">
        <header className="mb-8 text-center">
          <p className="tilt-r text-xs uppercase tracking-[0.3em] text-pencil">
            the notebook
          </p>
          <h2 className="mt-1 text-3xl text-ink sm:text-5xl">
            Amelia&rsquo;s drawings
          </h2>
          <p className="mx-auto mt-1 max-w-xl text-sm text-ink-soft sm:text-base">
            Tap anything to zoom.
          </p>
        </header>

        <div className="space-y-10 sm:space-y-12">
          {storyArcs.map((arc, arcIdx) => {
            const layout = arcLayouts[arc.id];
            if (!layout) return null;
            return (
              <div key={arc.id}>
                <ArcHeader
                  arcId={arc.id}
                  title={arc.title}
                  blurb={arc.blurb}
                  count={arc.originals.length}
                />
                <ul
                  className={`grid gap-3 ${layout.gridCols} ${layout.rowHeight}`}
                  style={{ gridAutoFlow: "dense" }}
                >
                  {arc.originals.map((o, i) => {
                    const spanClass = layout.tiles[o.slug] ?? "";
                    return (
                      <Tile
                        key={o.slug}
                        original={o}
                        spanClass={spanClass}
                        tilt={tiltByIndex[(arcIdx + i) % tiltByIndex.length]}
                        onOpen={() => setOpenIndex(indexOfSlug(o.slug))}
                      />
                    );
                  })}
                </ul>
              </div>
            );
          })}

          {moreArc && (
            <div>
              <ArcHeader
                arcId="more"
                title={moreArc.title}
                blurb={moreArc.blurb}
                count={moreArc.originals.length}
              />
              <ul
                className="grid auto-rows-[140px] grid-cols-2 gap-3 sm:auto-rows-[170px] sm:grid-cols-4 lg:auto-rows-[200px] lg:grid-cols-6"
                style={{ gridAutoFlow: "dense" }}
              >
                {moreArc.originals.map((o, i) => {
                  const size = standaloneSizes[o.slug] ?? "s";
                  const spanClass = sizeToSpan[size];
                  const hint =
                    size === "l"
                      ? "(max-width: 640px) 96vw, (max-width: 1024px) 48vw, 460px"
                      : size === "m"
                        ? "(max-width: 640px) 96vw, (max-width: 1024px) 48vw, 310px"
                        : "(max-width: 640px) 46vw, (max-width: 1024px) 24vw, 180px";
                  return (
                    <Tile
                      key={o.slug}
                      original={o}
                      spanClass={spanClass}
                      tilt={tiltByIndex[i % tiltByIndex.length]}
                      onOpen={() => setOpenIndex(indexOfSlug(o.slug))}
                      sizeHint={hint}
                    />
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      <Lightbox
        items={items}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onStep={step}
      />
    </section>
  );
}
