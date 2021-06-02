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
  computed: {
      snapshotInitialized() {
        return this.$store.getters.snapshotInitialized
      }
  },
  mounted() {
    this.recorder = new window.ZiggeoApi.V2.Recorder({
      element: this.$refs.recorder,
      attrs: {
        width: '100%',
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
      // only append camera button if snapshot button is not initialized
      if (!this.snapshotInitialized) {
        const buttonContainer = this.$refs.recorder.querySelector('.ba-videorecorder-settings-button-container')
        if (buttonContainer) {
          const {el} = mount(CameraButton, {
            props: {
              rootApp: this.$root,
              recorder: this.recorder
            },
            app: this.$root
          })
          buttonContainer.appendChild(el)
          this.$store.commit('setSnapshotInitialized', true)
        }
      }
    })
  },
  methods: {}
}
</script>

<style scoped lang="scss">
.box-shadow {
  background-color: #073653 !important;
}

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
