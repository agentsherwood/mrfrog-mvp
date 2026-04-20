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

export const nature: SpriteGroup = {
  id: "nature",
  title: "Nature",
  blurb: "Pond life and weather.",
  basePath: "/elements/nature",
  sprites: [
    { file: "lily-pad.png", label: "lily pad" },
    { file: "lily-pad-flower.png", label: "lily flower" },
    { file: "daisy-white.png", label: "daisy" },
    { file: "daisy-yellow.png", label: "yellow daisy" },
    { file: "mushroom.png", label: "mushroom" },
    { file: "reeds.png", label: "reeds" },
    { file: "tree.png", label: "tree" },
    { file: "pebbles.png", label: "pebbles" },
    { file: "sun.png", label: "sun" },
    { file: "rainbow.png", label: "rainbow" },
    { file: "splash.png", label: "splash" },
    { file: "droplet.png", label: "droplet" },
  ],
};

export const everyday: SpriteGroup = {
  id: "everyday",
  title: "Everyday things",
  blurb: "Odd bits from the notebook.",
  basePath: "/elements/everyday",
  sprites: [
    { file: "tomato-bob.png", label: "tomato Bob" },
    { file: "radio.png", label: "radio" },
    { file: "washing-machine.png", label: "washer" },
    { file: "ice-cream.png", label: "ice cream" },
    { file: "balloon.png", label: "balloon" },
    { file: "easel.png", label: "easel" },
    { file: "paintbrush.png", label: "brush" },
    { file: "peanut-butter.png", label: "peanut butter" },
    { file: "music-notes.png", label: "music" },
    { file: "rain-cloud.png", label: "rain cloud" },
    { file: "raindrops.png", label: "raindrops" },
    { file: "rainbow-drops.png", label: "rainbow drops" },
  ],
};

export const emotion: SpriteGroup = {
  id: "emotion",
  title: "Feelings & flashes",
  blurb: "Little cartoon emotes.",
  basePath: "/elements/emotion",
  sprites: [
    { file: "excl.png", label: "!" },
    { file: "quest.png", label: "?" },
    { file: "sweat.png", label: "sweat" },
    { file: "zzz.png", label: "zzz" },
    { file: "motion.png", label: "motion" },
    { file: "dust.png", label: "dust" },
    { file: "crack.png", label: "crack" },
    { file: "starburst.png", label: "starburst" },
    { file: "sparkle.png", label: "sparkle" },
    { file: "heart-burst.png", label: "heart" },
    { file: "anger.png", label: "anger" },
    { file: "lightbulb.png", label: "idea" },
  ],
};

export const celebration: SpriteGroup = {
  id: "celebration",
  title: "Birthday",
  blurb: "For Amelia\u2019s 12th.",
  basePath: "/elements/celebration",
  sprites: [
    { file: "cake.png", label: "cake" },
    { file: "candle.png", label: "candle" },
    { file: "hat-pink.png", label: "pink hat" },
    { file: "hat-striped.png", label: "striped hat" },
    { file: "gift-pink.png", label: "pink gift" },
    { file: "gift-blue.png", label: "blue gift" },
    { file: "bunting.png", label: "bunting" },
    { file: "bunting-flag.png", label: "flag" },
    { file: "popper.png", label: "popper" },
    { file: "number-12.png", label: "12" },
    { file: "banner.png", label: "banner" },
    { file: "balloons.png", label: "balloons" },
  ],
};

export const animals: SpriteGroup = {
  id: "animals",
  title: "Farmyard friends",
  blurb: "The animals Mr Frog meets.",
  basePath: "/elements/animals",
  sprites: [
    { file: "cow.png", label: "cow" },
    { file: "pig.png", label: "pig" },
    { file: "sheep-curly.png", label: "sheep" },
    { file: "rooster.png", label: "rooster" },
    { file: "sheep-fluffy.png", label: "fluffy sheep" },
    { file: "chicken.png", label: "chicken" },
    { file: "horse.png", label: "horse" },
    { file: "goat.png", label: "goat" },
    { file: "duck.png", label: "duck" },
    { file: "sheepdog.png", label: "dog" },
    { file: "cat.png", label: "cat" },
    { file: "chick.png", label: "chick" },
    { file: "mouse.png", label: "mouse" },
  ],
};

export const vehicles: SpriteGroup = {
  id: "vehicles",
  title: "Cars & vans",
  blurb: "Putting around Mr Frog\u2019s world.",
  basePath: "/elements/vehicles",
  sprites: [
    { file: "car-red.png", label: "red car" },
    { file: "taxi.png", label: "taxi" },
    { file: "camper-van.png", label: "camper" },
    { file: "pickup-green.png", label: "pickup" },
    { file: "convertible-pink.png", label: "convertible" },
    { file: "school-bus.png", label: "bus" },
    { file: "rusty-truck.png", label: "truck" },
    { file: "fire-engine.png", label: "fire engine" },
    { file: "icecream-van.png", label: "ice cream" },
    { file: "police-car.png", label: "police" },
    { file: "scooter.png", label: "scooter" },
    { file: "bicycle.png", label: "bicycle" },
  ],
};

export const farm: SpriteGroup = {
  id: "farm",
  title: "Farm machinery",
  blurb: "Tractors and tools.",
  basePath: "/elements/farm",
  sprites: [
    { file: "tractor-red.png", label: "red tractor" },
    { file: "tractor-green-loader.png", label: "loader" },
    { file: "tractor-small.png", label: "small tractor" },
    { file: "hay-trailer.png", label: "hay trailer" },
    { file: "wheelbarrow.png", label: "barrow" },
    { file: "pitchfork.png", label: "pitchfork" },
    { file: "shovel.png", label: "shovel" },
    { file: "watering-can.png", label: "watering can" },
    { file: "rope.png", label: "rope" },
    { file: "bucket.png", label: "bucket" },
    { file: "hoe.png", label: "hoe" },
    { file: "ladder.png", label: "ladder" },
    { file: "milk-churn.png", label: "churn" },
  ],
};

export const teddies: SpriteGroup = {
  id: "teddies",
  title: "Teddy friends",
  blurb: "The bedroom crew.",
  basePath: "/elements/teddies",
  sprites: [
    { file: "bear-brown.png", label: "brown bear" },
    { file: "bear-cream-ribbon.png", label: "cream bear" },
    { file: "panda.png", label: "panda" },
    { file: "bunny.png", label: "bunny" },
    { file: "bear-patchwork.png", label: "patchwork" },
    { file: "bear-tiny.png", label: "tiny bear" },
    { file: "elephant.png", label: "elephant" },
    { file: "dog.png", label: "dog" },
    { file: "cat.png", label: "cat" },
    { file: "bear-pyjamas.png", label: "pyjamas" },
    { file: "bear-sleeping-small.png", label: "sleepy" },
    { file: "bear-small-brown.png", label: "small bear" },
    { file: "bear-big-sleeping.png", label: "big sleeping" },
    { file: "bear-patched.png", label: "patched" },
  ],
};
