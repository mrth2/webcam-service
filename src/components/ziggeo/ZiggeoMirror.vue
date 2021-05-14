<template>
  <div ref="recorder" class="box-shadow"></div>
</template>
<script>
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
        height: 350,
        theme: 'elevate',
        themecolor: 'green',
        'flip-camera': true,
        flipscreen: true,
        gallerysnapshots: 10,
        allowscreen: true,
        tags: [this.$store.getters['getUserID']],
        skipinitial: true,
        stretch: true,
        snapshotfromuploader: true,
        snapshotfrommobilecapture: true,
        allowpip: true,
        airplay: true,
        camerafacefront: true,
        allowmultistreams: true
      }
    })
    this.recorder.activate()
  }
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
  background-color: #073653 !important;
}
</style>