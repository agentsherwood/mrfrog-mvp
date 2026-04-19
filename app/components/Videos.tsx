"use client";

import { useEffect, useRef } from "react";

import { clips } from "../data/videos";
import FloatingSprite from "./FloatingSprite";

function Clip({
  src,
  title,
  caption,
}: {
  src: string;
  title: string;
  caption: string;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const target = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            target.play().catch(() => {});
          } else {
            target.pause();
          }
        }
      },
      { threshold: 0.35 },
    );

    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <figure className="paper-card tilt-l overflow-hidden rounded-xl">
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        controls
        className="h-auto w-full bg-paper-edge"
      />
      <figcaption className="px-3 py-1.5">
        <p className="text-sm text-ink sm:text-base">{title}</p>
        <p className="text-xs text-ink-soft sm:text-sm">{caption}</p>
      </figcaption>
    </figure>
  );
}

export default function Videos() {
  return (
    <section id="videos" className="relative overflow-hidden px-4 py-12 sm:px-8">
      <FloatingSprite
        src="/elements/celebration/popper.png"
        alt=""
        size={52}
        position="left-4 top-6 sm:left-10"
        loop="float-bob"
        perform="performing-wiggle"
        say="pop!"
        behind
      />
      <FloatingSprite
        src="/elements/everyday/music-notes.png"
        alt=""
        size={44}
        position="right-4 top-4 sm:right-12"
        loop="float-drift"
        behind
        delayMs={400}
      />

      <div className="mx-auto max-w-6xl">
        <header className="mb-6 text-center">
          <p className="tilt-r text-xs uppercase tracking-[0.3em] text-pencil">
            section three
          </p>
          <h2 className="mt-1 text-3xl text-ink sm:text-5xl">Videos</h2>
          <p className="mx-auto mt-1 max-w-xl text-sm text-ink-soft sm:text-base">
            Early experiments. Sound off.
          </p>
        </header>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clips.map((c) => (
            <li key={c.file}>
              <Clip src={c.file} title={c.title} caption={c.caption} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
