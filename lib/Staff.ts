import { StaffCue } from './StaffCue'
import { StaffItem } from './StaffItem'
import { StaffText } from './StaffText'
import { Barline } from './Barline'
import { StretchedSymbol } from './StretchedSymbol'
import type { Score } from './Score'
import type { Coords, StretchedSymbolOptions, StaffCueOptions, StaffTextOptions, BarlineOptions } from './types.d.ts'
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
  score: Score;
  staffLines: StaffLine[]
  staffItems: StaffItem[]
  cues: StaffCue[]
  constructor(score: Score) {
    this.score = score
    this.staffLines = []
    this.staffItems = []
    this.cues = []
    score.register(this)

  }
  activateCue(cue: StaffCue) {
    for(const cue of this.cues) {
      if(cue.active) {
        cue.active = false
      }
    }
    cue.active = true
    this.score.render()

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
  play() {
    const element = document.getElementById(this.playbackLineId ?? "")
    if(this.lastRenderProps && element) {
      const { height, y } = this.lastRenderProps
      const zero = performance.now()
      const animate = () => {
        if(element) {
          let newTime = (performance.now() - zero) / 1000
          const newY = (1 - (newTime - this.score.startTime)/ this.score.getTotalTime()) * height + y
          element.setAttribute("y", String(newY))
          if(newTime < this.score.endTime)
            requestAnimationFrame(animate)
        }

      }
      
      requestAnimationFrame(animate)
    }

  }
  renderPlaybackLine(coords: Coords, time=1) {
    const { x, y, width, height } = coords;
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
