import * as Phaser from "phaser";
import { GAME_WIDTH, PLATFORM } from "../config/game";
import { Platform, type PlatformKind } from "../entities/Platform";

export class PlatformSpawner {
  private readonly scene: Phaser.Scene;
  private readonly group: Phaser.Physics.Arcade.StaticGroup;
  private nextSpawnY: number;
  private readonly initialHighestY: number;

  constructor(
    scene: Phaser.Scene,
    group: Phaser.Physics.Arcade.StaticGroup,
    startY: number,
  ) {
    this.scene = scene;
    this.group = group;
    this.nextSpawnY = startY;
    this.initialHighestY = startY;
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
    const gap = Phaser.Math.Between(100, 160);
    const spawnY = this.nextSpawnY - gap;
    const spawnX = Phaser.Math.Between(
      PLATFORM.marginX + PLATFORM.width / 2,
      GAME_WIDTH - PLATFORM.marginX - PLATFORM.width / 2,
    );
    const kind = this.pickKind(spawnY, heightClimbed);
    const platform = new Platform(this.scene, spawnX, spawnY, kind);
    this.group.add(platform);
    this.nextSpawnY = spawnY;
  }

  private pickKind(spawnY: number, heightClimbed: number): PlatformKind {
    // Opening stretch is all static so the first jumps are reliable.
    if (spawnY > this.initialHighestY - 280) return "static";

    const difficulty = Phaser.Math.Clamp(heightClimbed / 4000, 0, 1);
    const roll = Math.random();

    // Flower pads are the rare high-value platform.
    const flowerChance = 0.06 + difficulty * 0.05;
    const movingChance = 0.12 + difficulty * 0.25;

    if (roll < flowerChance) return "flower";
    if (roll < flowerChance + movingChance) return "moving";
    return "static";
  }
}
