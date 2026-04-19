import type { Metadata } from "next";

import PageNav from "../components/PageNav";
import Videos from "../components/Videos";

export const metadata: Metadata = {
  title: "Videos \u2014 Mr Frog\u2019s World",
};

export default function VideosPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <PageNav />
      <Videos />
      <footer className="px-6 py-6 text-center text-xs text-pencil">
        <p>Early experiments. Sound off.</p>
      </footer>
    </main>
  );
}
