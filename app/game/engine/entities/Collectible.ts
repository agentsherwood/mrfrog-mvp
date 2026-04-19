import * as Phaser from "phaser";
import { BIRTHDAY_ASSETS } from "../config/assets";
import { fitBodyToDisplay } from "../lib/bodyFit";

export type CollectibleKind =
  | "cake"
  | "giftPink"
  | "giftBlue"
  | "balloons"
  | "balloon"
  | "popper"
  | "hatStriped"
  | "hatPink"
  | "number12";

type Spec = {
  key: string;
  displayWidth: number;
  value: number;
  floats: boolean;
};

function specFor(kind: CollectibleKind): Spec {
  const entry = BIRTHDAY_ASSETS[kind];
  switch (kind) {
    case "cake":
      return { key: entry.key, displayWidth: 60, value: 100, floats: false };
    case "number12":
      return { key: entry.key, displayWidth: 72, value: 200, floats: false };
    case "balloon":
    case "balloons":
      return { key: entry.key, displayWidth: 58, value: 40, floats: true };
    case "popper":
      return { key: entry.key, displayWidth: 54, value: 50, floats: false };
    case "giftPink":
    case "giftBlue":
      return { key: entry.key, displayWidth: 54, value: 50, floats: false };
    case "hatStriped":
    case "hatPink":
      return { key: entry.key, displayWidth: 48, value: 30, floats: false };
  }
}

export class Collectible extends Phaser.Physics.Arcade.Sprite {
  readonly kind: CollectibleKind;
  readonly value: number;

  constructor(scene: Phaser.Scene, x: number, y: number, kind: CollectibleKind) {
    const spec = specFor(kind);
    super(scene, x, y, spec.key);
    this.kind = kind;
    this.value = spec.value;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const naturalW = this.width || spec.displayWidth;
    this.setScale(spec.displayWidth / naturalW);

    // Collectible hitbox = ~75% of display size so grabs feel generous.
    fitBodyToDisplay(this, spec.displayWidth * 0.75, spec.displayWidth * 0.75);
    this.setDepth(4);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    if (spec.floats) {
      body.setVelocityY(Phaser.Math.Between(-90, -60));
      body.setVelocityX(Phaser.Math.FloatBetween(-20, 20));
    } else {
      body.setVelocityY(Phaser.Math.Between(140, 220));
      body.setVelocityX(Phaser.Math.FloatBetween(-25, 25));
    }

    scene.tweens.add({
      targets: this,
      angle: { from: -8, to: 8 },
      yoyo: true,
      repeat: -1,
      duration: Phaser.Math.Between(900, 1500),
      ease: "Sine.easeInOut",
    });
  }

  override preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    const cam = this.scene.cameras.main;
    if (this.y > cam.scrollY + cam.height + 200) {
      this.destroy();
    }
    if (this.y < cam.scrollY - 200) {
      this.destroy();
    }
  }
}
