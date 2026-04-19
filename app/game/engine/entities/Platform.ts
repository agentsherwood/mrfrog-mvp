import * as Phaser from "phaser";
import { PHYSICS, PLATFORM } from "../config/game";
import { PLATFORM_ASSETS } from "../config/assets";

/**
 * Only three platform types — all lily pads. Household items / springs /
 * clouds all moved to falling-object entities so gameplay reads coherent:
 * you land on lily pads, everything else falls on you.
 */
export type PlatformKind = "static" | "moving" | "flower";

type Spec = {
  key: string;
  displayWidth: number;
};

export class Platform extends Phaser.Physics.Arcade.Sprite {
  readonly kind: PlatformKind;
  private readonly driftAmplitude: number;
  private readonly driftSpeed: number;
  private readonly driftCenter: number;
  private readonly driftPhase: number;

  constructor(scene: Phaser.Scene, x: number, y: number, kind: PlatformKind) {
    const spec = specFor(kind);
    super(scene, x, y, spec.key);
    this.kind = kind;
    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    this.setDepth(3);
    this.setOrigin(0.5, 0.5);

    const naturalW = this.width || spec.displayWidth;
    const scale = spec.displayWidth / naturalW;
    this.setScale(scale);

    this.driftAmplitude = kind === "moving" ? Phaser.Math.Between(50, 100) : 0;
    this.driftSpeed = kind === "moving" ? Phaser.Math.FloatBetween(1.2, 2.0) : 0;
    this.driftCenter = x;
    this.driftPhase = Phaser.Math.FloatBetween(0, Math.PI * 2);

    // Thin collision strip near the top of the visual.
    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    const bodyW = this.displayWidth * 0.78;
    const bodyH = PLATFORM.height;
    const topOfSprite = this.y - this.displayHeight / 2;
    const bodyYCenter = topOfSprite + bodyH / 2 + this.displayHeight * 0.1;
    body.setSize(bodyW, bodyH, false);
    body.position.set(this.x - bodyW / 2, bodyYCenter - bodyH / 2);

    if (kind === "static") {
      scene.tweens.add({
        targets: this,
        angle: Phaser.Math.FloatBetween(-2.5, 2.5),
        duration: Phaser.Math.Between(1400, 2400),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }

    if (kind === "flower") {
      // Gentle idle bob so flower pads stand out as "the special one".
      scene.tweens.add({
        targets: this,
        y: y + 4,
        yoyo: true,
        repeat: -1,
        duration: 900,
        ease: "Sine.easeInOut",
      });
    }
  }

  override preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    if (this.driftAmplitude > 0) {
      const t = time / 1000;
      const nextX =
        this.driftCenter +
        Math.sin(t * this.driftSpeed + this.driftPhase) * this.driftAmplitude;
      this.setX(nextX);
      const body = this.body as Phaser.Physics.Arcade.StaticBody | null;
      if (body) {
        body.position.x = nextX - body.width / 2;
      }
    }
  }

  onBounce(): number {
    // Flower pads give the big boost; plain + moving pads the standard jump.
    return this.kind === "flower" ? PHYSICS.springVelocity : PHYSICS.jumpVelocity;
  }

  static get width(): number {
    return PLATFORM.width;
  }
  static get height(): number {
    return PLATFORM.height;
  }
}

function specFor(kind: PlatformKind): Spec {
  switch (kind) {
    case "moving":
      return { key: PLATFORM_ASSETS.lilyPad.key, displayWidth: 96 };
    case "flower":
      return { key: PLATFORM_ASSETS.lilyPadFlower.key, displayWidth: 100 };
    case "static":
    default:
      return { key: PLATFORM_ASSETS.lilyPad.key, displayWidth: 96 };
  }
}
