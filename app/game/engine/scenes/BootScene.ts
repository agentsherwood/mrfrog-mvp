import * as Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH, SCENES } from "../config/game";
import { ALL_ASSETS } from "../config/assets";

export class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENES.boot);
  }

  preload(): void {
    const barWidth = GAME_WIDTH - 80;
    const bar = this.add
      .rectangle(40, GAME_HEIGHT / 2, 0, 6, 0x3e6e2e)
      .setOrigin(0, 0.5);
    const outline = this.add
      .rectangle(40, GAME_HEIGHT / 2, barWidth, 6, 0x000000, 0)
      .setOrigin(0, 0.5)
      .setStrokeStyle(2, 0x2a1f14);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, "loading Mr Frog…", {
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
        fontSize: "20px",
        color: "#2a1f14",
      })
      .setOrigin(0.5);

    this.load.on("progress", (value: number) => {
      bar.width = barWidth * value;
    });

    this.load.on("complete", () => {
      bar.destroy();
      outline.destroy();
    });

    for (const entry of ALL_ASSETS) {
      this.load.image(entry.key, entry.path);
    }
  }

  create(): void {
    this.scene.start(SCENES.splash);
  }
}
