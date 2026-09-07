import { StaffCue } from './StaffCue'
import { StaffItem } from './StaffItem'
import { StaffText } from './StaffText'
import { Barline } from './Barline'
class StaffLine {
  constructor(score, stroke) {
    this.stroke = stroke ?? "black"
    score.register(this)

  }
  render(coords) {
    const { x, y, height  } = coords;
    const { stroke } = this
    return `<line x1=${x} x2=${x} y1=${y} y2=${y+height} stroke='${stroke}' id="${this.id}" />`
  }

}
export class Staff {
  constructor(score) {
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
  addStaffLine(stroke) {
    this.staffLines.push(new StaffLine(this.score, stroke))
  }
  addStaffItem(props = { xSpaces: 2, widthSpaces: 1, startTime: 0, endTime: 1, symbol: "" }) {
    const item = new StaffItem(this.score, this, props)
    this.staffItems.push(item)
    this.score.notifyChange(item)
    return item

  }
  addStaffText(props = { xSpaces: -0.5, time: 1, attach: "left", content: "some text" }) {
    const item = new StaffText(this.score, this, props)
    this.staffItems.push(item)
    this.score.notifyChange(item)
    return item

  }
  addStaffCue(props = { xSpaces: -2, time: 1, attach: "left", name: "A" }) {
    const item = new StaffCue(this.score, this, props)
    this.cues.push(item)
    this.staffItems.push(item)
    this.score.notifyChange(item)
    return item

  }
  addBarline(props = { xSpaces: 0, widthSpaces: 4, startTime: 1, symbol: "" }) {
    const item = new Barline(this.score, this, props)
    this.staffItems.push(item)
    this.score.notifyChange(item)
    return item

  }
  renderStaffLines(coords) {
    const { x, y, width, height } = coords;
    let staffLines = ""
    for (const i in this.staffLines) {
      staffLines = staffLines + this.staffLines[i].render({
        x: x + (width/this.staffLines.length * i), 
        y,
        height

      })

    }
    return staffLines
  }
  renderStaffItems(coords) {
    const staffSpace = coords.width / this.staffLines.length
    const { x, y, width, height } = coords;
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
    const { width, height, y } = this.lastRenderProps
    const element = document.getElementById(this.playbackLineId)
    const zero = performance.now()
    const animate = () => {
      let newTime = (performance.now() - zero) / 1000
      const newY = (1 - (newTime - this.score.startTime)/ this.score.getTotalTime()) * height + y
      element.setAttribute("y", newY)
      if(newTime < this.score.endTime)
        requestAnimationFrame(animate)

    }
    
    requestAnimationFrame(animate)

  }
  renderPlaybackLine(coords, time=1) {
    const { x, y, width, height } = coords;
    const itemY = (1 - (time - this.score.startTime)/ this.score.getTotalTime()) * height + y
    const id = `playback-line-${this.score.generateId()}`
    this.playbackLineId = id
    return `<rect id="${id}" x="${x}" width="${width}" height="2px" fill="red" y="${itemY}" />`

  }
  render(coords) {
    this.lastRenderProps = coords; 
    const staffLines = this.renderStaffLines(coords)
    const staffItems = this.renderStaffItems(coords)
    const playbackLine = this.renderPlaybackLine(coords)
    return `${staffLines}${staffItems}${playbackLine}`
  }

}
