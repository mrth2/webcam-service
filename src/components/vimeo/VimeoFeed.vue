<template>
  <div ref="video" id="vimeo-feed" class="vimeo-feed box-shadow"></div>
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
    player.on('loaded', () => {
      const playerHead = document.getElementById('vimeo-feed').querySelector('iframe').contentWindow.document.head
      console.log(playerHead)
      let link = document.createElement('link')
      link.href = 'https://fonts.googleapis.com/css?family=Poppins:800,regular,|Nunito+Sans:200,700,regular,|whomp:100,200,300,400,500,600,700,800,900|Nunito+Sans:100,200,300,400,500,600,700,800,900|Array:100,200,300,400,500,600,700,800,900|Poppins:100,200,300,400,500,600,700,800,900'
      link.rel = 'stylesheet'
      link.type = 'text/css'
      player.element.ownerDocument.head.appendChild(link)

      let style = document.createElement("style")
      style.textContent = `
      .player {
        font-family: "Poppins", serif !important;
      `
      player.element.ownerDocument.head.appendChild(style)
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
  height: 360px;
}
</style>