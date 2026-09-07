import './style.css'
import { Score } from '../lib/main.ts'
import symbols from './symbols'
const { left, right, forward, forwardRight } = symbols

const score = new Score(document.querySelector("#app"))
document.querySelector("#app").style.height = "3000px"
const staff1 = score.addLabanStaff("laban")
const staff2 = score.addLabanStaff("laban2")

staff1.addStaffItem({ xSpaces: 2, widthSpaces: 1, startTime: 1, endTime: 2, symbol: right, level: 'top' })
staff1.addStaffItem({ xSpaces: 2, widthSpaces: 1, startTime: 2, endTime: 5, symbol: forward })
staff1.addStaffItem({ xSpaces: 0, widthSpaces: 1, startTime: -1, endTime: 0, symbol: forwardRight })
staff1.addBarline({ xSpaces: 0, widthSpaces: 4, startTime: 0 })
staff1.addStaffCue()
staff1.addStaffCue({ xSpaces: -2, time: 2, name: "B" })


score.addListeners()
score.render()
for (const staff of score.staffs) {
  staff.play()

}
