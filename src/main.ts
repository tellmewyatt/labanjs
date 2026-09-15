import './style.css'
import { Score, symbols } from '../lib/main.ts'
const { right, forward, forwardRight } = symbols

const score = new Score(document.querySelector("#score")!)
document.querySelector<HTMLElement>("#score")!.style.height = "3000px"
const staff1 = score.addLabanStaff()
score.addLabanStaff()

staff1.addLabanSymbol({ xSpaces: 2, widthSpaces: 1, startTime: 1, endTime: 2, symbol: "right", level: 'high' })
staff1.addLabanSymbol({ xSpaces: 2, widthSpaces: 1, startTime: 2, endTime: 5, symbol: "forward" })
staff1.addLabanSymbol({ xSpaces: 0, widthSpaces: 1, startTime: -1, endTime: 0, symbol: "forwardRight" })
staff1.addLabanSymbol({ xSpaces: 2, widthSpaces: 1, startTime: 1+5, endTime: 2+5, symbol: "right", level: 'low' })
staff1.addLabanSymbol({ xSpaces: 2, widthSpaces: 1, startTime: 2+5, endTime: 5+5, symbol: "forward" })
staff1.addBarline({ xSpaces: 0, widthSpaces: 4, time: 5, barlineType: "single" })
staff1.addBarline({ xSpaces: 0, widthSpaces: 4, time: 10, barlineType: "single" })
staff1.addBarline({ xSpaces: 0, widthSpaces: 4, time: 0, barlineType: "double" })
staff1.addBarline({ time: -1.5, widthSpaces: 4 })
const cueA = staff1.addStaffCue({ time: -1, name: "A" })
const cueB = staff1.addStaffCue({ time: 5, name: "B" })
cueB.onCue(dt => staff1.start(cueB.startTime))
cueB.onReached(dt => staff1.stopPlayback(-dt))
document.querySelector("#playbackButton").addEventListener("mousedown", () => staff1.start())
document.querySelector("#cueA").addEventListener("mousedown", () => cueA.handleCue(0))
document.querySelector("#cueB").addEventListener("mousedown", () => cueB.handleCue(0))
document.querySelector("#reset").addEventListener("mousedown", () => staff1.goToCueIndex(0))


score.addListeners()
score.render()
for (const staff of score.staffs) {

}
