"use client";

import Image from "next/image";
import { useState } from "react";

import {
  animals,
  celebration,
  characterSheet,
  emotion,
  everyday,
  farm,
  mrsFrog,
  nature,
  poses,
  teddies,
  vehicles,
  type Sprite,
  type SpriteGroup,
} from "../data/sprites";
import FloatingSprite from "./FloatingSprite";

const poseAction: Record<string, string> = {
  jump: "performing-jump",
  fall: "performing-bounce",
  run: "performing-run",
  walk: "performing-bounce",
  dance: "performing-dance",
  wave: "performing-wiggle",
  point: "performing-wiggle",
  read: "performing-bounce",
  stretch: "performing-bounce",
  "sit-think": "performing-wiggle",
  sleep: "performing-pop",
  cry: "performing-wiggle",
  happy: "performing-bounce",
  sad: "performing-wiggle",
  surprised: "performing-pop",
  front: "performing-bounce",
  "\u00be view": "performing-bounce",
  side: "performing-run",
  cross: "performing-wiggle",
};

function InteractiveSprite({
  src,
  label,
  size = 120,
  say,
}: {
  src: string;
  label: string;
  size?: number;
  say?: string;
}) {
  const [performing, setPerforming] = useState<string | null>(null);

  const play = () => {
    const anim = poseAction[label] ?? "performing-bounce";
    setPerforming(anim);
    window.setTimeout(() => setPerforming(null), 900);
  };

  return (
    <li className="relative flex flex-col items-center gap-1">
      <div
        className="paper-card relative flex h-full w-full items-end justify-center rounded-xl p-2"
        style={{ minHeight: size + 24 }}
      >
        <button
          type="button"
          onClick={play}
          aria-label={`Play ${label}`}
          className="sprite-btn relative block"
          style={{ width: size, height: size }}
        >
          <div
            className={performing ?? ""}
            style={{ width: size, height: size }}
          >
            <Image
              src={src}
              alt={label}
              width={size}
              height={size}
              className="h-full w-full object-contain"
              loading="lazy"
            />
          </div>
          {say && <span className="speech">{say}</span>}
        </button>
      </div>
      <p className="text-xs text-ink-soft sm:text-sm">{label}</p>
    </li>
  );
}

function SpriteRow({
  group,
  cols,
  size = 120,
  sayMap,
}: {
  group: SpriteGroup;
  cols: string;
  size?: number;
  sayMap?: Record<string, string>;
}) {
  return (
    <div className="mb-8">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="text-xl text-ink sm:text-2xl">{group.title}</h3>
        {group.blurb && (
          <p className="hidden text-xs text-ink-soft sm:block sm:text-sm">
            {group.blurb}
          </p>
        )}
      </div>
      <ul className={`grid gap-3 ${cols}`}>
        {group.sprites.map((s: Sprite) => (
          <InteractiveSprite
            key={`${group.basePath}/${s.file}`}
            src={`${group.basePath}/${s.file}`}
            label={s.label}
            size={size}
            say={sayMap?.[s.label]}
          />
        ))}
      </ul>
    </div>
  );
}

const poseSays: Record<string, string> = {
  jump: "wheee!",
  dance: "shakira shakira",
  run: "go go go",
  wave: "hi Amelia",
  sleep: "zzzz",
  cry: "waaaah",
};

const everydaySays: Record<string, string> = {
  "tomato Bob": "I love you bob",
  radio: "shakira shakira",
  washer: "splish",
};

const natureSays: Record<string, string> = {
  "lily pad": "ribbit",
  rainbow: "la la tooloo eee",
};

const celebrationSays: Record<string, string> = {
  cake: "make a wish",
  "12": "Amelia!",
  balloons: "hold tight",
};

const animalSays: Record<string, string> = {
  cow: "moo",
  pig: "oink",
  sheep: "baa",
  "fluffy sheep": "baa baa",
  rooster: "cock-a-doodle",
  chicken: "cluck",
  horse: "neigh",
  goat: "meh",
  duck: "quack",
  dog: "woof",
  cat: "meow",
  chick: "peep",
  mouse: "squeak",
};

const vehicleSays: Record<string, string> = {
  "red car": "beep beep",
  taxi: "where to?",
  bus: "all aboard",
  "fire engine": "nee naw",
  "ice cream": "dingly ding",
  police: "woop woop",
  scooter: "brrrr",
  bicycle: "ding ding",
};

const farmSays: Record<string, string> = {
  "red tractor": "chug chug",
  loader: "scoopy",
  "small tractor": "putter",
  "watering can": "splish splish",
};

const teddySays: Record<string, string> = {
  "brown bear": "hug me",
  panda: "bamboo please",
  bunny: "hop",
  pyjamas: "bedtime",
  sleepy: "zzzz",
  "big sleeping": "shhh",
  patched: "still here",
};

export default function Sprites() {
  return (
    <section id="sprites" className="relative overflow-hidden bg-paper-edge/40 px-4 py-12 sm:px-8">
      {/* decoration */}
      <FloatingSprite
        src="/elements/nature/sun.png"
        alt=""
        size={70}
        position="right-4 top-4 sm:right-10"
        loop="float-sway"
        perform="performing-spin"
        say="sunny"
        behind
      />
      <FloatingSprite
        src="/elements/nature/lily-pad.png"
        alt=""
        size={56}
        position="left-2 bottom-4 sm:left-6"
        loop="float-bob"
        behind
      />

      <div className="mx-auto max-w-6xl">
        <header className="mb-6 text-center">
          <h2 className="mt-1 text-3xl text-ink sm:text-5xl">Mr Frog&rsquo;s world</h2>
          <p className="mx-auto mt-1 max-w-xl text-sm text-ink-soft sm:text-base">
            Tap anyone.
          </p>
        </header>

        <SpriteRow
          group={characterSheet}
          cols="grid-cols-3 sm:grid-cols-6"
          size={100}
        />
        <SpriteRow
          group={poses}
          cols="grid-cols-3 sm:grid-cols-4 lg:grid-cols-6"
          size={96}
          sayMap={poseSays}
        />
        <SpriteRow
          group={mrsFrog}
          cols="grid-cols-3 sm:grid-cols-6"
          size={100}
        />
        <SpriteRow
          group={nature}
          cols="grid-cols-4 sm:grid-cols-6 lg:grid-cols-12"
          size={80}
          sayMap={natureSays}
        />
        <SpriteRow
          group={everyday}
          cols="grid-cols-4 sm:grid-cols-6 lg:grid-cols-12"
          size={80}
          sayMap={everydaySays}
        />
        <SpriteRow
          group={emotion}
          cols="grid-cols-4 sm:grid-cols-6 lg:grid-cols-12"
          size={70}
        />
        <SpriteRow
          group={celebration}
          cols="grid-cols-4 sm:grid-cols-6 lg:grid-cols-12"
          size={80}
          sayMap={celebrationSays}
        />
        <SpriteRow
          group={animals}
          cols="grid-cols-3 sm:grid-cols-5 lg:grid-cols-7"
          size={100}
          sayMap={animalSays}
        />
        <SpriteRow
          group={vehicles}
          cols="grid-cols-3 sm:grid-cols-4 lg:grid-cols-6"
          size={100}
          sayMap={vehicleSays}
        />
        <SpriteRow
          group={farm}
          cols="grid-cols-3 sm:grid-cols-5 lg:grid-cols-7"
          size={100}
          sayMap={farmSays}
        />
        <SpriteRow
          group={teddies}
          cols="grid-cols-3 sm:grid-cols-5 lg:grid-cols-7"
          size={100}
          sayMap={teddySays}
        />
      </div>
    </section>
  );
}
