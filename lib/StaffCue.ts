import { Score } from './Score'
import { Staff } from './Staff'
import type { StaffCueOptions, PerformanceCallback, Coords } from './types.d'
import { StaffItem } from './StaffItem'
export class StaffCue extends StaffItem {
  lastRenderProps?: Coords;
  content: string
  state: CueState
  reached: boolean
  handleReached?: PerformanceCallback
  handleCue?: PerformanceCallback
  constructor(score: Score, staff: Staff, options?: StaffCueOptions) {
    options = options ?? {}
    super(score, staff, options)
    this.xSpaces = options.xSpaces ?? -1
    this.widthSpaces= options.widthSpaces ?? 1;
    this.startTime = options.time ?? 0
    this.endTime = options.time ?? 0
    this.content = options.name  ?? "A"
    this.state = "idle"
    this.activationOptions = options.activationOptions
    this.onCue((dt) => console.log(`cued ${options.name} with time difference ${dt}`))
    this.onReached((dt) => console.log(`cued ${options.name} with time difference ${dt}`))
  }
  /** The function called when this cue is clicked */
  handleClick(e: MouseEvent) {
    this.handleReached(0)
  }
  reset(time: number) {
    if (time >= this.startTime)
      this.state = "reached"
    else
      this.state = "idle"
    this.render(this.lastRenderProps)

  }
  render(props: Coords) {
    const { x, y, width } = props
    this.lastRenderProps = props; 
    const radius = 20;
    const fill = this.state === "cued" ? "red" : 
      this.state === "reached" ? "yellow" : "white"
    const prevElement = document.getElementById(this.id)
    if(prevElement) {
      prevElement.innerHTML = `<circle cx="${x}" cy="${y}" fill="${fill}" stroke="#000000" r='${radius}' /> <text 
      class="cue"
      text-anchor="middle" 
      dominant-baseline="middle"
      x="${x}" 
      y="${y}">${
        this.content
      }</text>
      <line x1="${x+radius}" x2="${x+width}" y1="${y}" y2="${y}" stroke="black" marker-end="url(#arrow)"/>`
    }
    
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
  /** Sets the callback to be called when this cue is reached by playback */
  onReached(callback: PerformanceCallback) {
    this.handleReached = (dTime: number) => {
      this.state = "reached"
      callback(dTime)
      this.render(this.lastRenderProps)
    }
    return this
  }
  /** Sets the callback to be called when this cue is cued */
  onCue(callback: PerformanceCallback) {
    this.handleCue = (dTime: number) => {
      this.score.playbackTime = this.startTime
      callback(dTime)
      this.state = "cued"
      this.render(this.lastRenderProps)
    }
    return this
  }
}
