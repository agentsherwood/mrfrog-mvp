import { STORAGE_KEY } from "../config/game";

export function loadHighScore(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const n = Number.parseInt(raw, 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

export function saveHighScore(score: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(Math.max(0, Math.floor(score))));
  } catch {
    // Private mode / storage denied — score just won't persist.
  }
}

export function heightToScore(startY: number, currentY: number): number {
  return Math.max(0, Math.floor((startY - currentY) / 10));
}
