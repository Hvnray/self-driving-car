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
export function getIntersection<
  A extends BorderPostions,
  B extends BorderPostions,
  C extends BorderPostions,
  D extends BorderPostions
>(A: A, B: B, C: C, D: D): OrNull<BorderPostionsAndOffset> {
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

/**
 * Takes two polygon like points and checks if the intersect (touch)
 * @implements `getIntersection` function
 * @param {Type1 extends BorderPostions} polygon1
 * @param {Type2 extends BorderPostions}polygon2
 * @returns {boolean} true if polygon lines touch, else false
 */
export function polygonsIntersect<
  Type1 extends BorderPostions,
  Type2 extends BorderPostions
>(polygon1: Type1[], polygon2: Type2[]): boolean {
  for (let i = 0; i < polygon1.length; i++) {
    for (let j = 0; j < polygon2.length; j++) {
      const touch = getIntersection(
        polygon1[i],
        polygon1[(i + 1) % polygon1.length],
        polygon2[j],
        polygon2[(j + 1) % polygon2.length]
      );
      if (touch) return true;
    }
  }
  return false;
}
