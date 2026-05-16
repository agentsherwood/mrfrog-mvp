import * as Phaser from "phaser";
import { GAME_WIDTH, PLATFORM } from "../config/game";
import { Platform, type PlatformKind } from "../entities/Platform";

export class PlatformSpawner {
  private readonly scene: Phaser.Scene;
  private readonly group: Phaser.Physics.Arcade.StaticGroup;
  private nextSpawnY: number;
  private readonly initialHighestY: number;
  // X of the last platform spawned — the next one is placed within a
  // jumpable horizontal step of it so every gap is reachable.
  private lastSpawnX: number;

  constructor(
    scene: Phaser.Scene,
    group: Phaser.Physics.Arcade.StaticGroup,
    startY: number,
  ) {
    this.scene = scene;
    this.group = group;
    this.nextSpawnY = startY;
    this.initialHighestY = startY;
    this.lastSpawnX = GAME_WIDTH / 2;
  }

  ensureCovered(targetY: number, heightClimbed: number): void {
    while (this.nextSpawnY > targetY - 300) {
      this.spawnOne(heightClimbed);
    }
  }

  cull(belowY: number): void {
    const toRemove: Platform[] = [];
    this.group.getChildren().forEach((child) => {
      const p = child as Platform;
      if (p.y > belowY) toRemove.push(p);
    });
    for (const p of toRemove) p.destroy();
  }

  private spawnOne(heightClimbed: number): void {
    const gap = Phaser.Math.Between(PLATFORM.minGapY, PLATFORM.maxGapY);
    const spawnY = this.nextSpawnY - gap;

    const minX = PLATFORM.marginX + PLATFORM.width / 2;
    const maxX = GAME_WIDTH - PLATFORM.marginX - PLATFORM.width / 2;
    // Place within a jumpable step of the previous platform — never
    // pure-random across the full width, which produced unreachable gaps.
    const step = Phaser.Math.Between(-PLATFORM.maxStepX, PLATFORM.maxStepX);
    const spawnX = Phaser.Math.Clamp(this.lastSpawnX + step, minX, maxX);

    const kind = this.pickKind(spawnY, heightClimbed);
    const platform = new Platform(this.scene, spawnX, spawnY, kind);
    this.group.add(platform);
    this.nextSpawnY = spawnY;
    this.lastSpawnX = spawnX;
  }

  private pickKind(spawnY: number, heightClimbed: number): PlatformKind {
    // Long all-static opening so the first climbs are reliable.
    if (spawnY > this.initialHighestY - 420) return "static";

    const difficulty = Phaser.Math.Clamp(heightClimbed / 6000, 0, 1);
    const roll = Math.random();

    // Flower pads are the rare high-value platform. Moving pads are the
    // hardest landing, so they ramp in gently and stay a minority.
    const flowerChance = 0.06 + difficulty * 0.04;
    const movingChance = 0.08 + difficulty * 0.14;

    if (roll < flowerChance) return "flower";
    if (roll < flowerChance + movingChance) return "moving";
    return "static";
  }
}
