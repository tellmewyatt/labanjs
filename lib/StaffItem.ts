import type { Score } from './Score'
import type { Staff } from './Staff'
import type { Coords } from './types.d'
import type { StaffItemOptions } from './types.d'
export class StaffItem {
  id: string;
  score: Score;
  staff: Staff
  xSpaces: number;
  widthSpaces: number;
  startTime: number;
  endTime: number;
  constructor(score: Score, staff: Staff, options?: StaffItemOptions) {
    options = options ?? {}
    this.score = score
    this.staff = staff
    this.xSpaces = options.xSpaces ?? 0
    this.widthSpaces = options.widthSpaces ?? 1
    this.startTime = options.startTime ?? 0 
    this.endTime = options.endTime ?? 0
    this.id = score.register(this)
  }
  render(coords: Coords) {
    const { x, y, width, height } = coords;
    return `<rect x=${x} y=${y} width=${width} height=${height} />`

  }
}
