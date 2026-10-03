export class Control {
  #_inputMin: number;
  #_inputMax: number;
  #_outputMin: number;
  #_outputMax: number;
  overflow: 'clamp' = 'clamp'
  // Use setters so that we only have to calculate the transform functon once
  set inputMin(value) {
    this.#_inputMin = value 
    this.updateTransform()
  }
  set inputMax(value) {
    this.#_inputMax =value  
    this.updateTransform()
  }
  set outputMax(value) {
    this.#_outputMax = value 
    this.updateTransform()
  }
  set outputMin(value) {
    this.#_outputMin = value 
    this.updateTransform()
  }
  get inputMin() { return this.#_inputMin }
  get outputMin() { return this.#_outputMin }
  get inputMax() { return this.#_inputMax }
  get outputMax() { return this.#_outputMax }
  constructor(inputMin, inputMax, outputMin, outputMax) {
    this.#_inputMin = inputMin
    this.#_inputMax = inputMax
    this.#_outputMin = outputMin
    this.#_outputMax = outputMax
  }
  /** Performs the clamp operation on the input */
  clampInput(input: number) {
    return Math.max(Math.min(this.inputMax, input), this.inputMin)
  }
  updateTransform() {
    return

  }
  /** Scaling operation after clamp */
  transform(input: number) {
    return input
  }
  /** Applies all operations */
  apply(input: number) {
    return this.transform(this.clampInput(input))

  }
  /** sets the parameter that this controls **/
  controls() {

  }
}
export class LinearControl extends Control {
  scaleFactor: number;
  yIntercept: number;
  constructor(inputMin, inputMax, outputMin, outputMax) {
    super(inputMin, inputMax, outputMin, outputMax)
    this.updateTransform()

  }
  updateTransform() {
    this.scaleFactor = (this.outputMax - this.outputMin) / (this.inputMax - this.inputMin)
    this.yIntercept = this.outputMin - this.scaleFactor * this.inputMin;
  }
  transform(input: number) {
    console.log(this)
    return this.scaleFactor * input + this.yIntercept
  }

}
