export class Barline {
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
