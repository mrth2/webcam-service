<template>
  <div class="camera">
    <div class="row mt-3">
      <div class="col-sm-12">
        <div class="actions">
          <div class="btn-group">
            <btn v-if="!cameraState" :disabled="isStartEnabled" @click="start">Camera</btn>
            <btn v-if="cameraState" :disabled="isStartEnabled" @click="stop">Stop</btn>
            <btn v-if="cameraState" :disabled="isStartEnabled" @click="snapshot">Snapshot</btn>
            <btn v-if="isPhoto" :disabled="!isPhoto" @click="download">Download</btn>
            <btn v-if="isPhoto" :disabled="uploadDisabled" @click="upload">Upload</btn>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-3" v-if="cameraState">
      <div class="col-sm-12">
        <div class="actions">
          <div class="btn-group">
            <btn @click="toggleFlipX">Flip webcam left right</btn>
            <btn @click="toggleFlipY">Flip webcam up down</btn>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-3" v-if="isPermissionDenied">
      <div class="col-sm-12">
        <div class="alert alert-danger mx-3" role="alert">
          It looks like your browser is blocking access to webcam identifiers. Because of this, it’s impossible to
          detect and manage all available webcams.
        </div>
        <div class="alert alert-info mx-3" role="alert">
          <img class="img-fluid" src="../assets/camera-block.jpg" alt="">
          <p class="mt-3">Please allow the camera permission in order to start using your webcam</p>
        </div>
      </div>
    </div>
    <template v-else>
      <div class="row">
        <div class="col-sm-12">
          <form>
            <select class="form-select form-select-sm" v-model="selectedDevice" @change="deviceChange">
              <option value="null" v-if="!selectedDevice" selected>Please allow us to "Use your camera"</option>
              <option v-for="option in options" :value="option.value" :key="option.value">{{ option.text }}</option>
            </select>
          </form>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <div class="m-3">
            <video :class="videoClasses" v-show="cameraState" playsinline autoplay></video>
            <canvas v-show="!cameraState"></canvas>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
// https://cloudinary.com/documentation/image_upload_api_reference
// https://codepen.io/team/Cloudinary/pen/Edxjbj
// https://support.cloudinary.com/hc/en-us/articles/209754169-Is-it-possible-to-upload-directly-to-Cloudinary-using-pure-Javascript-code-
async function uploadToCloudinary(cloudName, preset, fileData) {
  let fd = new FormData()
  let url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
  fd.append("upload_preset", preset)
  fd.append("tags", "browser_upload")
  fd.append("file", fileData)
  let res = await axios({
    method: "post",
    url: url,
    data: fd
  })
  return await res.data
}

// import cloudinary from "cloudinary-core"
import axios from "axios"
import {mapState} from "vuex"
import Btn from '@/components/global/Button.vue'

export default {
  components: {
    Btn
  },
  name: "Camera",
  data() {
    return {
      video: null,
      canvas: null,
      fileData: null,
      isStartEnabled: true,
      isPhoto: false,
      stream: null,
      currentStream: null,
      devices: [],
      options: [],
      constraints: {},
      selectedDevice: null,
      cameraState: true,
      flipX: true,
      flipY: false,
      isPermissionDenied: false
    }
  },
  computed: {
    ...mapState(["cloudinary"]),
    uploadDisabled() {
      return !this.isPhoto || this.cloudinary.cloudname.length === 0 || this.cloudinary.preset.length === 0
    },
    videoClasses() {
      return {
        flipX: this.flipX,
        flipY: this.flipY
      }
    }
  },
  methods: {
    upload: function () {
      if (this.cloudinary.cloudname.length === 0 || this.cloudinary.preset.length === 0) {
        console.log(`Upload to Cloudinary unsuccessful: use settings to provide cloudname and preset`)
        return
      }
      uploadToCloudinary(this.cloudinary.cloudname, this.cloudinary.preset, this.fileData)
          .then(result => {
            console.log(`Upload to Cloudinary successful`)
            this.cameraState = true

            // eslint-disable-next-line no-console
            console.log("upload to cloudinary:", result)

            // track mixpanel
            this.$mixpanel.track('Uploaded snapshot', result);
          })
          .catch(err => {
            console.log(`Upload to Cloudinary unsuccessful. Check settings.`)
            // eslint-disable-next-line no-console
            console.log("upload to cloudinary error:", err)
          })
    },
    snapshot: function () {
      this.canvas.width = this.video.videoWidth
      this.canvas.height = this.video.videoHeight
      this.canvas
          .getContext("2d")
          .drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height)
      this.fileData = this.canvas.toDataURL("image/jpeg")
      this.isPhoto = true
      this.cameraState = false
      //remove any hidden links used for download
      document.querySelectorAll(".hidden_links").forEach((hiddenLink) => {
        hiddenLink.remove()
      })
    },
    stop: function () {
      this.video.pause()
      if (this.currentStream) {
        this.currentStream.getTracks().forEach(track => {
          track.stop()
        })
        this.video.srcObject = null
      }

      this.video.removeAttribute("src")
      this.video.load()
      this.canvas
          .getContext("2d")
          .clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.isPhoto = false
      this.cameraState = false
    },
    start: function () {
      this.stop()
      //when starting up again use first option
      this.selectedDevice = this.options[0].value
      this.getMedia().then(result => {
        this.isStartEnabled = false
        this.cameraState = true
        // eslint-disable-next-line no-console
        console.log("start camera:", result)
      })
    },
    download: function () {
      if (this.fileData) {
        this.canvas.width = this.video.videoWidth
        this.canvas.height = this.video.videoHeight
        this.canvas
            .getContext("2d")
            .drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height)
        let a = document.createElement("a")
        a.classList.add("hidden-link")
        a.href = this.fileData
        a.textContent = ""
        a.target = "_blank"
        a.download = "photo.jpeg"
        document.querySelector("body").append(a)
        a.click()
      }
    },
    getMedia: async function () {
      this.stream = await navigator.mediaDevices.getUserMedia(
          this.constraints
      )
      window.stream = this.stream
      this.currentStream = window.stream
      this.video.srcObject = window.stream
      if (!this.selectedDevice) {
        this.getDevices().then(res => {
          //when first loaded selected device can use 1st option
          if (this.options.length) this.selectedDevice = this.options[0].value
          this.setConstraints()
          // eslint-disable-next-line no-console
          console.log("get devices:", res)
        })
      }
      return true
    },
    deviceChange: function () {
      this.stop()
      //don't change selected device
      this.setConstraints()
      this.getMedia().then(result => {
        this.isStartEnabled = false
        this.cameraState = true
        // eslint-disable-next-line no-console
        console.log("device change:", result)
      })
    },
    setConstraints: function () {
      const videoConstraints = {}

      if (this.selectedDevice === null) {
        videoConstraints.facingMode = "environment"
      } else {
        videoConstraints.deviceId = {
          exact: this.selectedDevice
        }
      }

      this.constraints = {
        video: videoConstraints,
        audio: false
      }
    },
    getDevices: async function () {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        return false
      }
      let allDevices = await navigator.mediaDevices.enumerateDevices()
      for (let mediaDevice of allDevices) {
        if (mediaDevice.kind === "videoinput" && mediaDevice.label && mediaDevice.deviceId) {
          let option = {}
          option.text = mediaDevice.label
          option.value = mediaDevice.deviceId
          this.options.push(option)
          this.devices.push(mediaDevice)
        }
      }
      return true
    },
    toggleFlipX() {
      this.flipX = !this.flipX
    },
    toggleFlipY() {
      this.flipY = !this.flipY
    }
  },
  mounted() {
    this.canvas = document.querySelector("canvas")
    this.video = document.querySelector("video")
    this.getDevices()
        .then(res => {
          //when first loaded selected device can use 1st option
          if (this.options.length) this.selectedDevice = this.options[0].value
          this.setConstraints()
          // eslint-disable-next-line no-console
          console.log("get devices:", res)
        })
        .then(() => {
          this.getMedia().then(res => {
            this.isStartEnabled = false
            // eslint-disable-next-line no-console
            console.log("get media", res)
          }).catch(err => {
            if (err.message.indexOf('Permission denied') > -1) {
              this.isPermissionDenied = true
            }
          })
        })
  }
}
</script>

<style scoped lang="scss">
video {
  width: 100%;
  height: 400px;

  &.flipX {
    -webkit-transform: scaleX(-1);
    -moz-transform: scaleX(-1);
    -ms-transform: scaleX(-1);
    -o-transform: scaleX(-1);
    transform: scaleX(-1);
  }

  &.flipY {
    -webkit-transform: scale(-1, -1);
    -moz-transform: scale(-1, -1);
    -ms-transform: scale(-1, -1);
    -o-transform: scale(-1, -1);
    transform: scale(-1, -1);
  }
}

button:disabled {
  background: lightgray;
  color: black;
}

select option:disabled {
  color: lightgray;
  font-weight: bold;
}

form {
  margin: 1em;
}

@media only screen and (min-width: 600px) {
  .btn-group button {
    margin: 0 0.5em;
    border-radius: 1em !important;
    font-size: 1em;
    min-width: 6em;
  }
}

.hidden-link {
  visibility: hidden;
}
</style>
