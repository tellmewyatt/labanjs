/** Control can be thought of as a 1D array, hence mag is used to represent its value */
export class Control {
  inputMin: number
  inputMax: number
  outputMin: number
  outputMax: number
  #mag: number;
  callbacks: Record<string, function>
  items: Controllable[]
  set mag(mag: number) {
    this.#mag = mag
    this.#executeCalls()

  }
  get mag() {
    return this.#mag

  }
  constructor (mag: number) {
    this.#mag = mag 
    this.callbacks = {}

  }
  inputRange(inputMin: number, inputMax: number) {
    this.inputMin = inputMin
    this.inputMax = inputMax
  }
  outputRange(outputMin, outputMax: number) {
    this.outputMin = outputMin
    this.outputMax = outputMax

  }
  calls(fn: function) {
    this.callbacks[fn] = fn
  }
  removeCall(fn) {
    delete this.callbacks[fn]
  }
  removeAllCalls() {
    this.callbacks = {}
  }
  #executeCalls() {
    for(const callback of Object.values(this.callbacks)) {
      callback(this.mag)
    }
  }
}
export class LinearControl extends Control {
  scaleFactor: number;
  yIntercept: number;
  updateTransform() {
    this.scaleFactor = (this.outputMax - this.outputMin) / (this.inputMax - this.inputMin)
    this.yIntercept = this.outputMin - this.scaleFactor * this.inputMin;
  }
  transform(input: number) {
    return this.scaleFactor * input + this.yIntercept
  }

}
export class ControlVector extends Array {
  #mag: number;
  get x() { return this[0] }
  get y() { return this[1] }
  get z() { return this[2] }
  set x(x) { this[0].value = x }
  set y(y) { this[1].value = y }
  set z(z) { this[2].value = z }
  get mag() {
    const { x, y, z } = this;
    const sum = Math.pow(x.value, 2) + Math.pow(y.value, 2) + Math.pow(z.value, 2)
    this.#mag.value =  Math.sqrt(sum)
    return this.#mag
  }
  constructor(...args) {
    const newArgs = []
    for (const arg in args) {
      args[arg]
      newArgs.push( new Control(arg));
    }
    super(...newArgs)
    this.#mag = new Control(0)
  }

}
