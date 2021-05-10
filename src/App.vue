<template>
  <the-header/>

  <div class="loading" v-if="!isAppReady">
    <inline-svg src="/img/loading.svg"/>
  </div>
  <router-view ref="routerView" v-else/>

  <the-footer/>

  <svg-icon/>
</template>

<script>
import TheHeader from '@/components/global/Header.vue'
import TheFooter from '@/components/global/Footer.vue'
import SvgIcon from '@/components/global/SvgIcon.vue'

export default {
  name: 'LeGrandFourire Live',
  components: {
    TheHeader, TheFooter, SvgIcon
  },
  data() {
    const ziggeoApp = new window.ZiggeoApi.V2.Application({
      token: this.$store.getters['getZiggeoApiKey'],
      webrtc_streaming_if_necessary: true,
      webrtc_on_mobile: true,
      auth: true
    })
    return {
      ziggeoApp
    }
  },
  provide() {
    return {
      ziggeoApp: this.ziggeoApp
    }
  },
  computed: {
    isAppReady() {
      return this.$store.getters['isAppReady']
    }
  },
  methods: {
    checkAppReady() {
      if (this.isAppReady) {
        this.setupEvents()
      } else {
        setTimeout(() => {
          this.checkAppReady()
        }, 200)
      }
    },
    setupEvents() {
      this.$crisp.push(["on", "chat:opened", () => {
        this.$mixpanel.track('Chat opened')
      }])
      this.$crisp.push(["on", "chat:closed", () => {
        this.$mixpanel.track('Chat closed')
      }])
      this.$crisp.push(["on", "user:email:changed", () => {
        this.$mixpanel.people.set('$email', this.$crisp.get('user:email'))
      }])
      this.$crisp.push(["on", "user:nickname:changed", () => {
        this.$mixpanel.people.set('Full name', this.$crisp.get('user:nickname'))
      }])
    }
  },
  mounted() {
    this.ziggeoApp.on('ready', () => {
      this.checkAppReady()
    })
    this.ziggeoApp.embed_events.on("ready_to_record", () => {
      this.$mixpanel.track('Ziggeo Recorder Ready')
    })
    this.ziggeoApp.embed_events.on("recording", () => {
      this.$mixpanel.track('User start recording')
    })
    this.ziggeoApp.embed_events.on("recording_stopped", () => {
      this.$mixpanel.track('User stop recording')
    })
    this.ziggeoApp.embed_events.on("rerecord", () => {
      this.$mixpanel.track('User discard recorded video & restart record')
    })
    this.ziggeoApp.embed_events.on("uploaded", () => {
      this.$mixpanel.track('User uploaded recorded video')
    })
  }
}
</script>

<style lang="scss">
@import "~bootstrap/scss/bootstrap";

body {
  background-color: #EDF1F3;
  font-family: "Poppins", serif;
  -webkit-text-size-adjust: 100%;
  --swiper-theme-color: #007aff;
  --swiper-navigation-size: 44px;
  box-sizing: inherit;
  margin: 0;
  line-height: 1.6;
  font-size: 16px;
  font-weight: 400;
  color: #404040;
  overflow-x: hidden;
  padding-top: 120px;

  footer {
    margin-top: 120px;
  }
}

.loading {
  display: block;
  width: 100%;
  text-align: center;
  align-content: center;

  svg {
    background-color: #EDF1F3 !important;
  }
}

.modal-dialog {
  margin-top: 80px;
}
</style>
