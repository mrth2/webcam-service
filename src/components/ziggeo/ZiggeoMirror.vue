<template>
  <div class="row" style="position: relative">
    <div ref="recorder" class="mx-auto"></div>
  </div>
</template>
<script>
import {mount} from '@/plugin/mounter'
import CameraButton from './CameraButton.vue'

export default {
  name: 'ZiggeoMirror',
  data() {
    return {
      recorder: null
    }
  },
  inject: ['ziggeoApp'],
  mounted() {
    this.recorder = new window.ZiggeoApi.V2.Recorder({
      element: this.$refs.recorder,
      attrs: {
        width: '100%',
        height: 'auto',
        theme: 'elevate',
        themecolor: 'red',
        'flip-camera': true,
        flipscreen: true,
        gallerysnapshots: 10,
        allowscreen: true,
        tags: [this.$store.getters['getUserID']],
        skipinitial: true,
        skipinitialonrerecord: true,
        stretch: true,
        picksnapshots: false,
        snapshotfromuploader: true,
        snapshotfrommobilecapture: true,
        allowpip: true,
        airplay: true,
        camerafacefront: true,
        allowmultistreams: true,
        timelimit: 10,
        createthumbnails: true,
        forcerefresh: true
      }
    })
    this.recorder.activate()
    this.recorder.on('ready_to_play', () => {
      this.recorder.reset()
    })

    this.recorder.on('bound', () => {
      const buttonContainer = this.$refs.recorder.querySelector('.ba-videorecorder-settings-button-container')
      if (buttonContainer) {
        /*const cameraButton = document.createElement('div')
        cameraButton.id = 'customCameraButton'
        buttonContainer.appendChild(cameraButton)*/

        const {el} = mount(CameraButton, {
          props: {
            rootApp: this.$root,
            recorder: this.recorder
          },
          app: this.$root
        })
        buttonContainer.appendChild(el)
      }
    })
  },
  methods: {}
}
</script>

<style scoped>
.box-shadow {
  background-color: #073653 !important;
}
</style>

<style>
div[class^="ba-videorecorder-chooser-button-"] span, .ba-videorecorder-message-message {
  font-family: "Poppins", serif !important;
}

.ba-videorecorder-chooser-container {
  background-color: #EE4A0B !important;
}
.ba-recorder-overlay .ba-commoncss-icon-state-good {
  color: #EE4A0B !important;
}
</style>
