import './style.css'
import { GraphicScore } from './graphics.ts'
import { forward } from './symbols'

const score = new GraphicScore(document.querySelector("#app"))
const staff1 = score.addLabanStaff("laban")

staff1.addStaffItem({ xSpaces: 2, widthSpaces: 1, startTime: 1, endTime: 2, symbol: forward })
staff1.addStaffItem({ xSpaces: 2, widthSpaces: 1, startTime: 2, endTime: 4, symbol: forward })

score.addListeners()
score.render()
