import type { Score } from './Score'
import type { Staff } from './Staff'
import type { BarlineOptions, Coords } from './types.d.ts'
import { StaffItem } from './StaffItem'

export class Barline extends StaffItem {
  stroke: string;
  barlineType: string;
  constructor(score: Score, staff: Staff, options?: BarlineOptions) {
    options = options ?? {}
    super(score, staff, { startTime: options.time, endTime: options.time, ...options })
    this.xSpaces = options.xSpaces ??  0
    this.widthSpaces = options.widthSpaces ?? 5
    this.startTime = options.time ?? 0
    this.endTime = options.time ?? 0
    this.stroke = options.stroke ?? "black"
    this.barlineType = options.barlineType ?? "single"
    this.id = score.register(this)
  }
  render(coords : Coords) {
    const { x, y, width } = coords;
    const { stroke } = this
    if (this.barlineType == "double")
      return `
        <rect x=${x} fill="white" width=${width} y=${y} height="5" stroke='${stroke}' id="${this.id}" />
      `
    else
      return `<line x1=${x} x2=${x+width} y1=${y} y2=${y} stroke='${stroke}' id="${this.id}" />`

  }

}
