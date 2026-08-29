import forwardLeft from './symbols/forward_left.svg'
class StaffItem {
  constructor({ xSpaces, widthSpaces, startTime, endTime }) {
    this.xSpaces = xSpaces
    this.widthSpaces = widthSpaces
    this.startTime = startTime
    this.endTime = endTime
  }
  render({ x, y, width, height }) {
    return `<image href=${forwardLeft} width=${width} height=${height} x=${x} y=${y} preserveAspectRatio="none"/>`

  }

}
class StaffLine {
  constructor(stroke) {
    this.stroke = stroke ?? "black"

  }
  render(coords) {
    const { x, y, height  } = coords;
    const { stroke } = this
    return `<line x1=${x} x2=${x} y1=${y} y2=${y+height} stroke='${stroke}' />`
  }

}
class Staff {
  constructor(parent) {
    this.parent = parent
    this.staffLines = []
    this.staffItems = []

  }
  addStaffLine(stroke) {
    this.staffLines.push(new StaffLine(stroke))

  }
  addStaffItem() {
    this.staffItems.push(new StaffItem({ xSpaces: 2, widthSpaces: 1, startTime: 0, endTime: 1 }))
    this.staffItems.push(new StaffItem({ xSpaces: 1, widthSpaces: 1, startTime: 1, endTime: 2 }))

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
      const itemY = (item.startTime / this.parent.getTotalTime()) * height + y
      const itemHeight = ((item.endTime - item.startTime)/ this.parent.getTotalTime()) * height

      staffItems = staffItems + item.render({
        x: itemX,
        width: itemWidth,
        y: itemY,
        height: itemHeight
        


      })

    }
    return staffItems
  }
  render(coords) {
    const staffLines = this.renderStaffLines(coords)
    const staffItems = this.renderStaffItems(coords)
    return `${staffLines}${staffItems}`
    

  }

}
export class GraphicScore {
  constructor(targetElement) {
    this.staffs = [] 
    this.targetElement = targetElement
    this.staffWidth = 100
    this.endTime = 1

  }
  addStaff(name, type) {
    const staff = new Staff(this)
    staff.addStaffLine('black')
    staff.addStaffLine('black')
    staff.addStaffLine('black')
    staff.addStaffLine('black')
    staff.addStaffLine('black')
    this.staffs.push(staff)
    return staff

  }
  getTotalTime() {
    let endTime = 1
    for (const staff of this.staffs) {
      for (const item of staff.staffItems) {
        if (item.endTime > endTime)
          endTime = item.endTime
      }
    }
    this.endTime = endTime
    return endTime

  }
  render() {
    const box = this.targetElement.getBoundingClientRect()
    let staffs = ""
    for (const i in this.staffs) {
      const staffX = (i * (box.width) / this.staffs.length)
      staffs = staffs + this.staffs[i].render({
        x: 10 +  staffX,
        y: 10,
        width: this.staffWidth,
        height: box.height - 10

      })

    }
    this.targetElement.innerHTML = `<svg width=${box.width} height=${box.height}>${staffs}</svg>`

  }

}
