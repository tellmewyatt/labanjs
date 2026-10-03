export class Control {
  inputMin: number
  inputMax: number
  outputMin: number
  outputMax: number
  #value: number;
  callbacks: Record<string, function>
  items: Controllable[]
  set value(value: number) {
    this.#value = value
    this.#executeCalls()

  }
  get value() {
    return this.#value

  }
  constructor (value: number) {
    this.#value = value 
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
      callback(this.value)
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
export class ControlVector {
  #mag: Control;
  #controls: Control[]
  get x() { return this.#controls[0] }
  get y() { return this.#controls[1] }
  get z() { return this.#controls[2] }
  get mag() {
    let sum = 0;
    for (const control of this.#controls) {
      sum += Math.pow(control.value, 2)
    }
    this.#mag.value =  Math.sqrt(sum)
    return this.#mag
  }
  get controls() {
    return this.#controls
  }
  constructor(...values) {
    this.#controls = []
    for (const value of values) {
      this.#controls.push( new Control(value));
    }
    this.#mag = new Control(0)
  }
  setValues(...values) {
    for(const i in values) {
      this.#controls[i].value = values[i]
    }
    this.mag;
  }

}
