"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

type Props = {
  src: string;
  alt: string;
  size: number;
  /** tailwind positioning classes, e.g. "top-6 left-4" */
  position: string;
  /** base idle animation class */
  loop?: "float-sway" | "float-bob" | "float-drift" | "sparkle" | "idle-bounce" | "";
  /** click reaction class */
  perform?:
    | "performing-bounce"
    | "performing-jump"
    | "performing-dance"
    | "performing-spin"
    | "performing-pop"
    | "performing-wiggle";
  /** optional speech bubble text shown on hover */
  say?: string;
  /** optional rotation offset applied to the outer wrapper */
  tilt?: number;
  /** optional extra delay to decorrelate loops */
  delayMs?: number;
  /** lower the z-index so sprite sits behind content */
  behind?: boolean;
};

export default function FloatingSprite({
  src,
  alt,
  size,
  position,
  loop = "float-sway",
  perform = "performing-bounce",
  say,
  tilt = 0,
  delayMs = 0,
  behind = false,
}: Props) {
  const [performing, setPerforming] = useState(false);

  const onClick = useCallback(() => {
    setPerforming(true);
    window.setTimeout(() => setPerforming(false), 900);
  }, []);

  return (
    <div
      className={`pointer-events-none absolute ${position} ${behind ? "z-0" : "z-10"}`}
      style={{ width: size, height: size, transform: `rotate(${tilt}deg)` }}
      aria-hidden={!say}
    >
      <div
        className={performing ? perform : loop}
        style={{ animationDelay: `${delayMs}ms` }}
      >
        <button
          type="button"
          onClick={onClick}
          aria-label={say ?? alt}
          className="sprite-btn pointer-events-auto relative block"
          style={{ width: size, height: size }}
        >
          <Image
            src={src}
            alt={alt}
            width={size}
            height={size}
            className="h-full w-full object-contain"
            loading="lazy"
          />
          {say && <span className="speech">{say}</span>}
        </button>
      </div>
    </div>
  );
}
