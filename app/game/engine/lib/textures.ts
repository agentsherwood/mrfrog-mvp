import * as Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH, PLATFORM } from "../config/game";

const TEX = {
  player: "tex-player",
  playerSad: "tex-player-sad",
  platformStatic: "tex-platform-static",
  platformMoving: "tex-platform-moving",
  platformBreakable: "tex-platform-breakable",
  platformSpring: "tex-platform-spring",
  platformCloud: "tex-platform-cloud",
  background: "tex-background",
  mist: "tex-mist",
  sideRock: "tex-side-rock",
  acorn: "tex-acorn",
  splashRing: "tex-splash-ring",
} as const;

export const TEXTURE_KEYS = TEX;

// Colours for the notebook aesthetic.
const PAPER_CREAM = 0xf6ecd4;
const PAPER_EDGE = 0xe2d3a6;
const INK_DARK = 0x2a1f14;
const RULE_BLUE = 0xb4c8d9;
const MARGIN_RED = 0xc84a4a;
const FROG_GREEN = 0x6aa84f;
const FROG_DARK = 0x3e6e2e;
const PAD_GREEN = 0x7cb85a;
const PAD_GREEN_LIGHT = 0xa3d06f;
const WOOD_BROWN = 0xc08b5a;
const SPRING_GOLD = 0xe8c44b;
const CLOUD_WHITE = 0xfdfaf0;
const ACORN_BROWN = 0x8b5a2b;
const ACORN_CAP = 0x5a3a1a;

export function ensureRuntimeTextures(scene: Phaser.Scene): void {
  const tex = scene.textures;

  if (!tex.exists(TEX.player)) drawPlayer(scene, TEX.player, false);
  if (!tex.exists(TEX.playerSad)) drawPlayer(scene, TEX.playerSad, true);
  if (!tex.exists(TEX.platformStatic)) drawLilyPad(scene, TEX.platformStatic, PAD_GREEN, false);
  if (!tex.exists(TEX.platformMoving)) drawLilyPad(scene, TEX.platformMoving, PAD_GREEN_LIGHT, true);
  if (!tex.exists(TEX.platformBreakable)) drawWoodBlock(scene, TEX.platformBreakable);
  if (!tex.exists(TEX.platformSpring)) drawSpringPad(scene, TEX.platformSpring);
  if (!tex.exists(TEX.platformCloud)) drawCloud(scene, TEX.platformCloud);
  if (!tex.exists(TEX.background)) drawPaperBackground(scene, TEX.background);
  if (!tex.exists(TEX.mist)) drawMistDot(scene, TEX.mist);
  if (!tex.exists(TEX.sideRock)) drawSideReeds(scene, TEX.sideRock);
  if (!tex.exists(TEX.acorn)) drawAcorn(scene, TEX.acorn);
  if (!tex.exists(TEX.splashRing)) drawSplashRing(scene, TEX.splashRing);
}

function drawPlayer(scene: Phaser.Scene, key: string, sad: boolean): void {
  const w = 52;
  const h = 56;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);

  // Pencil shadow beneath.
  g.fillStyle(0x000000, 0.12);
  g.fillEllipse(w / 2, h - 4, 30, 6);

  // Body — slightly wobbly rounded rect with ink outline.
  g.fillStyle(FROG_GREEN, 1);
  g.fillRoundedRect(6, 14, w - 12, h - 22, 16);
  g.lineStyle(3, INK_DARK, 1);
  g.strokeRoundedRect(6, 14, w - 12, h - 22, 16);

  // Little legs peeking out the bottom.
  g.fillStyle(FROG_DARK, 1);
  g.fillEllipse(14, h - 10, 12, 8);
  g.fillEllipse(w - 14, h - 10, 12, 8);
  g.lineStyle(2, INK_DARK, 1);
  g.strokeEllipse(14, h - 10, 12, 8);
  g.strokeEllipse(w - 14, h - 10, 12, 8);

  // Eye bumps on top of head.
  g.fillStyle(FROG_GREEN, 1);
  g.fillCircle(16, 12, 9);
  g.fillCircle(w - 16, 12, 9);
  g.lineStyle(3, INK_DARK, 1);
  g.strokeCircle(16, 12, 9);
  g.strokeCircle(w - 16, 12, 9);

  // Eye whites.
  g.fillStyle(0xfdfaf0, 1);
  g.fillCircle(16, 12, 5);
  g.fillCircle(w - 16, 12, 5);

  // Pupils (sad frog looks down).
  g.fillStyle(INK_DARK, 1);
  if (sad) {
    g.fillCircle(16, 14, 2.5);
    g.fillCircle(w - 16, 14, 2.5);
  } else {
    g.fillCircle(17, 11, 2.8);
    g.fillCircle(w - 15, 11, 2.8);
  }

  // Mouth line.
  g.lineStyle(2, INK_DARK, 1);
  if (sad) {
    // Downturned sad mouth.
    g.beginPath();
    g.moveTo(w / 2 - 6, 34);
    g.lineTo(w / 2, 30);
    g.lineTo(w / 2 + 6, 34);
    g.strokePath();
  } else {
    g.beginPath();
    g.moveTo(w / 2 - 7, 28);
    g.lineTo(w / 2 + 7, 28);
    g.strokePath();
  }

  // Cheek pencil dot.
  g.fillStyle(0xde7a7a, 0.6);
  g.fillCircle(12, 26, 2.2);
  g.fillCircle(w - 12, 26, 2.2);

  g.generateTexture(key, w, h);
  g.destroy();
}

function drawLilyPad(
  scene: Phaser.Scene,
  key: string,
  colour: number,
  arrows: boolean,
): void {
  const w = PLATFORM.width + 8;
  const h = PLATFORM.height + 12;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);

  // Soft pencil shadow.
  g.fillStyle(0x000000, 0.12);
  g.fillEllipse(w / 2 + 2, h / 2 + 5, PLATFORM.width - 2, PLATFORM.height - 2);

  // Wobbly pad built as 3 overlapping ovals for a hand-drawn feel.
  g.fillStyle(colour, 1);
  g.fillEllipse(w / 2, h / 2, PLATFORM.width, PLATFORM.height + 2);
  g.fillEllipse(w / 2 - 10, h / 2 - 2, PLATFORM.width - 20, PLATFORM.height);
  g.fillEllipse(w / 2 + 10, h / 2 + 1, PLATFORM.width - 22, PLATFORM.height - 2);

  // Notch (lily-pad cutout) — darker triangle chunk.
  g.fillStyle(0x000000, 0.22);
  g.fillTriangle(
    w / 2 - 6,
    h / 2,
    w / 2 + 4,
    h / 2 - 6,
    w / 2 + 6,
    h / 2 + 1,
  );

  // Pencil outline.
  g.lineStyle(2.4, INK_DARK, 1);
  g.strokeEllipse(w / 2, h / 2, PLATFORM.width, PLATFORM.height + 2);

  // Veins.
  g.lineStyle(1.5, INK_DARK, 0.55);
  for (let i = -2; i <= 2; i++) {
    g.beginPath();
    g.moveTo(w / 2, h / 2);
    g.lineTo(
      w / 2 + Math.cos((i * Math.PI) / 6) * (PLATFORM.width / 2 - 6),
      h / 2 + Math.sin((i * Math.PI) / 6) * (PLATFORM.height / 2 - 2),
    );
    g.strokePath();
  }

  if (arrows) {
    // Two tiny arrow ticks so moving pads read differently.
    g.lineStyle(2, INK_DARK, 0.8);
    g.beginPath();
    g.moveTo(10, h / 2);
    g.lineTo(16, h / 2 - 3);
    g.moveTo(10, h / 2);
    g.lineTo(16, h / 2 + 3);
    g.moveTo(w - 10, h / 2);
    g.lineTo(w - 16, h / 2 - 3);
    g.moveTo(w - 10, h / 2);
    g.lineTo(w - 16, h / 2 + 3);
    g.strokePath();
  }

  g.generateTexture(key, w, h);
  g.destroy();
}

function drawWoodBlock(scene: Phaser.Scene, key: string): void {
  const w = PLATFORM.width + 6;
  const h = PLATFORM.height + 8;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);

  // Shadow.
  g.fillStyle(0x000000, 0.14);
  g.fillRoundedRect(4, 6, w - 4, h - 4, 4);

  // Wood rectangle.
  g.fillStyle(WOOD_BROWN, 1);
  g.fillRoundedRect(2, 2, w - 6, h - 8, 3);

  // Cross-hatch pencil shading.
  g.lineStyle(1, INK_DARK, 0.25);
  for (let x = -h; x < w; x += 6) {
    g.beginPath();
    g.moveTo(x, 2);
    g.lineTo(x + h, h - 6);
    g.strokePath();
  }

  // Ink outline.
  g.lineStyle(2.4, INK_DARK, 1);
  g.strokeRoundedRect(2, 2, w - 6, h - 8, 3);

  // Crack hint.
  g.lineStyle(1.2, INK_DARK, 0.5);
  g.beginPath();
  g.moveTo(w / 2 - 6, 6);
  g.lineTo(w / 2 - 2, 12);
  g.lineTo(w / 2 + 4, 10);
  g.strokePath();

  g.generateTexture(key, w, h);
  g.destroy();
}

function drawSpringPad(scene: Phaser.Scene, key: string): void {
  const w = PLATFORM.width + 8;
  const h = PLATFORM.height + 20;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);

  // Pad base (reuse lily-pad look in a single shape).
  g.fillStyle(0x000000, 0.12);
  g.fillEllipse(w / 2 + 2, h - 6, PLATFORM.width - 2, PLATFORM.height - 2);
  g.fillStyle(PAD_GREEN, 1);
  g.fillEllipse(w / 2, h - 10, PLATFORM.width, PLATFORM.height + 2);
  g.lineStyle(2.4, INK_DARK, 1);
  g.strokeEllipse(w / 2, h - 10, PLATFORM.width, PLATFORM.height + 2);

  // Spring coil above.
  const coilX = w / 2;
  const coilTop = 2;
  const coilBottom = h - 18;
  g.lineStyle(2.6, SPRING_GOLD, 1);
  for (let y = coilTop; y < coilBottom; y += 4) {
    g.beginPath();
    g.moveTo(coilX - 7, y);
    g.lineTo(coilX + 7, y + 2);
    g.strokePath();
  }
  // Coil outline.
  g.lineStyle(2, INK_DARK, 0.9);
  g.beginPath();
  g.moveTo(coilX - 8, coilTop);
  g.lineTo(coilX - 8, coilBottom);
  g.moveTo(coilX + 8, coilTop);
  g.lineTo(coilX + 8, coilBottom);
  g.strokePath();
  // Top plate.
  g.fillStyle(SPRING_GOLD, 1);
  g.fillRoundedRect(coilX - 11, coilTop - 2, 22, 5, 2);
  g.lineStyle(2, INK_DARK, 1);
  g.strokeRoundedRect(coilX - 11, coilTop - 2, 22, 5, 2);

  g.generateTexture(key, w, h);
  g.destroy();
}

function drawCloud(scene: Phaser.Scene, key: string): void {
  const w = PLATFORM.width + 12;
  const h = PLATFORM.height + 14;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);

  g.fillStyle(0x000000, 0.08);
  g.fillEllipse(w / 2 + 2, h - 3, PLATFORM.width, 5);

  // Three overlapping puffs.
  g.fillStyle(CLOUD_WHITE, 1);
  g.fillCircle(w / 2 - 18, h / 2, 14);
  g.fillCircle(w / 2, h / 2 - 4, 17);
  g.fillCircle(w / 2 + 18, h / 2, 14);
  g.fillRoundedRect(w / 2 - 26, h / 2, 52, 14, 7);

  // Ink outline — approximate as an overall rounded shape.
  g.lineStyle(2.2, INK_DARK, 1);
  g.strokeCircle(w / 2 - 18, h / 2, 14);
  g.strokeCircle(w / 2, h / 2 - 4, 17);
  g.strokeCircle(w / 2 + 18, h / 2, 14);

  g.generateTexture(key, w, h);
  g.destroy();
}

function drawPaperBackground(scene: Phaser.Scene, key: string): void {
  const w = GAME_WIDTH;
  const h = GAME_HEIGHT;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);

  // Cream fill.
  g.fillStyle(PAPER_CREAM, 1);
  g.fillRect(0, 0, w, h);

  // Subtle vignette by darkening edges.
  g.fillStyle(PAPER_EDGE, 0.25);
  g.fillRect(0, 0, w, 12);
  g.fillRect(0, h - 12, w, 12);

  // Notebook rule lines.
  g.lineStyle(1, RULE_BLUE, 0.55);
  for (let y = 32; y < h; y += 28) {
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(w, y);
    g.strokePath();
  }

  // Red margin line.
  g.lineStyle(1.4, MARGIN_RED, 0.55);
  g.beginPath();
  g.moveTo(34, 0);
  g.lineTo(34, h);
  g.strokePath();

  // Pencil scribbles near edges for texture.
  g.lineStyle(1, INK_DARK, 0.08);
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + Math.random() * 10 - 5, y + Math.random() * 10 - 5);
    g.strokePath();
  }

  g.generateTexture(key, w, h);
  g.destroy();
}

function drawMistDot(scene: Phaser.Scene, key: string): void {
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  g.fillStyle(RULE_BLUE, 1);
  g.fillCircle(5, 5, 5);
  g.generateTexture(key, 10, 10);
  g.destroy();
}

function drawSideReeds(scene: Phaser.Scene, key: string): void {
  const w = 28;
  const h = GAME_HEIGHT;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);

  // Edge paper darkening.
  g.fillStyle(PAPER_EDGE, 0.4);
  g.fillRect(0, 0, w, h);

  // Reed strokes — thin green verticals with dark tips.
  g.lineStyle(2, FROG_DARK, 0.85);
  for (let y = 0; y < h; y += 20) {
    const jitter = (y % 40) === 0 ? 0 : 6;
    g.beginPath();
    g.moveTo(6 + jitter, y + 18);
    g.lineTo(8 + jitter, y);
    g.strokePath();
    g.beginPath();
    g.moveTo(18 - jitter, y + 18);
    g.lineTo(16 - jitter, y);
    g.strokePath();
  }

  // Ink border on the inner edge.
  g.lineStyle(1.5, INK_DARK, 0.7);
  g.beginPath();
  g.moveTo(w - 1, 0);
  g.lineTo(w - 1, h);
  g.strokePath();

  g.generateTexture(key, w, h);
  g.destroy();
}

function drawAcorn(scene: Phaser.Scene, key: string): void {
  const w = 22;
  const h = 26;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);

  // Nut body.
  g.fillStyle(ACORN_BROWN, 1);
  g.fillEllipse(w / 2, h / 2 + 4, 16, 18);
  g.lineStyle(2, INK_DARK, 1);
  g.strokeEllipse(w / 2, h / 2 + 4, 16, 18);

  // Cap.
  g.fillStyle(ACORN_CAP, 1);
  g.fillRoundedRect(2, 2, w - 4, 9, 3);
  g.lineStyle(2, INK_DARK, 1);
  g.strokeRoundedRect(2, 2, w - 4, 9, 3);

  // Stem.
  g.lineStyle(2, INK_DARK, 1);
  g.beginPath();
  g.moveTo(w / 2, 2);
  g.lineTo(w / 2 + 1, -2);
  g.strokePath();

  g.generateTexture(key, w, h);
  g.destroy();
}

function drawSplashRing(scene: Phaser.Scene, key: string): void {
  const d = 60;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  g.lineStyle(4, RULE_BLUE, 1);
  g.strokeCircle(d / 2, d / 2, d / 2 - 3);
  g.generateTexture(key, d, d);
  g.destroy();
}
