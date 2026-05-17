import type { Metadata } from "next";

import GenerateView from "./GenerateView";

export const metadata: Metadata = {
  title: "Frog Generator (dev) — Mr Frog’s World",
  description:
    "Dev lab for the Mr Frog Collection — pick traits and see the frog change layer by layer.",
};

export default function GeneratePage() {
  return <GenerateView />;
}
