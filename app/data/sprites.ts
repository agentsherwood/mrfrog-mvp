export type Sprite = {
  file: string;
  label: string;
};

export type SpriteGroup = {
  id: string;
  title: string;
  blurb?: string;
  basePath: string;
  sprites: Sprite[];
};

export const characterSheet: SpriteGroup = {
  id: "mr-frog-sheet",
  title: "Mr Frog \u2014 character sheet",
  blurb: "Six views. Locked down so he stays himself in every scene.",
  basePath: "/character-ref/mr-frog",
  sprites: [
    { file: "front-neutral.png", label: "front" },
    { file: "front-34.png", label: "\u00be view" },
    { file: "side-walking.png", label: "side" },
    { file: "happy.png", label: "happy" },
    { file: "sad.png", label: "sad" },
    { file: "surprised.png", label: "surprised" },
  ],
};

export const poses: SpriteGroup = {
  id: "mr-frog-poses",
  title: "Action poses",
  blurb: "Twelve things Mr Frog likes to do.",
  basePath: "/character-ref/mr-frog/poses",
  sprites: [
    { file: "jump.png", label: "jump" },
    { file: "fall.png", label: "fall" },
    { file: "run.png", label: "run" },
    { file: "walk.png", label: "walk" },
    { file: "dance.png", label: "dance" },
    { file: "wave.png", label: "wave" },
    { file: "point.png", label: "point" },
    { file: "read.png", label: "read" },
    { file: "stretch.png", label: "stretch" },
    { file: "sit-think.png", label: "sit-think" },
    { file: "sleep.png", label: "sleep" },
    { file: "cry.png", label: "cry" },
  ],
};

export const mrsFrog: SpriteGroup = {
  id: "mrs-frog",
  title: "Mrs Frog",
  blurb: "The co-star. Six views.",
  basePath: "/character-ref/mrs-frog",
  sprites: [
    { file: "front-neutral.png", label: "front" },
    { file: "front-34.png", label: "\u00be view" },
    { file: "side-profile.png", label: "side" },
    { file: "happy.png", label: "happy" },
    { file: "cross.png", label: "cross" },
    { file: "surprised.png", label: "surprised" },
  ],
};

export const items: SpriteGroup = {
  id: "items",
  title: "Items from the notebook",
  blurb: "A sampler of the world around them.",
  basePath: "/elements",
  sprites: [
    { file: "nature/lily-pad.png", label: "lily pad" },
    { file: "everyday/tomato-bob.png", label: "tomato Bob" },
    { file: "everyday/radio.png", label: "radio" },
    { file: "everyday/washing-machine.png", label: "washing machine" },
    { file: "celebration/cake.png", label: "cake" },
    { file: "celebration/banner.png", label: "banner" },
    { file: "nature/sun.png", label: "sun" },
    { file: "nature/rainbow.png", label: "rainbow" },
  ],
};
