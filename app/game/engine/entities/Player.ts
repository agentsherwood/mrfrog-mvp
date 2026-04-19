import * as Phaser from "phaser";
import { GAME_WIDTH, PHYSICS } from "../config/game";
import { PLAYER_ASSETS } from "../config/assets";
import { fitBodyToDisplay } from "../lib/bodyFit";

const DISPLAY_WIDTH = 56;
// Body is roughly the frog's torso + head. Feet + arm-tips sit outside the
// box so the hitbox feels fair (no cheap hits on stretched limbs).
const BODY_DISPLAY_W = 44;
const BODY_DISPLAY_H = 60;
const LEAN_DEGREES = 10;

export class Player extends Phaser.Physics.Arcade.Sprite {
  private horizontalInput = 0;
  private controlsEnabled = true;
  private wrapEnabled = true;
  private baseScale = 1;
  private bounceTween?: Phaser.Tweens.Tween;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, PLAYER_ASSETS.idle.key);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.rescaleForCurrentTexture();
    // Anchor body toward the bottom so the frog visually "stands" on a pad
    // when he lands (physics separation puts body top = platform top; if
    // body were centered, his feet would hang 10-15px below the pad).
    fitBodyToDisplay(this, BODY_DISPLAY_W, BODY_DISPLAY_H, 0.72);

    this.setCollideWorldBounds(false);
    this.setBounce(0);
    this.setDepth(5);
    // Vertical cap has to straddle both directions; use the larger of
    // maxFallSpeed and maxRiseSpeed so spring bounces aren't clipped.
    this.setMaxVelocity(
      PHYSICS.horizontalSpeed * 1.5,
      Math.max(PHYSICS.maxFallSpeed, PHYSICS.maxRiseSpeed),
    );
  }

  private rescaleForCurrentTexture(): void {
    if (!this.width) return;
    this.baseScale = DISPLAY_WIDTH / this.width;
    this.setScale(this.baseScale);
  }

  private rescaleAndRefitBody(): void {
    this.rescaleForCurrentTexture();
    // Anchor body toward the bottom so the frog visually "stands" on a pad
    // when he lands (physics separation puts body top = platform top; if
    // body were centered, his feet would hang 10-15px below the pad).
    fitBodyToDisplay(this, BODY_DISPLAY_W, BODY_DISPLAY_H, 0.72);
  }

  setHorizontalInput(direction: -1 | 0 | 1): void {
    if (!this.controlsEnabled) {
      this.horizontalInput = 0;
      return;
    }
    this.horizontalInput = direction;
  }

  bounce(velocity: number): void {
    this.setVelocityY(velocity);
    this.bounceTween?.stop();
    const base = this.baseScale;
    this.setScale(base);
    this.bounceTween = this.scene.tweens.add({
      targets: this,
      scaleX: { from: base * 0.86, to: base },
      scaleY: { from: base * 1.2, to: base },
      duration: 240,
      ease: "Quad.easeOut",
    });
  }

  isFalling(): boolean {
    return (this.body?.velocity.y ?? 0) > 0;
  }

  enterDeathState(reason: "fell" | "hit"): void {
    this.controlsEnabled = false;
    this.wrapEnabled = false;
    this.horizontalInput = 0;
    this.bounceTween?.stop();
    const body = this.body as Phaser.Physics.Arcade.Body | null;
    if (body) body.checkCollision.none = true;

    if (reason === "hit") {
      this.setTexture(PLAYER_ASSETS.surprised.key);
      this.rescaleAndRefitBody();
      this.scene.time.delayedCall(280, () => {
        this.setTexture(PLAYER_ASSETS.sad.key);
        this.rescaleAndRefitBody();
      });
    } else {
      this.setTexture(PLAYER_ASSETS.sad.key);
      this.rescaleAndRefitBody();
    }
  }

  override preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    this.setVelocityX(this.horizontalInput * PHYSICS.horizontalSpeed);

    if (this.wrapEnabled) {
      if (this.x < -this.displayWidth / 2) this.x = GAME_WIDTH + this.displayWidth / 2;
      else if (this.x > GAME_WIDTH + this.displayWidth / 2) this.x = -this.displayWidth / 2;
    }

    if (this.controlsEnabled) {
      if (this.horizontalInput < 0) this.setFlipX(true);
      else if (this.horizontalInput > 0) this.setFlipX(false);

      const targetAngle = this.horizontalInput * LEAN_DEGREES;
      this.angle = Phaser.Math.Linear(this.angle, targetAngle, 0.18);
    }
  }
}
