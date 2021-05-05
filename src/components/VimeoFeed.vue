<template>
  <div ref="video" class="vimeo-feed"></div>
</template>

<script>
import Player from '@vimeo/player'

export default {
  data() {
    return {
      videoId: 545075014
    }
  },
  mounted() {
    const player = new Player(this.$refs.video, {
      id: this.videoId,
      autoplay: true,
      responsive: true
    })
    player.on('play', (data) => {
      this.$mixpanel.track('Play video', data)
    })
    player.on('pause', (data) => {
      this.$mixpanel.track('Pause video', data)
    })
    player.on('volumechange', (data) => {
      this.$mixpanel.track('Change volume', data)
    })
    player.on('fullscreenchange', (data) => {
      this.$mixpanel.track('Toggle fullscreen', data)
    })
    player.on('qualitychange', (data) => {
      this.$mixpanel.track('Change video quality', data)
    })
    player.on('seeked', (data) => {
      this.$mixpanel.track('Seek video', data)
    })
  }
}
</script>

<style scoped lang="scss">
iframe.vimeo-feed {
  width: 100%;
  height: 400px;
}
</style>