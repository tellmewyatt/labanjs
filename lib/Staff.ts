import { StaffCue } from './StaffCue'
import { StaffItem } from './StaffItem'
import { StaffText } from './StaffText'
import { Barline } from './Barline'
import { StretchedSymbol } from './StretchedSymbol'
import type { Score } from './Score'
import type { StaffOptions, Coords, StretchedSymbolOptions, StaffCueOptions, StaffTextOptions, BarlineOptions } from './types.d.ts'
class StaffLine {
  stroke: string;
  id: string;
  constructor(score: Score, stroke: string) {
    this.stroke = stroke ?? "black"
    this.id = score.register(this)

  }
  render(coords: Coords) {
    const { x, y, height  } = coords;
    const { stroke } = this
    return `<line x1=${x} x2=${x} y1=${y} y2=${y+height} stroke='${stroke}' id="${this.id}" />`
  }
}
export class Staff {
  lastRenderProps?: Coords;
  playbackLineId?: string;
  playing: boolean;
  playbackTime: number;
  playbackLookAhead:number;
  cueIndex: number;
  score: Score;
  staffLines: StaffLine[]
  staffItems: StaffItem[]
  cues: StaffCue[]
  stopAtTime?: number|null;
  constructor(score: Score) {
    this.score = score
    this.staffLines = []
    this.staffItems = []
    this.cues = []
    this.playing = false
    this.playbackTime = 0
    this.cueIndex = 0
    this.playbackLookAhead = 0.05
    score.register(this)

  }
  addStaffLine(stroke: string) {
    this.staffLines.push(new StaffLine(this.score, stroke))
  }
  addStretchedSymbol(options?: StretchedSymbolOptions) {
    const item = new StretchedSymbol(this.score, this, options)
    this.staffItems.push(item)
    this.score.notifyChange(item)
    return item

  }
  addStaffText(options?: StaffTextOptions) {
    const item = new StaffText(this.score, this, options)
    this.staffItems.push(item)
    this.score.notifyChange(item)
    return item

  }
  addStaffCue(options?: StaffCueOptions) {
    const item = new StaffCue(this.score, this, options)
    this.cues.push(item)
    this.staffItems.push(item)
    this.score.notifyChange(item)
    return item

  }
  addBarline(options?: BarlineOptions) {
    const item = new Barline(this.score, this, options)
    this.staffItems.push(item)
    this.score.notifyChange(item)
    return item

  }
  renderStaffLines(coords: Coords) {
    const { x, y, width, height } = coords;
    let staffLines = ""
    for (let i= 0; i < this.staffLines.length; i++) {
      staffLines = staffLines + this.staffLines[i].render({
        x: x + (width/this.staffLines.length * i), 
        y,
        width,
        height

      })

    }
    return staffLines
  }
  renderStaffItems(coords: Coords) {
    const staffSpace = coords.width / this.staffLines.length
    const { x, y, height } = coords;
    let staffItems = ""
    for (const i in this.staffItems) {
      const item = this.staffItems[i]
      const itemX = x + staffSpace * item.xSpaces
      const itemWidth = staffSpace * item.widthSpaces
      const itemHeight = ((item.endTime - item.startTime)/ this.score.getTotalTime()) * height
      const itemY = (1 - (item.startTime - this.score.startTime)/ this.score.getTotalTime()) * height + y - itemHeight

      staffItems = staffItems + item.render({
        x: itemX,
        width: itemWidth,
        y: itemY,
        height: itemHeight
      })

    }
    return staffItems
  }
  stopPlayback(dt) {
    this.stopAtTime = this.playbackTime + dt

  }
  goToCueIndex(cueIndex: number = 0) {
    this.cueIndex = cueIndex 
    for (const cueIndex in this.cues) {
      this.cues[cueIndex].reset(this.cues[this.cueIndex].startTime)

    }
    this.playbackTime = this.cues[this.cueIndex].startTime - this.playbackLookAhead
    this.score.render()
  }
  start(time?: number) {
    if(time)
      this.playbackTime = time
    const element = document.getElementById(this.playbackLineId ?? "")
    this.playing = true
    let currentCue = this.cues[this.cueIndex]
    const offset = this.playbackTime
    if(this.lastRenderProps && element) {
      const { height, y } = this.lastRenderProps
      const zero = performance.now()
      const animate = () => {
        if(element && this.playing) {
          let newTime = (performance.now() - zero) / 1000 + offset
          this.playbackTime = newTime
          if(currentCue && currentCue.startTime - this.playbackLookAhead < newTime) {
            currentCue.handleReached(newTime - currentCue.startTime)
            this.cueIndex++
            currentCue = this.cues[this.cueIndex]
          }
          const newY = (1 - (newTime - this.score.startTime)/ this.score.getTotalTime()) * height + y
          element.setAttribute("y", String(newY))
          if(newTime < this.score.endTime && !(this.stopAtTime && newTime > this.stopAtTime)) {
            requestAnimationFrame(animate)
          }
          else {
            this.stopAtTime = null;
            this.playing = false;

          }
          element.scrollIntoView({
            behavior: "smooth", // Use "auto" for instant jump
            block: "center",    // Vertically center
            inline: "center"    // Horizontally center
          });
        }

      }
      
      requestAnimationFrame(animate)
    }

  }
  renderPlaybackLine(coords: Coords) {
    const { x, y, width, height } = coords;
    const time = this.playbackTime
    const itemY = (1 - (time - this.score.startTime)/ this.score.getTotalTime()) * height + y
    const id = `playback-line-${this.score.generateId()}`
    this.playbackLineId = id
    return `<rect id="${id}" x="${x}" width="${width}" height="2px" fill="red" y="${itemY}" />`

  }
  render(coords: Coords) {
    this.lastRenderProps = coords; 
    const staffLines = this.renderStaffLines(coords)
    const staffItems = this.renderStaffItems(coords)
    const playbackLine = this.renderPlaybackLine(coords)
    return `${staffLines}${staffItems}${playbackLine}`
  }

}
