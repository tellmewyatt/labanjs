export class StaffItem {
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
