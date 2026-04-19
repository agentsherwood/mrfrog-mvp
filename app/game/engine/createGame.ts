import * as Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH, PHYSICS } from "./config/game";
import { BootScene } from "./scenes/BootScene";
import { SplashScene } from "./scenes/SplashScene";
import { GameScene } from "./scenes/GameScene";
import { GameOverScene } from "./scenes/GameOverScene";

/**
 * Builds a fresh Phaser.Game mounted into the given container element.
 * Called from the React wrapper so the engine only boots in the browser —
 * Phaser touches DOM/canvas APIs that don't exist during Next SSR.
 */
export function createGame(parent: HTMLElement): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent,
    backgroundColor: "#0b3d5c",
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: PHYSICS.gravity },
        debug: false,
      },
    },
    fps: {
      target: 60,
      forceSetTimeOut: false,
    },
    input: {
      activePointers: 3,
    },
    // Mobile Safari's autoplay policy can stall Phaser boot while it waits
    // for an AudioContext resume. We have no audio, so skip it entirely.
    audio: {
      noAudio: true,
    },
    scene: [BootScene, SplashScene, GameScene, GameOverScene],
  };

  return new Phaser.Game(config);
}
