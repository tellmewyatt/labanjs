import type { Score } from './Score'
import type { Staff } from './Staff'
import type { Coords } from './types.d'
import { symbols } from './symbols'
import type { LabanSymbolOptions } from './types.d'
import { StaffItem } from './StaffItem'
export class LabanSymbol extends StaffItem {
  symbol: string;
  level: "middle"|"high"|"low";
  constructor(score: Score, staff: Staff, options?: LabanSymbolOptions) {
    options = options ?? {}
    super(score, staff, options)
    this.symbol = options.symbol
    this.level = options.level ?? "middle"
    score.register(this)
  }
  render({ x, y, width, height } : Coords) {
    let fill = "white"
    const transformed = `<use 
            href="#${this.symbol}" 
            transform="translate(${x}, ${y}) scale(${width / 256}, ${height / 256})"
            stroke-width='2'
            stroke='#000000'/>`
    if (this.level == "high")
      fill = "grey"
    if (this.level == "high")
      return `
      <g id="${this.id}" fill="none">
        <rect 
          fill="url(#diagonal-stripes)" 
          x="${x}" 
          y="${y}" 
          width="${width}" 
          height="${height}" 
          clip-path="url(#${this.id}-clip)" />
          <clipPath id="${this.id}-clip">
            ${transformed}
          </clipPath>
          ${transformed}
      </g>`
    if (this.level == "low")
      return `<g id="${this.id}" fill="black">${transformed}</g>`
    if (this.level == "middle")
      return `<g id="${this.id}" fill="white">
        ${transformed}
        <circle fill="black" r="2" cx="${x + (width / 2)}" cy="${y + (height / 2)}" />
      </g>`
  
   
    return `${symbol}`

  }

}
