/**
 * The phone is drawn at one fixed design size, in CSS pixels before scaling,
 * and scaled as a single piece to whatever width the page gives it. These are
 * the numbers every part of the phone shares.
 */
export const DW = 340;
export const RIM = 2; // titanium
export const GROOVE = 1.5; // the dark line between metal and glass
export const BEZEL = 9;
export const EDGE = RIM + GROOVE + BEZEL;
export const SCREEN_W = DW - EDGE * 2;
export const SCREEN_H = Math.round(SCREEN_W * (16.6 / 9));
export const DH = SCREEN_H + EDGE * 2;
