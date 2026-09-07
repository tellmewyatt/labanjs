import type { Score } from './Score'
import type { Staff } from './Staff'
import type { Coords, StaffTextOptions } from './types.d'
import { StaffItem } from './StaffItem'
export class StaffText extends StaffItem {
  attach: "left"|"right";
  content: string;
  constructor(score: Score, staff: Staff, options?: StaffTextOptions) {
    options = options ?? {}
    super(score, staff, {...options, startTime: options.time, endTime: options.time})
    this.xSpaces = options.xSpaces ?? -1
    this.attach = options.attach ?? "left"
    this.content = options.content ?? "Some staff text"
  }
  render({ x, y } : Coords) {
    
    return `<text 
      text-anchor="${this.attach === 'left' ? 'end' : 'start'}" 
      x="${x}" 
      y="${y}">${
        this.content
      }</text>`
  }
}
