import { BorderPostions, BorderPostionsAndOffset, OrNull } from "./types";

/**
 * Lerp - `Linear Interpolation Util`
 * @param A left point
 * @param B right point
 * @param t percentage
 * @returns {number} Linear Interpolation
 */
export function lerp(A: number, B: number, t: number): number {
  return A + (B - A) * t;
}

/**
 * getIntersection - `Line Intersection Util`
 * @param {BorderPostions} A point lines 
 * @param {BorderPostions} B point lines 
 * @param {BorderPostions} C point lines 
 * @param {BorderPostions} D point lines 
 * @returns {OrNull<BorderPostionsAndOffset>} Linear Interpolation `OrNull<BorderPostionsAndOffset>`
 */
export function getIntersection(
  A: BorderPostions,
  B: BorderPostions,
  C: BorderPostions,
  D: BorderPostions
): OrNull<BorderPostionsAndOffset> {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }
  return null;
}
