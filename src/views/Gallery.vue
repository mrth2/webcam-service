<template>
  <div id="gallery">
    <div class="container" v-if="!isLoading">
      <div class="row" v-for="(_videos, index) in videos" :key="index">
        <div :class="columnClass" v-for="video in _videos" :key="video.token" :ref="video.token"></div>
      </div>
    </div>
    <div class="loading" v-else>
      <inline-svg src="/img/loading.svg"/>
    </div>
  </div>
</template>

<script>
import Ziggeo from 'ziggeo'

export default {
  data() {
    return {
      isLoading: true,
      videos: []
    }
  },
  inject: ['ziggeoApp'],
  computed: {
    column() {
      const w = window.innerWidth
      if (w > 1000) {
        return 3
      }
      else if (w > 468) {
        return 2
      }
      else {
        return 1
      }
    },
    columnClass() {
      return `col-${12/this.column}`
    }
  },
  methods: {
    async parseVideoList(videos) {
      videos.forEach((video, index) => {
        if (index % this.column === 0) {
          this.videos.push([video])
        } else {
          this.videos[this.videos.length - 1].push(video)
        }
      })
    },
    renderVideos() {
      this.videos.forEach((_videos) => {
        _videos.forEach(video => this.renderVideo(video.token))
      })
    },
    renderVideo(videoToken) {
      if (this.$refs[videoToken]) {
        const player = new window.ZiggeoApi.V2.Player({
          element: this.$refs[videoToken],
          attrs: {
            video: videoToken,
            width: '100%',
            height: 'auto',
            theme: 'elevate',
            themecolor: 'green'
          }
        })
        player.activate()
      } else {
        setTimeout(() => this.renderVideo(videoToken), 50)
      }
    }
  },
  mounted() {
    const _this = this
    const {token, privateKey, encryptionKey} = this.$store.getters['getZiggeoApplicationKeys']
    const ZiggeoSdk = new Ziggeo(token, privateKey, encryptionKey)
    ZiggeoSdk.Videos.index({
      limit: 100,
      tags: this.$store.getters['getUserID']
    }, {
      async success(index) {
        await _this.parseVideoList(index)
        _this.isLoading = false
        _this.renderVideos()
      },
      failure(args, error) {
        console.log(error)
      }
    })
  }
}
</script>