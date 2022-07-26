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