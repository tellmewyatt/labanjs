import type { Score } from './Score'
import type { Staff } from './Staff'
import type { Coords } from './types.d'
import { symbols } from './symbols'
import type { StretchedSymbolOptions } from './types.d'
import { StaffItem } from './StaffItem'
export class StretchedSymbol extends StaffItem {
  symbol: string;
  level: "middle"|"high"|"low";
  constructor(score: Score, staff: Staff, options?: StretchedSymbolOptions) {
    options = options ?? {}
    super(score, staff, options)
    this.symbol = options.symbol ?? symbols.forwardRight
    this.level = options.level ?? "middle"
    score.register(this)
  }
  render({ x, y, width, height } : Coords) {
    let fill = "white"
    if (this.level == "high")
      fill = "grey"
    if (this.level == "low")
      fill = "black"
    const symbol = this.symbol
      .replace('path', `path transform="translate(${x}, ${y}) scale(${width / 256}, ${height / 256}) "`)
      .replace(/style=".*"/, `fill='${fill}' stroke='#000000'`)
   
    return `${symbol}`

  }

}
