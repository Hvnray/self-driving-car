export interface CarConfig {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Represents the border
 */
export interface BorderPostions {
  /**`x` represents the horizontal axis, left - right  */
  x: number;
  /**`y` represents the vertical axis, top - bottom  */
  y: number;
}

export type BorderPostionsTuple = [BorderPostions, BorderPostions];

export type BordersSections = BorderPostionsTuple[];

export type CarPolygonPoints = BorderPostions & { side: string };

export type BorderPostionsAndOffset = BorderPostions & { offset: number };

export type BorderPostionsAndOffsetOrNull = BorderPostionsAndOffset | null;
