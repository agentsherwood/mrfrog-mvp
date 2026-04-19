import * as Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH, PHYSICS, SCENES } from "../config/game";
import {
  BIRTHDAY_ASSETS,
  EMOTION_ASSETS,
  ENV_ASSETS,
} from "../config/assets";
import { ensureRuntimeTextures, TEXTURE_KEYS } from "../lib/textures";
import { Player } from "../entities/Player";
import { Platform } from "../entities/Platform";
import { Acorn } from "../entities/Acorn";
import { Collectible, type CollectibleKind } from "../entities/Collectible";
import { PlatformSpawner } from "../lib/platformSpawner";
import { InputController } from "../lib/input";
import { heightToScore, loadHighScore, saveHighScore } from "../lib/score";
import type { GameOverData } from "./GameOverScene";

// Weighted pool for the regular birthday rain. number-12 is handled
// separately as a rare milestone drop.
const COLLECTIBLE_POOL: readonly CollectibleKind[] = [
  "cake",
  "balloon",
  "balloons",
  "giftPink",
  "giftBlue",
  "popper",
  "hatStriped",
  "hatPink",
  "cake", // cake is weighted extra
  "balloon",
  "balloons",
] as const;

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private hazards!: Phaser.Physics.Arcade.Group;
  private collectibles!: Phaser.Physics.Arcade.Group;
  private spawner!: PlatformSpawner;
  private inputCtrl!: InputController;
  private scoreText!: Phaser.GameObjects.Text;
  private highScoreText!: Phaser.GameObjects.Text;
  private bestBadge!: Phaser.GameObjects.Text;
  private eventBanner!: Phaser.GameObjects.Text;
  private bgFar!: Phaser.GameObjects.TileSprite;
  private startY = 0;
  private highestY = 0;
  private score = 0;
  private highScore = 0;
  private reducedMotion = false;
  private beatenBest = false;
  private dying = false;
  private deathReason: "fell" | "hit" = "fell";
  private hazardTimer?: Phaser.Time.TimerEvent;
  private collectibleTimer?: Phaser.Time.TimerEvent;
  private shownTwelveBanner = false;
  private droppedTwelveBonus = false;

  constructor() {
    super(SCENES.game);
  }

  create(): void {
    ensureRuntimeTextures(this);
    this.reducedMotion = prefersReducedMotion();
    this.highScore = loadHighScore();
    this.beatenBest = false;
    this.dying = false;
    this.deathReason = "fell";
    this.shownTwelveBanner = false;
    this.droppedTwelveBonus = false;

    this.bgFar = this.add
      .tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, TEXTURE_KEYS.background)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(0);

    this.add
      .tileSprite(GAME_WIDTH / 2, 14, GAME_WIDTH, 28, BIRTHDAY_ASSETS.bunting.key)
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(18);

    // Side reeds.
    this.add
      .image(14, GAME_HEIGHT / 2, ENV_ASSETS.reeds.key)
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0, 0)
      .setDepth(1)
      .setDisplaySize(32, GAME_HEIGHT)
      .setAlpha(0.75);
    this.add
      .image(GAME_WIDTH - 14, GAME_HEIGHT / 2, ENV_ASSETS.reeds.key)
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0, 0)
      .setDepth(1)
      .setDisplaySize(32, GAME_HEIGHT)
      .setFlipX(true)
      .setAlpha(0.75);

    this.platforms = this.physics.add.staticGroup();
    this.hazards = this.physics.add.group();
    this.collectibles = this.physics.add.group();

    const startPlatformY = GAME_HEIGHT - 120;
    const starter = new Platform(this, GAME_WIDTH / 2, startPlatformY, "static");
    this.platforms.add(starter);

    this.player = new Player(this, GAME_WIDTH / 2, startPlatformY - 60);
    this.player.setVelocityY(PHYSICS.jumpVelocity);
    this.startY = this.player.y;
    this.highestY = this.player.y;

    this.physics.world.setBoundsCollision(false, false, false, false);
    this.physics.world.gravity.y = PHYSICS.gravity;

    this.physics.add.collider(
      this.player,
      this.platforms,
      (playerObj, platformObj) => {
        if (this.dying) return;
        const platform = platformObj as unknown as Platform;
        const boost = platform.onBounce();
        (playerObj as unknown as Player).bounce(boost);
        if (platform.kind === "flower" && !this.reducedMotion) {
          this.cameras.main.shake(70, 0.003);
        }
      },
      (playerObj) => (playerObj as unknown as Player).isFalling() && !this.dying,
      this,
    );

    this.physics.add.overlap(
      this.player,
      this.hazards,
      (_p, obj) => {
        if (this.dying) return;
        const hazard = obj as Acorn;
        this.spawnHitPoof(hazard.x, hazard.y);
        hazard.destroy();
        this.beginDeath("hit");
      },
    );

    this.physics.add.overlap(
      this.player,
      this.collectibles,
      (_p, itemObj) => {
        if (this.dying) return;
        const item = itemObj as Collectible;
        this.onCollect(item);
      },
    );

    this.cameras.main.setScroll(0, this.player.y - (GAME_HEIGHT - 200));

    this.spawner = new PlatformSpawner(this, this.platforms, startPlatformY);
    this.spawner.ensureCovered(this.player.y - GAME_HEIGHT, 0);

    this.inputCtrl = new InputController(this);
    this.setupHUD();
    this.scheduleHazards();
    this.scheduleCollectibles();
  }

  private setupHUD(): void {
    // Small cake icon next to the score, driving the birthday feel at a glance.
    const cakeIcon = this.add
      .image(24, 62, BIRTHDAY_ASSETS.cake.key)
      .setScrollFactor(0)
      .setDepth(20);
    cakeIcon.setScale(32 / (cakeIcon.width || 32));

    this.scoreText = this.add
      .text(44, 50, "0", {
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
        fontSize: "30px",
        color: "#2a1f14",
        stroke: "#f6ecd4",
        strokeThickness: 4,
      })
      .setScrollFactor(0)
      .setDepth(20);

    this.highScoreText = this.add
      .text(GAME_WIDTH - 16, 54, `best ${this.highScore}`, {
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
        fontSize: "15px",
        color: "#6c4b1c",
        stroke: "#f6ecd4",
        strokeThickness: 3,
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(20);

    this.bestBadge = this.add
      .text(GAME_WIDTH - 16, 74, "new best!", {
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
        fontSize: "14px",
        color: "#c84a4a",
        stroke: "#f6ecd4",
        strokeThickness: 3,
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(20)
      .setVisible(false);

    this.eventBanner = this.add
      .text(GAME_WIDTH / 2, 130, "", {
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
        fontSize: "22px",
        color: "#2a1f14",
        stroke: "#f6ecd4",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(20)
      .setAlpha(0);
  }

  override update(): void {
    if (!this.dying) {
      this.player.setHorizontalInput(this.inputCtrl.direction);
    }

    const cam = this.cameras.main;

    if (!this.dying) {
      const targetScrollY = this.player.y - (GAME_HEIGHT - 200);
      if (targetScrollY < cam.scrollY) {
        cam.scrollY = Phaser.Math.Linear(cam.scrollY, targetScrollY, 0.15);
      }
    }

    this.bgFar.tilePositionY = cam.scrollY * 0.5;

    if (this.player.y < this.highestY) this.highestY = this.player.y;

    this.spawner.ensureCovered(cam.scrollY, this.score);
    this.spawner.cull(cam.scrollY + GAME_HEIGHT + 200);

    const nextScore = heightToScore(this.startY, this.highestY);
    if (nextScore !== this.score) {
      this.score = nextScore;
      this.scoreText.setText(String(this.score));
      this.maybeBeatHighScore();
      this.maybeShowTwelveBanner();
    }

    if (!this.dying) {
      const fellOff = this.player.y > cam.scrollY + GAME_HEIGHT + 20;
      if (fellOff) this.beginDeath("fell");
    }
  }

  private maybeBeatHighScore(): void {
    if (this.beatenBest) {
      if (this.score > this.highScore) {
        if (this.score % 10 === 0) saveHighScore(this.score);
        this.highScoreText.setText(`best ${this.score}`);
      }
      return;
    }
    if (this.score > this.highScore && this.highScore > 0) {
      this.beatenBest = true;
      saveHighScore(this.score);
      this.highScoreText.setText(`best ${this.score}`);
      this.bestBadge.setVisible(true).setAlpha(1);
      this.tweens.add({
        targets: this.bestBadge,
        alpha: { from: 1, to: 0.4 },
        yoyo: true,
        repeat: -1,
        duration: 600,
      });
      this.flashBanner("NEW BEST!");
      this.burstStarburst(this.bestBadge.x - 40, this.bestBadge.y + 10);
    } else if (this.score > this.highScore && this.highScore === 0) {
      this.beatenBest = true;
      saveHighScore(this.score);
      this.highScoreText.setText(`best ${this.score}`);
    }
  }

  private maybeShowTwelveBanner(): void {
    if (this.shownTwelveBanner) return;
    if (this.score < 120) return;
    this.shownTwelveBanner = true;
    const cam = this.cameras.main;
    const badge = this.add
      .image(GAME_WIDTH / 2, 220, BIRTHDAY_ASSETS.number12.key)
      .setScrollFactor(0)
      .setDepth(21)
      .setAlpha(0)
      .setScale(0.4);
    const naturalW = badge.width || 120;
    badge.setScale(140 / naturalW);
    this.tweens.add({
      targets: badge,
      alpha: { from: 1, to: 0 },
      scale: { from: 140 / naturalW, to: (140 / naturalW) * 1.4 },
      duration: 2400,
      ease: "Cubic.easeOut",
      onComplete: () => badge.destroy(),
    });
    this.flashBanner("happy 12, Amelia!");
    this.spawnSparkles(this.player.x, cam.scrollY + 220, 6);
    // Drop a bonus number-12 collectible from above as a single rare reward.
    if (!this.droppedTwelveBonus) {
      this.droppedTwelveBonus = true;
      const x = Phaser.Math.Between(80, GAME_WIDTH - 80);
      const item = new Collectible(this, x, cam.scrollY - 40, "number12");
      this.collectibles.add(item);
    }
  }

  private flashBanner(text: string): void {
    this.eventBanner.setText(text);
    this.eventBanner.setAlpha(0);
    this.eventBanner.setScale(0.6);
    this.tweens.add({
      targets: this.eventBanner,
      alpha: { from: 1, to: 0 },
      scale: { from: 0.6, to: 1.2 },
      duration: 1400,
      ease: "Cubic.easeOut",
    });
  }

  private scheduleHazards(): void {
    // Sparse spawn — given how long each hazard lingers, 2.4s keeps the
    // sky busy but not swarming.
    this.hazardTimer = this.time.addEvent({
      delay: 2400,
      loop: true,
      callback: () => {
        if (this.dying) return;
        if (this.score < 80) return;
        this.dropHazard();
      },
    });
  }

  private dropHazard(): void {
    const cam = this.cameras.main;
    const x = Phaser.Math.Between(60, GAME_WIDTH - 60);
    const y = cam.scrollY - 40;
    const hazard = new Acorn(this, x, y);
    this.hazards.add(hazard);
  }

  private scheduleCollectibles(): void {
    this.collectibleTimer = this.time.addEvent({
      delay: 2200,
      loop: true,
      callback: () => {
        if (this.dying) return;
        this.dropCollectible();
      },
    });
  }

  private dropCollectible(): void {
    const cam = this.cameras.main;
    const x = Phaser.Math.Between(60, GAME_WIDTH - 60);
    const kind = Phaser.Utils.Array.GetRandom([...COLLECTIBLE_POOL]);
    // Balloons float up, so spawn them below the camera view; everything
    // else falls, so spawn above.
    const isFloat = kind === "balloon" || kind === "balloons";
    const y = isFloat ? cam.scrollY + GAME_HEIGHT + 30 : cam.scrollY - 40;
    const item = new Collectible(this, x, y, kind);
    this.collectibles.add(item);
  }

  private onCollect(item: Collectible): void {
    const bonusPoints = item.value;
    this.highestY -= bonusPoints * 10;
    const nudge = this.add
      .text(item.x, item.y, `+${bonusPoints}`, {
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
        fontSize: "18px",
        color: "#c84a4a",
        stroke: "#f6ecd4",
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setDepth(22);
    this.tweens.add({
      targets: nudge,
      y: nudge.y - 30,
      alpha: 0,
      duration: 700,
      onComplete: () => nudge.destroy(),
    });
    this.burstHearts(item.x, item.y);
    item.destroy();
    if (!this.reducedMotion) this.cameras.main.flash(120, 246, 236, 212);
  }

  private burstHearts(x: number, y: number): void {
    for (let i = 0; i < 3; i++) {
      const dot = this.add
        .image(x, y, EMOTION_ASSETS.heartBurst.key)
        .setDepth(7)
        .setScale(0.2);
      const angle = (i / 3) * Math.PI * 2 + Math.random() * 0.4;
      this.tweens.add({
        targets: dot,
        x: x + Math.cos(angle) * 34,
        y: y + Math.sin(angle) * 34,
        alpha: 0,
        scale: 0.5,
        duration: 560,
        onComplete: () => dot.destroy(),
      });
    }
  }

  private burstStarburst(x: number, y: number): void {
    const burst = this.add
      .image(x, y, EMOTION_ASSETS.starburst.key)
      .setScrollFactor(0)
      .setDepth(19)
      .setScale(0.3)
      .setAlpha(0.9);
    this.tweens.add({
      targets: burst,
      scale: 0.7,
      alpha: 0,
      angle: 90,
      duration: 900,
      onComplete: () => burst.destroy(),
    });
  }

  private spawnSparkles(x: number, y: number, count: number): void {
    for (let i = 0; i < count; i++) {
      const dot = this.add
        .image(x, y, EMOTION_ASSETS.sparkle.key)
        .setDepth(6)
        .setScale(0.15);
      const angle = Math.random() * Math.PI * 2;
      const dist = Phaser.Math.Between(18, 40);
      this.tweens.add({
        targets: dot,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        scale: 0.35,
        duration: 500,
        onComplete: () => dot.destroy(),
      });
    }
  }

  private spawnHitPoof(x: number, y: number): void {
    for (let i = 0; i < 4; i++) {
      const dot = this.add
        .image(x, y, EMOTION_ASSETS.excl.key)
        .setDepth(6)
        .setScale(0.18);
      const angle = (i / 4) * Math.PI * 2;
      this.tweens.add({
        targets: dot,
        x: x + Math.cos(angle) * 26,
        y: y + Math.sin(angle) * 26,
        alpha: 0,
        scale: 0.3,
        duration: 420,
        onComplete: () => dot.destroy(),
      });
    }
  }

  private beginDeath(reason: "fell" | "hit"): void {
    if (this.dying) return;
    this.dying = true;
    this.deathReason = reason;
    this.hazardTimer?.remove(false);
    this.collectibleTimer?.remove(false);
    this.player.enterDeathState(reason);

    if (!this.reducedMotion) this.cameras.main.shake(200, 0.006);
    this.flashBanner(reason === "hit" ? "splat!" : "waaaah!");

    if (reason === "hit") {
      this.player.setVelocity(Phaser.Math.Between(-60, 60), -420);
      this.tweens.add({ targets: this.player, angle: 720, duration: 900 });
    } else {
      this.tweens.add({ targets: this.player, angle: 540, duration: 900 });
    }

    const cam = this.cameras.main;
    this.time.delayedCall(900, () => {
      const ringX = Phaser.Math.Clamp(this.player.x, 40, GAME_WIDTH - 40);
      const ringY = cam.scrollY + GAME_HEIGHT - 40;
      const ring = this.add
        .image(ringX, ringY, ENV_ASSETS.splash.key)
        .setDepth(6)
        .setAlpha(0.9)
        .setScale(0.2);
      this.tweens.add({
        targets: ring,
        scale: 1.0,
        alpha: 0,
        duration: 620,
        onComplete: () => ring.destroy(),
      });
    });

    this.time.delayedCall(1400, () => this.endGame());
  }

  private endGame(): void {
    const newRecord = this.score > this.highScore;
    const finalHigh = Math.max(this.highScore, this.score);
    if (newRecord) saveHighScore(finalHigh);
    const data: GameOverData = {
      score: this.score,
      highScore: finalHigh,
      newRecord,
      reason: this.deathReason,
    };
    this.scene.start(SCENES.gameOver, data);
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
