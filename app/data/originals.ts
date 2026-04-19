export type Original = {
  slug: string;
  title: string;
  caption: string;
};

export type Arc = {
  id: string;
  title: string;
  blurb?: string;
  originals: Original[];
};

export const arcs: Arc[] = [
  {
    id: "eggs",
    title: "Where do eggs come from?",
    blurb: "A three-part investigation. Spoiler: Mr Frog is not pleased.",
    originals: [
      {
        slug: "egg-in-the-eye-part-1",
        title: "Part 1 — The big question",
        caption:
          "Mr Frog near the yellow counter, scratching his head. \u201cWhere could EGGS come from?\u201d",
      },
      {
        slug: "egg-in-the-eye-part-3",
        title: "Part 2 — Later\u2026",
        caption:
          "Wide-eyed realisation. \u201cThey\u2019re CHICKENS POOP?!\u201d",
      },
      {
        slug: "egg-in-the-eye",
        title: "Part 3 — Ha Ha Ha",
        caption: "An egg cracked into the red pan. Somehow, the frogs laugh anyway.",
      },
    ],
  },
  {
    id: "bacon",
    title: "Bacon \u2192 Rainbow rain dream",
    blurb: "Kitchen curiosity leads to a pink-and-yellow sleep.",
    originals: [
      {
        slug: "where-does-bacon-come-from",
        title: "Part 1 — Sizzling mystery",
        caption:
          "Mr Frog beside the red pan: \u201cWhere could bacon come from?\u201d",
      },
      {
        slug: "which-dream",
        title: "Part 2 — \u2018the rainbow rain dream, again\u2019",
        caption:
          "Two frogs tucked under a yellow blanket. \u201cla la tooloo eee!\u201d",
      },
    ],
  },
  {
    id: "table",
    title: "Mr Frog dances on the table",
    blurb: "A story in two acts. Volume: too high.",
    originals: [
      {
        slug: "table-dancing",
        title: "Part 1 — \u201cMR. FROG!\u201d",
        caption: "Girl-frog, perched on a stool, has had enough.",
      },
      {
        slug: "table-dancing-part-2",
        title: "Part 2 — The slap",
        caption: "Mr Frog: \u201cwoh!\u201d The radio: \u201cSHUTTING DOWN.\u201d",
      },
    ],
  },
  {
    id: "sleepover",
    title: "The sleepover family",
    blurb: "Wedding \u2192 twins \u2192 sleepover rules. A full life.",
    originals: [
      {
        slug: "lovely-children",
        title: "The wedding",
        caption: "Bow, top-hat, flowered arch, a giant pink heart. CLAP CLAP CLAP.",
      },
      {
        slug: "play-with-the-kids",
        title: "1 month later\u2026",
        caption:
          "\u201cWe had TWINS!\u201d Mr Frog: \u201cI don\u2019t think they\u2019re ready to play.\u201d",
      },
      {
        slug: "kids-sleepover",
        title: "Dad rules",
        caption:
          "\u201cNow if you\u2019re having a sleepover be good OK?\u201d \u2014 \u201cyes, daddy!\u201d",
      },
    ],
  },
  {
    id: "rainbow-rain",
    title: "Rainbow rain",
    blurb: "Mr Frog\u2019s favourite weather.",
    originals: [
      {
        slug: "sweet-rain-dancing",
        title: "Dancing in the drops",
        caption:
          "Rainbow raindrops, a gumball-tree, a radio going \u201cLa la la la la.\u201d",
      },
    ],
  },
  {
    id: "more",
    title: "More from Mr Frog\u2019s world",
    blurb: "Standalones from the notebook.",
    originals: [
      {
        slug: "Balloons",
        title: "Balloons",
        caption:
          "Floating upward past yellow-outlined clouds and little flying creatures.",
      },
      {
        slug: "happy-balloon-floor",
        title: "yippee!",
        caption: "Sitting among flowers with a pink balloon. Simple joys.",
      },
      {
        slug: "audience-musical",
        title: "The musical",
        caption:
          "Two frogs on stage, notes overhead, a whole audience of red frog-figures.",
      },
      {
        slug: "dancing-waves",
        title: "Four in pink tutus",
        caption: "A wave-line chorus above the dancers.",
      },
      {
        slug: "dissapointed-dancing",
        title: "\u201cMr Frog, WHY?\u201d",
        caption:
          "Shakira Shakira on the purple radio. Mr Frog dances obliviously.",
      },
      {
        slug: "chair-sauce",
        title: "Chair Sauce \u2665",
        caption: "An inside joke we may never fully understand.",
      },
      {
        slug: "butterfly-catcher",
        title: "Butterfly catcher",
        caption: "Net raised, a pink-spotted butterfly mid-air.",
      },
      {
        slug: "painter",
        title: "Mr Frog paints a fish",
        caption: "A red stool, a blue dolphin, framed art on the walls.",
      },
      {
        slug: "peanut-butter",
        title: "The GLORIOUS peanut butter",
        caption: "A jar of Nutella, proudly mislabelled.",
      },
      {
        slug: "strong-frog",
        title: "2-pud",
        caption: "Red bench, tongue out, effort-face. That barbell means business.",
      },
      {
        slug: "space-frog",
        title: "Space frog",
        caption: "Astronaut helmet, blue lunar surface, stars all around.",
      },
      {
        slug: "lost-at-sea",
        title: "Lost at sea",
        caption:
          "A small orange raft, yellow paddles, rough blue waves. Brave Mr Frog.",
      },
      {
        slug: "sitting-in-the-rain",
        title: "Three little rain clouds",
        caption: "Sometimes it is like that.",
      },
      {
        slug: "icecream-sick",
        title: "Lick / Bleh",
        caption: "One frog licks green ice cream. The other\u2026 does not agree.",
      },
      {
        slug: "hungry-pie",
        title: "3 mins ago",
        caption:
          "\u201cI took that out of the oven 3 mins ago.\u201d \u201cChew nom snack.\u201d",
      },
      {
        slug: "tomato-teddy-bob",
        title: "Tomato teddy \u2014 Bob",
        caption: "\u201cI love you, tomato teddy. I love you, and I name you BOB \u2665.\u201d",
      },
      {
        slug: "jail-tomato",
        title: "\u201cTomato.\u201d",
        caption: "Behind bars. A framed tomato mugshot on the wall.",
      },
      {
        slug: "plop-diamond",
        title: "We rich / Mr Rich",
        caption: "A diamond falls PLOP. No one notices. Classic.",
      },
      {
        slug: "washing-machine",
        title: "Inside the machine",
        caption: "Mr Frog\u2019s head in the round door, swirl-lines of water above.",
      },
      {
        slug: "inside-and-among-us",
        title: "Help mee!",
        caption: "Green Mr Frog, trapped inside a red crewmate. Canon.",
      },
    ],
  },
];

export const allOriginals: Original[] = arcs.flatMap((a) => a.originals);
