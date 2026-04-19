"use client";

import { useEffect, useRef, useState } from "react";
import type Phaser from "phaser";
import { createGame } from "../game/engine/createGame";

type Status = "starting" | "ready" | "error";

export default function GameCanvas() {
  const parentRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("starting");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (!parentRef.current) return;
    let game: Phaser.Game | undefined;

    try {
      game = createGame(parentRef.current);
      setStatus("ready");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[GameCanvas] createGame threw", err);
      setErrorMsg(`create: ${msg}`);
      setStatus("error");
    }

    return () => {
      game?.destroy(true);
      game = undefined;
    };
  }, []);

  return (
    <div
      ref={parentRef}
      className="relative aspect-[400/640] w-full max-w-[400px] touch-none overflow-hidden rounded-xl bg-[#0b3d5c] shadow-lg"
      style={{ touchAction: "none" }}
    >
      {status !== "ready" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center text-sm text-white">
          {status === "starting" && <p>starting Mr Frog…</p>}
          {status === "error" && (
            <>
              <p className="font-bold">couldn&rsquo;t start the game</p>
              <p className="break-all text-xs opacity-80">{errorMsg}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-2 rounded bg-white/10 px-3 py-1 text-xs"
              >
                reload
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
