import './style.css'
import { GraphicScore } from './graphics.ts'
import symbols from './symbols'
const { left, right, forward, forwardRight } = symbols

const score = new GraphicScore(document.querySelector("#app"))
const staff1 = score.addLabanStaff("laban")
const staff2 = score.addLabanStaff("laban2")

staff1.addStaffItem({ xSpaces: 2, widthSpaces: 1, startTime: 1, endTime: 2, symbol: right, level: 'top' })
staff1.addStaffItem({ xSpaces: 2, widthSpaces: 1, startTime: 2, endTime: 5, symbol: forward })
staff1.addStaffItem({ xSpaces: 0, widthSpaces: 1, startTime: 0, endTime: 2, symbol: forwardRight })
staff1.addBarLine({ xSpaces: 0, widthSpaces: 4, startTime: 1 })


score.addListeners()
score.render()
