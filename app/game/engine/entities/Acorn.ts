import * as Phaser from "phaser";
import { BREAKABLE_ASSETS, ENV_ASSETS } from "../config/assets";
import { fitBodyToDisplay } from "../lib/bodyFit";

type HazardSpec = {
  key: string;
  displayWidth: number;
  hitboxW: number;
  hitboxH: number;
};

// Hitbox values are DISPLAY-space — the screen-pixel size of the body.
function hazardPool(): HazardSpec[] {
  // Hitboxes tightened ~25% vs visible art — near-misses shouldn't count.
  return [
    { key: ENV_ASSETS.raindrops.key, displayWidth: 36, hitboxW: 22, hitboxH: 28 },
    { key: BREAKABLE_ASSETS[0].key, displayWidth: 60, hitboxW: 38, hitboxH: 36 }, // radio
    { key: BREAKABLE_ASSETS[1].key, displayWidth: 66, hitboxW: 42, hitboxH: 42 }, // washing-machine
    { key: BREAKABLE_ASSETS[2].key, displayWidth: 54, hitboxW: 34, hitboxH: 34 }, // tomato-bob
    { key: BREAKABLE_ASSETS[3].key, displayWidth: 48, hitboxW: 30, hitboxH: 34 }, // peanut-butter
    { key: BREAKABLE_ASSETS[4].key, displayWidth: 62, hitboxW: 38, hitboxH: 42 }, // easel
  ];
}

export class Acorn extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    const spec = Phaser.Utils.Array.GetRandom(hazardPool());
    super(scene, x, y, spec.key);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(4);
    const naturalW = this.width || spec.displayWidth;
    this.setScale(spec.displayWidth / naturalW);

    fitBodyToDisplay(this, spec.hitboxW, spec.hitboxH);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    const isRaindrop = spec.key === ENV_ASSETS.raindrops.key;
    body.setVelocityY(
      isRaindrop
        ? Phaser.Math.Between(130, 190)
        : Phaser.Math.Between(80, 140),
    );
    // Mild horizontal drift — some wander, not chaos.
    body.setVelocityX(Phaser.Math.FloatBetween(-25, 25));

    scene.tweens.add({
      targets: this,
      angle: { from: -12, to: 12 },
      yoyo: true,
      duration: Phaser.Math.Between(500, 900),
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  override preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    const cam = this.scene.cameras.main;
    if (this.y > cam.scrollY + cam.height + 120) {
      this.destroy();
    }
  }
}
