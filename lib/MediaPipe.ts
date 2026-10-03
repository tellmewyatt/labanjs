import { FilesetResolver, DrawingUtils, PoseLandmarker } from '@mediapipe/tasks-vision'
import { LinearControl } from './Controller'

const landmarkList = [
    "nose",
    "left eye (inner)",
    "left eye",
    "left eye (outer)",
    "right eye (inner)",
    "right eye",
    "right eye (outer)",
    "left ear",
    "right ear",
    "mouth (left)",
    "mouth (right)",
    "left shoulder",
    "right shoulder",
    "left elbow",
    "right elbow",
    "left wrist",
    "right wrist",
    "left pinky",
    "right pinky",
    "left index",
    "right index",
    "left thumb",
    "right thumb",
    "left hip",
    "right hip",
    "left knee",
    "right knee",
    "left ankle",
    "right ankle",
    "left heel",
    "right heel",
    "left foot index",
    "right foot index"
]
class Landmark {
  key: string;
  x: number;
  y: number;
  z: number;
  velocity: number;
  constructor (key: string) {
    this.x = 0
    this.y = 0
    this.z = 0
    this.key = key
    this.velocity = 0
  }
  renderData() {
    return `
    <tr>
      <td>${this.key}</td>
      <td>${this.x.toFixed(2)}</td>
      <td>${this.y.toFixed(2)}</td>
      <td>${this.z.toFixed(2)}</td>
    </tr>`

  }

}
class PoseLandmarkerSetup {
  renderDataTarget: Element;
  setup(targetElement) {
    this.containerElement = document.createElement("div")
    this.canvasElement = document.createElement("canvas")
    this.canvasCtx = this.canvasElement.getContext("2d")
    this.drawingUtils = new DrawingUtils(this.canvasCtx);
    this.video = document.createElement("video")
    this.video.setAttribute("autoplay", true)
    this.containerElement.appendChild(this.video)
    this.containerElement.appendChild(this.canvasElement)
    this.landmarks = {}
    for (const name of landmarkList) {
      this.landmarks[name] = new Landmark(name)
    }
    targetElement.appendChild(this.containerElement)
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          this.video.srcObject = stream;
        })
    }
    this.video.addEventListener("loadeddata", () => this.loadModel().then(() => this.renderLoop()))
  }
  async loadModel() {
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
    const fillBox = document.querySelector("#vidContainer");
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
  processResults(result, dt) {
    this.canvasCtx.save();
    this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    const landmarks = result.landmarks[0]
    const worldLandmarks = result.worldLandmarks[0]
    for (let i = 0; i < worldLandmarks.length; i++) {
      const landmark = worldLandmarks[i]
      const thisLandmark = this.landmarks[landmarkList[i]]

      thisLandmark.velocity = Math.sqrt(
        (landmark.x - thisLandmark.x) ^ 2 + (landmark.y - thisLandmark.y )^ 2 + (landmark.z - thisLandmark.z) ^ 2) / dt
      thisLandmark.x = landmark.x
      thisLandmark.y = landmark.y
      thisLandmark.z = landmark.z
    }
    this.drawingUtils.drawLandmarks(
      landmarks, 
      {
        radius: data => DrawingUtils.lerp(
          data.from.z, 
          -0.15, 0.1, 5, 1)
      }
    );
    this.drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS);
    this.canvasCtx.restore();
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

         </thead>
         <tbody>
        ${Object.values(this.landmarks).map(l => l.renderData()).join("\n")}
        </tbody>

        </table>
        </div>
        `
  }
  renderLoop() {
    if (this.video.currentTime !== this.lastVideoTime) {
      const poseLandmarkerResult = this.poseLandmarker.detectForVideo(this.video, this.video.currentTime * 1000);
      this.processResults(poseLandmarkerResult, this.video.currentTime - this.lastVideoTime);
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
  id: string
  constructor(score, staff) {
    this.id = score.register(this)
    this.landmarker = new PoseLandmarkerSetup()
  }
  render(targetElement) {
    this.landmarker.setup(targetElement)
  }
  renderData(target: Element) {
    this.landmarker.renderDataTarget = target

  }

}

