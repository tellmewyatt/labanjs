import forwardRaw from './symbols/forward.svg?raw'

const forward = forwardRaw.match(/<path.*\/>/s)[0]
export {
  forward
}
