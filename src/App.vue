<template>
  <div id="nav">
    <router-link to="/">Home</router-link>
    |
    <router-link to="/gallery">Gallery</router-link>
  </div>

  <div class="loading" v-if="!isAppReady">
    <img src="./assets/loading.svg"/>
  </div>
  <router-view v-else/>
</template>

<script>
export default {
  name: 'LeGrandFourire Live',
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
    this.ziggeoApp.embed_events.on('seek', (embedding, position) => {
      console.log(embedding, position)
    })
  }
}
</script>

<style lang="scss">
@import "~bootstrap/scss/bootstrap";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
