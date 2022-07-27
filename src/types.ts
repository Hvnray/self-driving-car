/**
 * Interface the Car Constructor
 * @interface CarConfig
 */
export interface CarConfig {
  /** The initial horizontal axis of the car i.e left to right*/
  x: number;
  /** The initial vertical axis of the car i.e top to bottom*/
  y: number;
  /** The width of the car*/
  width: number;
  /**The height of the car */
  height: number;

  /**Denotes the Maximum speed the car can reach */
  maxSpeed?: number;

  /** Represents the control type a car instance can possess*/
  controlType?: ControlType;
}
/**
 * Represents the border
 * @interface BorderPostions
 */
export interface BorderPostions {
  /**`x` represents the horizontal axis, left - right  */
  x: number;
  /**`y` represents the vertical axis, top - bottom  */
  y: number;
}

/** Represents the control type a car instance can possess*/
export type ControlType = "MAIN" | "DUMMY";

/** Represents an always 2 lenght tuple of  @see BorderPostions */
export type BorderPostionsTuple = [BorderPostions, BorderPostions];

/**Represents and array of BorderPostionsTuple */
export type BordersSections = BorderPostionsTuple[];

/**
 * Represents the CarPolygonPoints (sides)
 * @implements {BorderPostions}
 */
export interface CarPolygonPoints extends BorderPostions {
  /** Name of the current side of polygon */
  side: string;
}
/**
 * Represents the BorderPostions (sides) and Offset
 * @implements {BorderPostions}
 */
export interface BorderPostionsAndOffset extends BorderPostions {
  /** Current offset to BorderPosition */
  offset: number;
}
/**Interface to represent a given Interface or null */
export type OrNull<Type> = Type | null;
