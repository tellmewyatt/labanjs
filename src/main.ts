import './style.css'
import typescriptLogo from './assets/typescript.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { GraphicScore } from './graphics.ts'

const score = new GraphicScore(document.querySelector("#app"))
const staff1 = score.addStaff("laban")
score.addStaff("laban2")
score.addStaff("laban2")

staff1.addStaffItem()

score.render()
