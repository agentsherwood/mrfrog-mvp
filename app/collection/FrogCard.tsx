// A single cell in the collection grid — an owned frog, or an identical
// greyed mystery silhouette for one not yet collected.

import FrogImage, { MysteryFrog } from "../components/FrogImage";
import type { Frog } from "../lib/collection/types";
import { TIER_STYLE } from "./lib/rarity";

const TILTS = ["-1.1deg", "0.8deg", "1.2deg", "-0.7deg", "0.5deg", "-1.3deg"];

function CardShell({
  tilt,
  onClick,
  label,
  children,
  ring,
}: {
  tilt: string;
  onClick: () => void;
  label: string;
  ring: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="frog-card group relative block w-full"
      style={{ transform: `rotate(${tilt})` }}
    >
      <div
        className="paper-card overflow-hidden rounded-2xl"
        style={{ borderColor: ring, borderWidth: 2 }}
      >
        {children}
      </div>
    </button>
  );
}

export default function FrogCard({
  frog,
  owned,
  onClick,
}: {
  frog: Frog;
  owned: boolean;
  onClick: () => void;
}) {
  const tilt = TILTS[frog.id % TILTS.length];
  const idLabel = `#${frog.id.toLocaleString()}`;

  if (!owned) {
    return (
      <CardShell
        tilt={tilt}
        onClick={onClick}
        ring="rgba(0,0,0,0.06)"
        label={`Frog ${idLabel}, not collected`}
      >
        <div className="relative aspect-square bg-paper-edge/50">
          <MysteryFrog />
          <span className="absolute inset-0 flex items-center justify-center text-4xl text-pencil/40">
            ?
          </span>
        </div>
        <p className="bg-paper-edge/60 py-1 text-center text-xs text-pencil sm:text-sm">
          {idLabel}
        </p>
      </CardShell>
    );
  }

  const style = TIER_STYLE[frog.tier];
  return (
    <CardShell
      tilt={tilt}
      onClick={onClick}
      ring={style.accent}
      label={`Frog ${idLabel}, ${style.label}`}
    >
      <div className="relative" style={{ background: style.soft }}>
        <FrogImage traits={frog.traits} />
        <span
          className="absolute right-1.5 top-1.5 rounded-md px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-white sm:text-[0.65rem]"
          style={{ background: style.accent }}
        >
          {style.label}
        </span>
      </div>
      <p
        className="py-1 text-center text-xs font-bold sm:text-sm"
        style={{ background: style.soft, color: style.ink }}
      >
        {idLabel}
      </p>
    </CardShell>
  );
}
