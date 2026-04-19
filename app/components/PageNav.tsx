"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/drawings", label: "Amelia\u2019s drawings" },
  { href: "/mr-frog", label: "Mr Frog\u2019s world" },
  { href: "/videos", label: "Videos" },
  { href: "/game", label: "Game" },
];

export default function PageNav() {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-30 border-b border-black/5 bg-paper/85 px-4 py-2 backdrop-blur-md sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 text-sm sm:text-base">
        <Link
          href="/"
          className="paper-card tilt-l rounded-lg px-3 py-1.5 text-ink-soft hover:text-ink"
        >
          &larr; home
        </Link>
        <div className="flex flex-wrap gap-2">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "paper-card tilt-r rounded-lg px-3 py-1.5 text-ink"
                    : "rounded-lg px-3 py-1.5 text-ink-soft hover:text-ink"
                }
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
