import * as Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH, SCENES } from "../config/game";
import {
  BIRTHDAY_ASSETS,
  PLATFORM_ASSETS,
  PLAYER_ASSETS,
} from "../config/assets";
import { ensureRuntimeTextures, TEXTURE_KEYS } from "../lib/textures";
import { loadHighScore } from "../lib/score";

export class SplashScene extends Phaser.Scene {
  constructor() {
    super(SCENES.splash);
  }

  create(): void {
    ensureRuntimeTextures(this);
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, TEXTURE_KEYS.background);

    // Bunting across the top — party vibes from the first frame.
    this.add
      .tileSprite(GAME_WIDTH / 2, 10, GAME_WIDTH, 26, BIRTHDAY_ASSETS.bunting.key)
      .setOrigin(0.5, 0);

    // Title.
    this.add
      .text(GAME_WIDTH / 2, 110, "Mr Frog's", {
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
        fontSize: "44px",
        color: "#2a1f14",
        stroke: "#f6ecd4",
        strokeThickness: 6,
      })
      .setOrigin(0.5);
    this.add
      .text(GAME_WIDTH / 2, 170, "Waterfall Jump", {
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
        fontSize: "36px",
        color: "#c84a4a",
        stroke: "#f6ecd4",
        strokeThickness: 5,
      })
      .setOrigin(0.5);

    // Birthday subtitle with the number-12.
    this.add
      .text(GAME_WIDTH / 2, 214, "happy birthday, Amelia", {
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
        fontSize: "16px",
        color: "#6c4b1c",
      })
      .setOrigin(0.5);
    const twelve = this.add
      .image(GAME_WIDTH / 2, 252, BIRTHDAY_ASSETS.number12.key)
      .setOrigin(0.5);
    const twelveScaleBase = 56 / (twelve.width || 56);
    twelve.setScale(twelveScaleBase);
    this.tweens.add({
      targets: twelve,
      angle: { from: -4, to: 4 },
      yoyo: true,
      repeat: -1,
      duration: 1400,
      ease: "Sine.easeInOut",
    });

    // Hero frog perched on a lily pad with a cake next to him.
    const pad = this.add.image(GAME_WIDTH / 2, 390, PLATFORM_ASSETS.lilyPad.key);
    pad.setScale(110 / (pad.width || 110));

    const frog = this.add.image(GAME_WIDTH / 2 - 12, 350, PLAYER_ASSETS.idle.key);
    frog.setScale(76 / (frog.width || 76));
    this.tweens.add({
      targets: frog,
      y: frog.y - 14,
      yoyo: true,
      repeat: -1,
      duration: 680,
      ease: "Sine.easeInOut",
    });

    const cake = this.add.image(GAME_WIDTH / 2 + 60, 372, BIRTHDAY_ASSETS.cake.key);
    cake.setScale(50 / (cake.width || 50));
    this.tweens.add({
      targets: cake,
      angle: { from: -6, to: 6 },
      yoyo: true,
      repeat: -1,
      duration: 1200,
      ease: "Sine.easeInOut",
    });

    // A single cluster of balloons drifting to the left — calmer than two.
    const balloons = this.add.image(64, 330, BIRTHDAY_ASSETS.balloons.key);
    balloons.setScale(90 / (balloons.width || 90));
    this.tweens.add({
      targets: balloons,
      y: balloons.y - 14,
      yoyo: true,
      repeat: -1,
      duration: 1400,
      ease: "Sine.easeInOut",
    });

    const tapHint = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 140, "tap or press any key to start", {
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
        fontSize: "18px",
        color: "#2a1f14",
      })
      .setOrigin(0.5);
    this.tweens.add({
      targets: tapHint,
      alpha: { from: 1, to: 0.4 },
      duration: 700,
      yoyo: true,
      repeat: -1,
    });

    const high = loadHighScore();
    if (high > 0) {
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT - 80, `best: ${high}`, {
          fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
          fontSize: "18px",
          color: "#c84a4a",
          stroke: "#f6ecd4",
          strokeThickness: 3,
        })
        .setOrigin(0.5);
    }

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 44, "tap sides to move · arrows or A/D on desktop", {
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
        fontSize: "12px",
        color: "#6c4b1c",
      })
      .setOrigin(0.5);

    const start = () => this.scene.start(SCENES.game);
    this.input.once("pointerdown", start);
    this.input.keyboard?.once("keydown", start);
  }
}
