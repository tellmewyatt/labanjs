export class Control {
  inputMin?: number
  inputMax?: number
  outputMin?: number
  outputMax?: number
  #value: number;
  callbacks: Map<Function, Function>
  set value(value: number) {
    this.#value = value
    this.#executeCalls()

  }
  get value() {
    return this.#value

  }
  constructor (value: number) {
    this.#value = value 
    this.callbacks = new Map()

  }
  inputRange(inputMin: number, inputMax: number) {
    this.inputMin = inputMin
    this.inputMax = inputMax
  }
  outputRange(outputMin: number, outputMax: number) {
    this.outputMin = outputMin
    this.outputMax = outputMax

  }
  calls(fn: Function) {
    this.callbacks.set(fn, fn)
  }
  removeCall(fn: Function) {
    this.callbacks.delete(fn)
  }
  removeAllCalls() {
    this.callbacks.clear() 
  }
  #executeCalls() {
    for(const callback of this.callbacks.values()) {
      callback(this.value)
    }
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
  constructor(...values: number[]) {
    this.#controls = []
    for (const value of values) {
      this.#controls.push( new Control(value));
    }
    this.#mag = new Control(0)
  }
  setValues(...values: number[]) {
    for(const i in values) {
      this.#controls[i].value = values[i]
    }
    this.mag;
  }

}
