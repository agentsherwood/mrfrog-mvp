import type { Metadata } from "next";

import Originals from "../components/Originals";
import PageNav from "../components/PageNav";

export const metadata: Metadata = {
  title: "Amelia\u2019s drawings \u2014 Mr Frog\u2019s World",
};

export default function DrawingsPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <PageNav />
      <Originals />
      <footer className="px-6 py-6 text-center text-xs text-pencil">
        <p>Drawings by Amelia Harrington, age 11.</p>
      </footer>
    </main>
  );
}
