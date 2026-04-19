import * as Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH, SCENES } from "../config/game";
import {
  BIRTHDAY_ASSETS,
  EMOTION_ASSETS,
  PLAYER_ASSETS,
} from "../config/assets";
import { ensureRuntimeTextures, TEXTURE_KEYS } from "../lib/textures";

export type GameOverData = {
  score: number;
  highScore: number;
  newRecord: boolean;
  reason: "fell" | "hit";
};

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super(SCENES.gameOver);
  }

  create(data: GameOverData): void {
    ensureRuntimeTextures(this);
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, TEXTURE_KEYS.background);

    // Bunting stays in case it's a "new best" celebration.
    this.add
      .tileSprite(GAME_WIDTH / 2, 10, GAME_WIDTH, 26, BIRTHDAY_ASSETS.bunting.key)
      .setOrigin(0.5, 0);

    const titleWord = data.reason === "hit" ? "Splat!" : "Splash!";
    const blurb =
      data.reason === "hit"
        ? "A raindrop got Mr Frog"
        : "Mr Frog took a swim";

    this.add
      .text(GAME_WIDTH / 2, 110, titleWord, {
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
        fontSize: "48px",
        color: "#2a1f14",
        stroke: "#f6ecd4",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 160, blurb, {
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
        fontSize: "18px",
        color: "#6c4b1c",
      })
      .setOrigin(0.5);

    const sadFrog = this.add.image(GAME_WIDTH / 2, 240, PLAYER_ASSETS.sad.key);
    sadFrog.setScale(90 / (sadFrog.width || 90));
    this.tweens.add({
      targets: sadFrog,
      angle: { from: -6, to: 6 },
      yoyo: true,
      repeat: -1,
      duration: 1100,
      ease: "Sine.easeInOut",
    });

    this.add
      .text(GAME_WIDTH / 2, 340, `score: ${data.score}`, {
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
        fontSize: "30px",
        color: "#2a1f14",
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 380, `best: ${data.highScore}`, {
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
        fontSize: "20px",
        color: "#6c4b1c",
      })
      .setOrigin(0.5);

    if (data.newRecord) {
      // Starburst behind the label, cake + popper flanking it.
      const burst = this.add
        .image(GAME_WIDTH / 2, 430, EMOTION_ASSETS.starburst.key)
        .setAlpha(0.8);
      burst.setScale(180 / (burst.width || 180));
      this.tweens.add({
        targets: burst,
        angle: 360,
        duration: 6000,
        repeat: -1,
      });

      const record = this.add
        .text(GAME_WIDTH / 2, 430, "new high score!", {
          fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
          fontSize: "22px",
          color: "#c84a4a",
          stroke: "#f6ecd4",
          strokeThickness: 4,
        })
        .setOrigin(0.5);
      this.tweens.add({
        targets: record,
        scale: { from: 0.9, to: 1.12 },
        yoyo: true,
        repeat: -1,
        duration: 520,
        ease: "Sine.easeInOut",
      });

      const cake = this.add.image(GAME_WIDTH / 2 - 80, 440, BIRTHDAY_ASSETS.cake.key);
      cake.setScale(56 / (cake.width || 56));
      const popper = this.add.image(GAME_WIDTH / 2 + 80, 440, BIRTHDAY_ASSETS.popper.key);
      popper.setScale(56 / (popper.width || 56));
      this.tweens.add({
        targets: [cake, popper],
        y: "-=8",
        yoyo: true,
        repeat: -1,
        duration: 700,
      });
    }

    const hint = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 120, "tap or any key to jump again", {
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
        fontSize: "18px",
        color: "#2a1f14",
      })
      .setOrigin(0.5);
    this.tweens.add({
      targets: hint,
      alpha: { from: 1, to: 0.4 },
      duration: 700,
      yoyo: true,
      repeat: -1,
    });

    const restart = () => this.scene.start(SCENES.game);
    this.time.delayedCall(320, () => {
      this.input.once("pointerdown", restart);
      this.input.keyboard?.once("keydown", restart);
    });
  }
}
