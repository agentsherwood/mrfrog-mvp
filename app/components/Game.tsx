"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// next/dynamic with ssr:false means Next never renders GameCanvas on the
// server — the Phaser module graph (which touches `window` at import time)
// stays out of any server bundle, and the client fetches a single chunk
// instead of the dev-mode's per-file chunks that can hang on mobile.
const GameCanvas = dynamic(() => import("./GameCanvas"), {
  ssr: false,
  loading: () => (
    <div
      className="relative flex aspect-[400/640] w-full max-w-[400px] items-center justify-center overflow-hidden rounded-xl bg-[#0b3d5c] text-sm text-white shadow-lg"
      style={{ touchAction: "none" }}
    >
      loading engine…
    </div>
  ),
});

export default function Game() {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 10_000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-6 sm:px-8">
      <GameCanvas />
      <p className="mt-4 text-center text-xs text-pencil">
        tap the sides of the screen to move · arrows or A/D on desktop
      </p>
      {slow && (
        <p className="mt-2 text-center text-[11px] text-pencil opacity-80">
          still loading? try closing this tab and reopening it.
        </p>
      )}
    </div>
  );
}
