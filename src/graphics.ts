function generateId() {
  return Math.random().toString(16).slice(2)
}
class StaffItem {
  constructor(score, staff, { xSpaces, widthSpaces, startTime, endTime, symbol, level }) {
    this.score = score
    this.xSpaces = xSpaces
    this.widthSpaces = widthSpaces
    this.startTime = startTime
    this.endTime = endTime
    this.symbol = symbol
    this.level = level ?? "middle"
    score.register(this)
  }
  render({ x, y, width, height }) {
    let fill = "white"
    if (this.level == "top")
      fill = "grey"
    if (this.level == "bottom")
      fill = "black"
    const symbol = this.symbol
      .replace('path', `path transform="translate(${x}, ${y}) scale(${width / 256}, ${height / 256}) "`)
      .replace(/style=".*"/, `fill='${fill}' stroke='#000000'`)
    
    return `${symbol}`

  }

}
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
class BarLine {
  constructor(score, staff, { xSpaces, widthSpaces, startTime, stroke, barlineType }) {
    this.xSpaces = xSpaces
    this.widthSpaces = widthSpaces
    this.startTime = startTime
    this.endTime = startTime 
    score.register(this)
    this.stroke = stroke ?? "black"
    this.barlineType = "double"
  }
  render(coords) {
    const { x, y, width, height  } = coords;
    const { stroke } = this
    if (this.barlineType == "double")
      return `
        <rect x=${x} fill="white" width=${width} y=${y} height="5" stroke='${stroke}' id="${this.id}" />
      `
    else
      return `<line x1=${x} x2=${x+width} y1=${y} y2=${y} stroke='${stroke}' id="${this.id}" />`

  }

}
class Staff {
  constructor(score) {
    this.score = score
    this.staffLines = []
    this.staffItems = []
    score.register(this)

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
  addBarLine(props = { xSpaces: 0, widthSpaces: 4, startTime: 1, symbol: "" }) {
    const item = new BarLine(this.score, this, props)
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
      const itemY = (1 - item.startTime / this.score.getTotalTime()) * height + y - itemHeight

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
    this.staffWidth = 300 
    this.endTime = 1
    this.startTime = 0
    this.allItems = {}

  }
  addListeners() {
    const handler = e => console.log(e)
    addEventListener("click", handler)

  }
  notifyChange(newItem) {
    if(newItem.endTime > this.endTime) 
      this.endTime = newItem.endTime
    if(newItem.startTime < this.startTime) 
      this.startTime = newItem.startTime

  }
  addLabanStaff(name) {
    const staff = new Staff(this)
    staff.addStaffLine('black')
    staff.addStaffLine('none')
    staff.addStaffLine('black')
    staff.addStaffLine('none')
    staff.addStaffLine('black')
    staff.addStaffLine('none')
    this.staffs.push(staff)
    return staff

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
    return this.endTime

  }
  register(item) {
    item.id = generateId()
    this.allItems[item.id] = item
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
    this.targetElement.innerHTML = `<svg width=${box.width} height=${box.height}>
      <defs>
        <pattern id="diagonal-stripes" viewBox="0,0,10,10" height='100' width='100' patternUnits="userSpaceOnUse">
          <line x1="0" x2="10" y1="10" y2="0" stroke='#000000' vector-effect="non-scaling-stroke" stroke-width='1' />
        </pattern>
      </defs>

    ${staffs}</svg>`

  }

}
