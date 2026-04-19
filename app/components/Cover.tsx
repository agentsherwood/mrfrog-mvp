"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";

import FloatingSprite from "./FloatingSprite";

export default function Cover() {
  const [froggyWiggle, setFroggyWiggle] = useState(false);

  const poke = useCallback(() => {
    setFroggyWiggle(true);
    window.setTimeout(() => setFroggyWiggle(false), 900);
  }, []);

  return (
    <section
      id="cover"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-16 pb-10 text-center sm:pt-20"
    >
      {/* bunting across the top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex h-16 justify-center opacity-90 sm:h-20">
        <Image
          src="/elements/celebration/bunting.png"
          alt=""
          width={1200}
          height={160}
          className="h-full w-full object-contain object-top"
          priority
        />
      </div>

      <FloatingSprite
        src="/elements/celebration/balloons.png"
        alt="balloons"
        size={80}
        position="left-4 top-24 sm:left-10 sm:top-28"
        loop="float-drift"
        perform="performing-pop"
        say="pop!"
        tilt={-8}
      />
      <FloatingSprite
        src="/elements/celebration/gift-pink.png"
        alt="a pink present"
        size={64}
        position="right-6 top-28 sm:right-14 sm:top-32"
        loop="float-bob"
        perform="performing-wiggle"
        say="open me?"
        tilt={6}
        delayMs={600}
      />
      <FloatingSprite
        src="/elements/celebration/number-12.png"
        alt="twelve"
        size={72}
        position="right-3 top-6 sm:right-12 sm:top-6"
        loop="float-sway"
        perform="performing-spin"
        say="twelve!"
        tilt={8}
        delayMs={300}
      />
      <FloatingSprite
        src="/elements/emotion/sparkle.png"
        alt=""
        size={40}
        position="left-8 top-[42%]"
        loop="sparkle"
        delayMs={200}
      />
      <FloatingSprite
        src="/elements/emotion/sparkle.png"
        alt=""
        size={28}
        position="right-14 top-[56%]"
        loop="sparkle"
        delayMs={900}
      />
      <FloatingSprite
        src="/elements/emotion/starburst.png"
        alt=""
        size={44}
        position="left-1/3 top-6"
        loop="sparkle"
        delayMs={500}
      />
      <FloatingSprite
        src="/elements/celebration/cake.png"
        alt="a cake"
        size={84}
        position="bottom-32 left-6 sm:bottom-36 sm:left-14"
        loop="float-sway"
        perform="performing-pop"
        say="make a wish"
        tilt={-4}
      />
      <FloatingSprite
        src="/elements/celebration/popper.png"
        alt="a party popper"
        size={64}
        position="bottom-32 right-6 sm:bottom-36 sm:right-14"
        loop="float-bob"
        perform="performing-wiggle"
        say="hooray!"
        tilt={10}
        delayMs={400}
      />
      <FloatingSprite
        src="/elements/emotion/heart-burst.png"
        alt=""
        size={36}
        position="left-10 top-[70%]"
        loop="float-bob"
        delayMs={700}
      />

      <p className="tilt-l relative z-20 mt-4 text-xs uppercase tracking-[0.3em] text-pencil">
        a notebook present
      </p>
      <h1 className="wobble-in relative z-20 mt-2 max-w-3xl text-5xl leading-tight text-ink sm:text-7xl">
        Happy Birthday
        <br />
        <span className="text-red">Amelia</span>
        <span aria-hidden className="ml-3 inline-block align-middle text-4xl sm:text-6xl">
          {"\u{1F382}"}
        </span>
      </h1>
      <p className="wobble-in relative z-20 mt-3 max-w-xl text-xl text-ink-soft sm:text-2xl">
        Welcome to <span className="text-sage">Mr Frog&rsquo;s World</span>
      </p>
      <p className="relative z-20 mt-1 text-sm text-pencil sm:text-base">
        made for you, by Toby &amp; Amelia
      </p>

      <div className="relative z-20 mt-6 h-44 w-44 sm:h-56 sm:w-56">
        <button
          type="button"
          onClick={poke}
          aria-label="Poke Mr Frog"
          className="sprite-btn relative block h-full w-full"
        >
          <div
            className={
              froggyWiggle ? "performing-jump h-full w-full" : "idle-bounce h-full w-full"
            }
          >
            <Image
              src="/character-ref/mr-frog/happy.png"
              alt="Mr Frog, happy to see you"
              fill
              sizes="(max-width: 640px) 176px, 224px"
              className="object-contain drop-shadow-[0_16px_20px_rgba(0,0,0,0.18)]"
              priority
            />
          </div>
          <span className="speech">poke me!</span>
        </button>
      </div>

      <p className="relative z-20 mt-6 text-sm text-ink-soft">pick a room:</p>
      <nav className="relative z-20 mt-3 flex flex-wrap items-center justify-center gap-3 text-base sm:text-lg">
        <Link href="/drawings" className="paper-card tilt-l rounded-xl px-4 py-2 text-ink hover:text-red">
          Amelia&rsquo;s drawings
        </Link>
        <Link href="/mr-frog" className="paper-card tilt-r rounded-xl px-4 py-2 text-ink hover:text-sage">
          Mr Frog&rsquo;s world
        </Link>
        <Link href="/videos" className="paper-card tilt-l rounded-xl px-4 py-2 text-ink hover:text-sky">
          Videos
        </Link>
        <Link
          href="/game"
          className="paper-card tilt-r rounded-xl px-4 py-2 text-ink hover:text-red"
        >
          Play the game &nbsp;&#9656;
        </Link>
      </nav>
    </section>
  );
}
