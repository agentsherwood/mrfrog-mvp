import type { Metadata } from "next";

import CollectionView from "./CollectionView";

export const metadata: Metadata = {
  title: "The Mr Frog Collection — Mr Frog’s World",
  description:
    "Open packs, fill the grid and chase the rarest frogs in the Mr Frog Collection.",
};

export default function CollectionPage() {
  return <CollectionView />;
}
