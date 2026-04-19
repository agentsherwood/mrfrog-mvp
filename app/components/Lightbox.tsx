"use client";

import Image from "next/image";
import { useCallback, useEffect } from "react";

export type LightboxImage = {
  src: string;
  alt: string;
  title?: string;
  caption?: string;
};

type Props = {
  items: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onStep: (delta: number) => void;
};

export default function Lightbox({ items, index, onClose, onStep }: Props) {
  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (index === null) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onStep(-1);
      if (e.key === "ArrowRight") onStep(1);
    },
    [index, onClose, onStep],
  );

  useEffect(() => {
    if (index === null) return;
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [index, onKey]);

  if (index === null) return null;
  const item = items[index];
  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title ?? item.alt}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1814]/88 p-4 backdrop-blur-sm"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close"
        className="absolute right-4 top-4 rounded-full bg-paper px-3 py-1 text-xl text-ink shadow"
      >
        &times;
      </button>

      {items.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStep(-1);
            }}
            aria-label="Previous"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-paper/90 px-3 py-2 text-xl text-ink shadow sm:left-6"
          >
            &larr;
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStep(1);
            }}
            aria-label="Next"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-paper/90 px-3 py-2 text-xl text-ink shadow sm:right-6"
          >
            &rarr;
          </button>
        </>
      )}

      <figure
        onClick={(e) => e.stopPropagation()}
        className="paper-card relative flex max-h-[90vh] w-full max-w-4xl flex-col items-center gap-3 rounded-xl p-4 sm:p-6"
      >
        <div className="relative h-[60vh] w-full sm:h-[70vh]">
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(max-width: 640px) 92vw, 900px"
            className="object-contain"
            priority
          />
        </div>
        {(item.title || item.caption) && (
          <figcaption className="text-center text-ink-soft">
            {item.title && (
              <p className="text-lg text-ink sm:text-xl">{item.title}</p>
            )}
            {item.caption && (
              <p className="mt-1 text-sm sm:text-base">{item.caption}</p>
            )}
          </figcaption>
        )}
        {items.length > 1 && (
          <p className="text-xs text-pencil">
            {index + 1} / {items.length}
          </p>
        )}
      </figure>
    </div>
  );
}
