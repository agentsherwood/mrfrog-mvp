import type { Metadata } from "next";

import PageNav from "../components/PageNav";
import Sprites from "../components/Sprites";

export const metadata: Metadata = {
  title: "Mr Frog\u2019s world \u2014 Mr Frog\u2019s World",
};

export default function MrFrogPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <PageNav />
      <Sprites />
      <footer className="px-6 py-6 text-center text-xs text-pencil">
        <p>Sprites generated from Amelia&rsquo;s reference drawings.</p>
      </footer>
    </main>
  );
}
