import { FilesetResolver, DrawingUtils, PoseLandmarker } from '@mediapipe/tasks-vision'

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
export class StaffPoseLandmarker {
  id: string
  constructor(score, staff) {
    this.id = score.register(this)
 
  }
  addElements(targetElement) {
    this.containerElement = document.createElement("div")
    this.canvasElement = document.createElement("canvas")
    this.canvasCtx = this.canvasElement.getContext("2d")
    this.drawingUtils = new DrawingUtils(this.canvasCtx);
    this.video = document.createElement("video")
    this.video.setAttribute("autoplay", true)
    this.containerElement.appendChild(this.video)
    this.containerElement.appendChild(this.canvasElement)
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
  processResults(result) {
    this.canvasCtx.save();
    this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    for (const landmark of result.landmarks) {
      this.drawingUtils.drawLandmarks(
        landmark, 
        {
          radius: data => DrawingUtils.lerp(
            data.from.z, 
            -0.15, 0.1, 5, 1)
        }
      );
      this.drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
    }
    this.canvasCtx.restore();
  }
  renderLoop() {
    if (this.video.currentTime !== this.lastVideoTime) {
      const poseLandmarkerResult = this.poseLandmarker.detectForVideo(this.video, this.video.currentTime * 1000);
      this.processResults(poseLandmarkerResult);
      this.lastVideoTime = this.video.currentTime;
    }
    requestAnimationFrame(() => {
      this.renderLoop();
    });
  }


}

