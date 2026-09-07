export class StaffCue {
  constructor(score, staff, { xSpaces, widthSpaces=2, time, name="A" }) {
    this.score = score
    this.staff = staff
    this.xSpaces = xSpaces
    this.widthSpaces=widthSpaces;
    this.startTime = time 
    this.endTime = time 
    this.content = name 
    this.active = false
    score.register(this)
  }
  onClick(e) {
    this.active = true
    this.staff.activateCue(this)
  }
  render(props) {
    const { x, y, width, height } = props
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
