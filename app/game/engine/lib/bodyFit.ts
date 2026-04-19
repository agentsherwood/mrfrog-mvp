import * as Phaser from "phaser";

/**
 * Sets a dynamic Arcade body so it occupies `displayW × displayH` pixels on
 * screen. Without this, `sprite.setSize(w, h)` is passed through to
 * `body.sourceWidth/Height`, which Phaser then multiplies by scaleX/Y. When
 * source art is ~600px and the sprite is drawn at ~56px, intuitive
 * display-space sizes turn into a microscopic body and collisions miss.
 * This helper does the divide.
 *
 * `verticalAnchor`: 0 = body pinned to top of sprite, 0.5 = centered,
 * 1 = body pinned to bottom. Useful for placing the hitbox around the
 * frog's feet/body instead of over his whole silhouette.
 */
export function fitBodyToDisplay(
  sprite: Phaser.Physics.Arcade.Sprite,
  displayW: number,
  displayH: number,
  verticalAnchor = 0.5,
): void {
  const sx = sprite.scaleX || 1;
  const sy = sprite.scaleY || 1;
  const sourceW = displayW / sx;
  const sourceH = displayH / sy;
  sprite.setSize(sourceW, sourceH);
  const naturalW = sprite.width;
  const naturalH = sprite.height;
  const offsetX = (naturalW - sourceW) / 2;
  const slack = naturalH - sourceH;
  const offsetY = slack * verticalAnchor;
  sprite.setOffset(offsetX, offsetY);
}
