import type { Metadata } from "next";

import PageNav from "../components/PageNav";
import Game from "../components/Game";

export const metadata: Metadata = {
  title: "Game \u2014 Mr Frog\u2019s World",
};

export default function GamePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <PageNav />
      <Game />
      <footer className="px-6 py-6 text-center text-xs text-pencil">
        <p>Tap to play. No sound.</p>
      </footer>
    </main>
  );
}
