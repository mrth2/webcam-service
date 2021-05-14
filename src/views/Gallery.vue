<template>
  <div id="gallery">
    <div class="container" v-if="!isLoading">
      <template v-if="videos.length">
        <div class="row" v-for="(_videos, index) in videos" :key="index">
          <div :class="columnClass" v-for="video in _videos" :key="video.token">
            <div class="card" :ref="`${video.token}-card`">
              <div class="card-img-top">
                <div :ref="video.token"></div>
              </div>
              <div class="card-body">
                <p class="card-text">Recorded on
                  {{ new Date(video.submission_date * 1000).toLocaleString('fr-FR', {hour12: false}) }}</p>
                <p class="card-text">Duration: {{ video.duration.toFixed(2) }}s</p>
                <div class="btn-group text-end" role="group" aria-label="Video Actions">
                  <btn type="link" extraClass="card-link, p-0" @click="downloadVideo(video.token)">Download</btn>
                  <btn type="link" extraClass="card-link, link-danger" @click="deleteVideo(video.token)">Delete</btn>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-xxl-5">
          <p class="text-center">
            <router-link to="/">Start recording new video</router-link>
          </p>
        </div>
      </template>
      <template v-else>
        <div class="row">
          <div class="col-lg-6 offset-3 p-5 alert alert-light text-center" role="alert">
            You do not have any records.
            <router-link to="/">Upload one here!</router-link>
          </div>
        </div>
      </template>
    </div>
    <div class="loading" v-else>
      <inline-svg src="/img/loading.svg"/>
    </div>
  </div>

  <modal-confirm v-if="confirm.show" :title="confirm.title" :message="confirm.message" :yes-btn="confirm.yesBtn"
                 @confirm="confirm.yes"
                 @cancel="confirm.cancel"
                 @dismiss="confirm.cancel"></modal-confirm>
  <toast v-if="toast.show" :message="toast.message" @dismiss="toast.dismiss"></toast>
</template>

<script>
import fs from 'fs'
import Ziggeo from 'ziggeo'
import Btn from '@/components/global/Button.vue'
import ModalConfirm from '@/components/global/ModalConfirm.vue'
import Toast from '@/components/global/Toast.vue'

export default {
  components: {
    Btn, ModalConfirm, Toast
  },
  data() {
    return {
      confirm: this.defaultConfirm(),
      toast: this.defaultToast(),
      ZiggeoSdk: null,
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
      } else if (w > 468) {
        return 2
      } else {
        return 1
      }
    },
    columnClass() {
      return `col-${12 / this.column}`
    }
  },
  methods: {
    defaultToast() {
      return {
        show: false,
        message: null,
        dismiss: () => {
          this.toast.show = false
          this.toast.message = null
        }
      }
    },
    defaultConfirm() {
      return {
        show: false,
        yes: () => {
        },
        cancel: () => {
          this.confirm = this.defaultConfirm()
        },
        title: 'Delete this video?',
        message: 'Are you sure? This action can not be undone!',
        yesBtn: "Let's delete it"
      }
    },
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
    },
    downloadVideo(token) {
      this.ZiggeoSdk.Videos.download_video(token, {
        success: (data) => {
          fs.writeFileSync(token + '.mp4', Buffer.from(data, 'binary'))
          this.$mixpanel.track('User download video', {
            videoToken: token
          })
        },
        failure: (args, error) => {
          this.$mixpanel.track('Fail to download video', {
            videoToken: token,
            error: error
          })
        }
      })
    },
    deleteVideo(token) {
      this.confirm.yes = () => {
        this.ZiggeoSdk.Videos.destroy(token, {
          success: () => {
            this.$mixpanel.track('User delete video', {
              videoToken: token
            })
            this.$refs[`${token}-card`].remove()
            this.confirm.cancel()
            this.toast.show = true
            this.toast.message = `Deleted your video ${token}`
          },
          failure: (args, error) => {
            this.$mixpanel.track('Fail to delete video', {
              videoToken: token,
              error: error
            })
            this.toast.show = true
            this.toast.message = 'Failed to delete your video!!!'
          }
        })
      }
      this.confirm.show = true
    }
  },
  mounted() {
    const {token, privateKey, encryptionKey} = this.$store.getters['getZiggeoApplicationKeys']
    this.ZiggeoSdk = new Ziggeo(token, privateKey, encryptionKey)
    this.ZiggeoSdk.Videos.index({
      limit: 100,
      tags: this.$store.getters['getUserID']
    }, {
      success: async (index) => {
        await this.parseVideoList(index)
        this.isLoading = false
        this.renderVideos()
      },
      failure: (args, error) => {
        console.log(error)
      }
    })
  }
}
</script>