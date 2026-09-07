import { Score } from './Score'
import { Staff } from './Staff'
import type { StaffCueOptions, Coords } from './types.d'
import { StaffItem } from './StaffItem'
export class StaffCue extends StaffItem {
  lastRenderProps?: Coords;
  content: string
  active: boolean
  constructor(score: Score, staff: Staff, options?: StaffCueOptions) {
    options = options ?? {}
    super(score, staff, options)
    this.xSpaces = options.xSpaces ?? -1
    this.widthSpaces= options.widthSpaces ?? 1;
    this.startTime = options.time ?? 0
    this.endTime = options.time ?? 0
    this.content = options.name  ?? "A"
    this.active = false
  }
  onClick(e: MouseEvent) {
    console.log("Cue received click", e)
    this.active = true
    this.staff.activateCue(this)
  }
  render(props: Coords) {
    const { x, y, width } = props
    this.lastRenderProps = props; 
    const radius = 20;
    const fill = this.active ? "red" : "white" 
    
    return `<g id="${this.id}"><circle cx="${x}" cy="${y}" fill="${fill}" stroke="#000000" r='${radius}' /> <text 
      class="cue"
      text-anchor="middle" 
      dominant-baseline="middle"
      x="${x}" 
      y="${y}">${
        this.content
      }</text>
      <line x1="${x+radius}" x2="${x+width}" y1="${y}" y2="${y}" stroke="black" marker-end="url(#arrow)"/>

      </g>
      `
  }

}
