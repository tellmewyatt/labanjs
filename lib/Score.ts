import { Staff } from './Staff'
import { Orientation } from './types.d'
export class Score {
  staffs: Staff[];
  targetElement: Element;
  staffWidth: number;
  endTime: number;
  startTime: number;
  allItems: Record<string,any>;
  constructor(targetElement: Element) {
    this.staffs = [] 
    this.targetElement = targetElement
    this.staffWidth = 300 
    this.endTime = 1
    this.startTime = 0
    this.allItems = {}

  }
  generateId() {
    return Math.random().toString(16).slice(2)
  }
  addListeners() {
    const handler = (e: MouseEvent) => {
      if(e.target) {
        const target = e.target as Element
        let id = target.id
        if(!id) {
          const closestG = target.closest("g")
          if (!closestG)
            throw Error("Could not find closest g tag to click target!")
          else if (!closestG.id)
            throw Error("Closest g to click target is missing id!")
          else
            id = closestG.id
        }
        this.allItems[id]?.handleClick?.(e)
      }
    }
    const resizeHandler = ()=> this.render()
    this.targetElement.addEventListener("click", handler)
    window.addEventListener("resize", resizeHandler)

  }
  notifyChange(newItem: any) {
    if(newItem.endTime > this.endTime) 
      this.endTime = newItem.endTime
    if(newItem.startTime < this.startTime) 
      this.startTime = newItem.startTime

  }
  addLabanStaff() {
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
  addStaff() {
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
    return this.endTime - this.startTime

  }
  register(item: any) {
    const id = this.generateId()
    this.allItems[id] = item
    return id
  }
  render() {
    const box = this.targetElement.getBoundingClientRect()
    let staffs = ""
    for (let i = 0; i < this.staffs.length; i++) {
      const staffX = (i+1) * (box.width) / (this.staffs.length + 1) - (this.staffWidth/2)
      staffs = staffs + this.staffs[i].render({
        x: 10 +  staffX,
        y: 10,
        width: this.staffWidth,
        height: box.height - 10

      })

    }
    this.targetElement.innerHTML = `<svg id="score" width=${box.width} height=${box.height}>
      <defs>
        <pattern id="diagonal-stripes" viewBox="0,0,10,10" height='100' width='100' patternUnits="userSpaceOnUse">
          <line x1="0" x2="10" y1="10" y2="0" stroke='#000000' vector-effect="non-scaling-stroke" stroke-width='1' />
        </pattern>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="10"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
      </defs>

    ${staffs}</svg>`

  }

}
