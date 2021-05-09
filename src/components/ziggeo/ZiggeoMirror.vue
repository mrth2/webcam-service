<template>
  <div ref="recorder"></div>
  <!--  <ziggeo-recorder
        theme="elevate"
        theme-color="green"
        :apiKey="apiKey"
        width="100%"
        height="auto"
        :flipscreen=true
        :gallerysnapshots=10
        :allowscreen="true"
        :tags="tags"
        @recorderReady="recorderReady"
        @camera_unresponsive="recorderCameraUnresponsive"
        @access_forbidden="recorderAccessForbidden"
        @upload_selected="recorderUploadSelected"
    ></ziggeo-recorder>-->
</template>
<script>
//import {useStore} from 'vuex';
//import {ref} from 'vue'

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
        themecolor: 'green',
        flipscreen: true,
        gallerysnapshots: 10,
        allowscreen: true,
        tags: [this.$store.getters['getUserID']]
      }
    })
    this.recorder.activate()
  }
  /*setup() {
    // eslint-disable-next-line no-unused-vars
    let recorderInstance;
    const store = useStore()
    const apiKey = store.getters['getZiggeoApiKey'];

    const tags = ref([store.getters['getUserID']])

    const recorderReady = (instance) => {
      recorderInstance = instance;
    };

    // eslint-disable-next-line no-unused-vars
    const recorderCameraUnresponsive = (embedding) => {
      console.log('camera unresponsive');
    };

    // eslint-disable-next-line no-unused-vars
    const recorderAccessForbidden = (embedding) => {
      console.log('access forbidden');
    };

    const recorderUploadSelected = (embedding, file) => {
      console.log('upload selected', file);
    };

    return {
      apiKey,
      tags,
      recorderReady,
      recorderAccessForbidden,
      recorderCameraUnresponsive,
      recorderUploadSelected
    };
  }*/
}
</script>