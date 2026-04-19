export type Clip = {
  file: string;
  title: string;
  caption: string;
};

export const clips: Clip[] = [
  {
    file: "/videos/Balloons.mp4",
    title: "Balloons",
    caption: "Mr Frog floats up past yellow-outlined clouds.",
  },
  {
    file: "/videos/cake.mp4",
    title: "Cake",
    caption: "An early experiment from the notebook.",
  },
  {
    file: "/videos/raft.mp4",
    title: "Lost at sea",
    caption: "The orange raft bobs on the waves.",
  },
  {
    file: "/videos/tomato-teddy.mp4",
    title: "Tomato teddy \u2014 Bob",
    caption: "\u201cI love you, tomato teddy.\u201d",
  },
  {
    file: "/videos/washing-machine.mp4",
    title: "Washing machine",
    caption: "Head in the door, water swirling.",
  },
  {
    file: "/videos/random.mp4",
    title: "Mystery clip",
    caption: "An unfiled experiment. Kept for the archive.",
  },
];
