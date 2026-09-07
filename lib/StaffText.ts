export class StaffText {
  constructor(score, staff, { xSpaces, time, attach="left", content="some text" }) {
    this.score = score 
    this.xSpaces = xSpaces
    this.startTime = time 
    this.endTime = time 
    this.attach = attach
    this.content = content
    score.register(this)
  }
  render({ x, y }) {
    
    return `<text 
      text-anchor="${this.attach === 'left' ? 'end' : 'start'}" 
      x="${x}" 
      y="${y}">${
        this.content
      }</text>`
  }
}
