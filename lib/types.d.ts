export interface Coords {
  width: number;
  height: number;
  x: number;
  y: number;

}
export interface StaffItemOptions {
  xSpaces?: number;
  widthSpaces?: number;
  startTime?: number;
  endTime?: number;
}
export interface StretchedSymbolOptions extends StaffItemOptions {
  symbol?: string;
  level?: "middle"|"high"|"low";
}

export interface StaffTextOptions {
  xSpaces?: number;
  time?: number;
  attach?: "left"|"right";
  content?: string;

}

export interface StaffCueOptions {
  xSpaces?: number;
  widthSpaces?: number;
  time?: number;
  name?: string;

}

export interface BarlineOptions {
  xSpaces?: number;
  widthSpaces?: number;
  time?: number;
  stroke?: string;
  barlineType?: "double"|"single";

}
