import * as Phaser from "phaser";
import { GAME_WIDTH } from "../config/game";

export type InputDirection = -1 | 0 | 1;

/**
 * Unified input: keyboard (arrows + A/D) + touch (left/right halves).
 * Returns -1, 0, or 1 each frame.
 */
export class InputController {
  private readonly scene: Phaser.Scene;
  private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private readonly keyA: Phaser.Input.Keyboard.Key;
  private readonly keyD: Phaser.Input.Keyboard.Key;
  private touchDir: InputDirection = 0;
  private activePointers = new Map<number, InputDirection>();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    const kb = scene.input.keyboard;
    if (!kb) throw new Error("Keyboard plugin unavailable");
    this.cursors = kb.createCursorKeys();
    this.keyA = kb.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = kb.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    scene.input.addPointer(2);
    scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.onPointerDown, this);
    scene.input.on(Phaser.Input.Events.POINTER_MOVE, this.onPointerDown, this);
    scene.input.on(Phaser.Input.Events.POINTER_UP, this.onPointerUp, this);
    scene.input.on(Phaser.Input.Events.POINTER_UP_OUTSIDE, this.onPointerUp, this);

    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.destroy());
    scene.events.once(Phaser.Scenes.Events.DESTROY, () => this.destroy());
  }

  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    if (!pointer.isDown) return;
    const dir: InputDirection = pointer.x < GAME_WIDTH / 2 ? -1 : 1;
    this.activePointers.set(pointer.id, dir);
    this.refreshTouchDir();
  }

  private onPointerUp(pointer: Phaser.Input.Pointer): void {
    this.activePointers.delete(pointer.id);
    this.refreshTouchDir();
  }

  private refreshTouchDir(): void {
    let left = false;
    let right = false;
    for (const dir of this.activePointers.values()) {
      if (dir < 0) left = true;
      else if (dir > 0) right = true;
    }
    if (left && !right) this.touchDir = -1;
    else if (right && !left) this.touchDir = 1;
    else this.touchDir = 0;
  }

  get direction(): InputDirection {
    const leftKey = this.cursors.left?.isDown || this.keyA.isDown;
    const rightKey = this.cursors.right?.isDown || this.keyD.isDown;
    if (leftKey && !rightKey) return -1;
    if (rightKey && !leftKey) return 1;
    return this.touchDir;
  }

  private destroy(): void {
    this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.onPointerDown, this);
    this.scene.input.off(Phaser.Input.Events.POINTER_MOVE, this.onPointerDown, this);
    this.scene.input.off(Phaser.Input.Events.POINTER_UP, this.onPointerUp, this);
    this.scene.input.off(Phaser.Input.Events.POINTER_UP_OUTSIDE, this.onPointerUp, this);
  }
}
