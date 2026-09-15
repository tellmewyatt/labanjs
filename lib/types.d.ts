export interface Coords {
  width: number;
  height: number;
  x: number;
  y: number;

}
/** Direction of a score - matches with HTML */
export type Orientation = 'column'|'row'|'row-reverse'|'column-reverse'
export interface StaffItemOptions {
  xSpaces?: number;
  widthSpaces?: number;
  startTime?: number;
  endTime?: number;
}
export interface LabanSymbolOptions extends StaffItemOptions {
  symbol?: string;
  level?: "middle"|"high"|"low";
}

export interface StaffOptions {
  playbackLookAhead: number

}
export interface StaffTextOptions {
  xSpaces?: number;
  time?: number;
  attach?: "left"|"right";
  content?: string;

}
export interface StaffCueOptions {
  /** Position from left in staff line spaces */
  xSpaces?: number;
  /** How long should the line for this cue be, if any? */
  widthSpaces?: number;
  /** Position in time */
  time?: number;
  /** Title of cue */
  name?: string;
  /** How should this cue be activated **/
  activationOptions?: CueActivationOptions

}

export interface BarlineOptions {
  xSpaces?: number;
  widthSpaces?: number;
  time?: number;
  stroke?: string;
  barlineType?: "double"|"single";

}
/** Takes the difference in time from the targeted time to actual time */
export type PerformanceCallback = (dTime: number) => void
export type CueState = "reached"|"cued"|"idle"
