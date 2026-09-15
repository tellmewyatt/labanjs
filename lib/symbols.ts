import backwardLeft from "./symbols/backward_left.svg?raw"
import backwardRight from "./symbols/backward_right.svg?raw"
import center from "./symbols/center.svg?raw"
import forwardLeft from "./symbols/forward_left.svg?raw"
import forwardRight from "./symbols/forward_right.svg?raw"
import forward from "./symbols/forward.svg?raw"
import left from "./symbols/left.svg?raw"
import right from "./symbols/right.svg?raw"
const symbols = {
  backwardLeft,
  backwardRight,
  center,
  forwardLeft,
  forwardRight,
  forward,
  left,
  right,
}
function extractPath(svgRaw: string) : string {
  try {
    return svgRaw.match(/<path.*\/>/s)?.[0] ?? ""
  }
  catch {
    throw Error("Could not extract path from SVG path!")

  }
}
for (const [key, value] of Object.entries(symbols)) {
  symbols[key as keyof typeof symbols] = extractPath(value)
}
const symbolDefs = Object.entries(symbols).reduce((p, [k, v]) => {
  return `${p}<clipPath id="${k}-clip">${v.replace("path", `path id="${k}"`)
      .replace(/style=".*"/, ` stroke='#000000' vector-effect="non-scaling-stroke"`)
  }</clipPath>`


}, "")
console.log(symbolDefs)
export { symbols, symbolDefs }
