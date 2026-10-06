import { FilesetResolver, DrawingUtils, PoseLandmarker } from '@mediapipe/tasks-vision'
import type { PoseLandmarkerResult } from '@mediapipe/tasks-vision'
import { ControlVector } from './Controller'
import type { Score } from './Score'
import type { Staff } from './Staff'

const landmarkList = [
    "nose",
    "leftEyeInner",
    "leftEye",
    "leftEyeOuter",
    "rightEyeInner",
    "rightEye",
    "rightEyeOuter",
    "leftEar",
    "rightEar",
    "mouthLeft",
    "mouthRight",
    "leftShoulder",
    "rightShoulder",
    "leftElbow",
    "rightElbow",
    "leftWrist",
    "rightWrist",
    "leftPinky",
    "rightPinky",
    "leftIndex",
    "rightIndex",
    "leftThumb",
    "rightThumb",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftAnkle",
    "rightAnkle",
    "leftHeel",
    "rightHeel",
    "leftFootIndex",
    "rightFootIndex"
]
export class Landmark extends ControlVector {
  key: string;
  velocity: ControlVector;
  constructor (key: string) {
    super(0,0,0)
    this.key = key
    this.velocity = new ControlVector(0,0,0)
  }
  setPosition(x: number, y: number, z: number, dt: number) {
    this.velocity.setValues(
      (x - this.x.value) / dt,
      (y - this.y.value) / dt,
      (z - this.z.value) / dt
    )
    this.setValues(x, y, z)

  }
  renderData() {
    return `
    <tr>
      <td>${this.key}</td>
      <td>${this.x.value.toFixed(2)}</td>
      <td>${this.y.value.toFixed(2)}</td>
      <td>${this.z.value.toFixed(2)}</td>
      <td>${this.velocity.mag.value.toFixed(2)}</td>
    </tr>`

  }

}
class PoseLandmarkerSetup {
  renderDataTarget?: Element;
  landmarks: Record<string, Landmark>
  containerElement?: HTMLDivElement;
  canvasElement?: HTMLCanvasElement;
  canvasCtx?: CanvasRenderingContext2D | null;
  drawingUtils?: DrawingUtils;
  video?: HTMLVideoElement;
  poseLandmarker?: PoseLandmarker;
  lastVideoTime: number;
  constructor(landmarks: Record<string, Landmark>) {
    this.landmarks = landmarks
    this.lastVideoTime = 0;

  }
  setup(targetElement: Element) {
    this.containerElement = document.createElement("div")
    this.canvasElement = document.createElement("canvas")
    this.canvasCtx = this.canvasElement.getContext("2d")
    this.drawingUtils = new DrawingUtils(this.canvasCtx as CanvasRenderingContext2D);
    this.video = document.createElement("video")
    this.video.setAttribute("autoplay", "true")
    this.containerElement!.appendChild(this.video)
    this.containerElement!.appendChild(this.canvasElement)
    targetElement.appendChild(this.containerElement)
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          this.video!.srcObject = stream;
        })
    }
    this.video.addEventListener("loadeddata", () => this.loadModel().then(() => this.renderLoop()))
  }
  async loadModel() {
    if(!this.canvasElement || !this.containerElement || !this.video)
      throw Error("You must call PoseLandmarkerSetup.setup before calling load model!")
    const vision = await FilesetResolver.forVisionTasks("/assets/wasm");
    const poseLandmarker = await PoseLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath: "/pose_landmarker_full.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO"
        });
    this.canvasElement.width = this.video.videoWidth;
    this.canvasElement.height= this.video.videoHeight;
    this.containerElement.style.position="relative"
    this.video.style.inset = "0"
    this.video.style.position = "absolute"
    this.canvasElement.style.inset = "0"
    this.canvasElement.style.position = "absolute"
    this.canvasElement.style.height = "100%"
    this.containerElement.style.height="100%"
    this.video.style.height = "100%"
    this.video.style.margin = "0 auto"
    this.canvasElement.style.margin = "0 auto"
    this.poseLandmarker = poseLandmarker

  }
  processResults(result: PoseLandmarkerResult, dt: number) {
    this.canvasCtx!.save();
    this.canvasCtx!.clearRect(0, 0, this.canvasElement!.width, this.canvasElement!.height);
    const landmarks = result.landmarks[0]
    const worldLandmarks = result.worldLandmarks[0]
    for (let i = 0; i < worldLandmarks.length; i++) {
      const landmark = worldLandmarks[i]
      const thisLandmark = this.landmarks[landmarkList[i]]
      thisLandmark.setPosition(landmark.x, landmark.y, landmark.z, dt)
    }
    this.drawingUtils!.drawLandmarks(
      landmarks, 
      {
        radius: data => DrawingUtils.lerp(
          data!.from!.z, 
          -0.15, 0.1, 5, 1)
      }
    );
    this.drawingUtils!.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS);
    this.canvasCtx!.restore();
  }
  renderData(target: Element) {
      target.innerHTML = `
        <div style="position: absolute; inset: 0;">
        <table style="width: 100%"> 
         <thead>
          <th>name</th>
          <th>X</th>
          <th>Y</th>
          <th>Z</th>
          <th>speed</th>

         </thead>
         <tbody>
        ${Object.values(this.landmarks).map(l => l.renderData()).join("\n")}
        </tbody>

        </table>
        </div>
        `
  }
  renderLoop() {
    if (this.video && this.poseLandmarker && this.video.currentTime !== this.lastVideoTime) {
      const poseLandmarkerResult = this.poseLandmarker.detectForVideo(this.video, this.video.currentTime * 1000);
      try {
        this.processResults(poseLandmarkerResult, this.video.currentTime - this.lastVideoTime);
      }
      catch (e) {
        console.error(e)

      }
      this.lastVideoTime = this.video.currentTime;
      if(this.renderDataTarget)
        this.renderData(this.renderDataTarget)
    }
    requestAnimationFrame(() => {
      this.renderLoop();
    });
  }
}
export class PoseController {
  #landmarker: PoseLandmarkerSetup
  landmarks: Record<string, Landmark>
  staff: Staff;
  id: string;
  constructor(score: Score, staff: Staff) {
    this.id = score.register(this)
    this.staff = staff;
    this.landmarks = {}
    for (const name of landmarkList) {
      this.landmarks[name] = new Landmark(name)
    }
    this.#landmarker = new PoseLandmarkerSetup(this.landmarks)
  }
  render(targetElement: Element) {
    this.#landmarker.setup(targetElement)
  }
  renderData(target: Element) {
    this.#landmarker.renderDataTarget = target
  }
  

}

