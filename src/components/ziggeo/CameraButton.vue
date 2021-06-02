<template>
  <div class="ba-videorecorder-circle-button" ba-show="true" @click="takeSnapshot">
    <div data-selector="record-button-take-snapshot" class="ba-videorecorder-button-inner">
      <inline-svg src="/img/camera.svg" width="16" height="16"/>
    </div>
  </div>

  <teleport to="body">
    <div id="modalUploadSnapshot" ref="modalUploadSnapshot" class="modal fade" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Téléverser cette photo?</h5>
          </div>
          <div class="modal-body">
            <canvas id="snapshotCanvas" ref="snapshotCanvas" class="d-none"></canvas>
            <img class="img-fluid" alt="" :src="snapshotImage">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="hideSnapshotModal">Annuler</button>
            <button
                v-if="!uploading"
                type="button" class="btn btn-primary"
                @click="uploadSnapshot">
              Téléverser
            </button>
            <button
                v-else
                class="btn btn-primary bg-danger border-danger"
                type="button" disabled
            >
              <span class="spinner-border spinner-border-sm align-middle mr-2" role="status" aria-hidden="true"></span>
              Téléversement en cours
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>

  <toast v-if="toast.show" :message="toast.message" @dismiss="toast.dismiss"></toast>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal'
import InlineSvg from 'vue-inline-svg'
import axios from "axios"
import Toast from '@/components/global/Toast.vue'

export default {
  components: {
    InlineSvg, Toast
  },
  props: {
    rootApp: {
      type: Object,
      default() {
      }
    },
    recorder: {
      type: Object,
      default() {
      }
    }
  },
  data() {
    return {
      toast: this.defaultToast(),
      modal: null,
      showSnapshot: false,
      snapshotImage: null,
      uploading: false
    }
  },
  computed: {
    cloudinary() {
      return this.rootApp.$store.getters.getCloudinaryConfig
    }
  },
  methods: {
    defaultToast() {
      return {
        type: 'success',
        show: false,
        message: null,
        dismiss: () => {
          this.toast.type = 'success'
          this.toast.show = false
          this.toast.message = null
        }
      }
    },
    hideSnapshotModal() {
      if (this.modal) {
        this.showSnapshot = false
        this.modal.hide()
        this.snapshotImage = null
      }
    },
    showSnapshotModal() {
      if (!this.modal) {
        this.modal = new Modal(this.$refs.modalUploadSnapshot, {
          backdrop: 'static',
          keyboard: false
        })
      }
      this.modal.show()
    },
    takeSnapshot() {
      const video = this.recorder.activeElement().querySelector('video')
      this.showSnapshot = true
      setTimeout(() => {
        this.showSnapshotModal()
        const canvas = this.$refs.snapshotCanvas
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        // draw video to canvas
        canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
        this.snapshotImage = canvas.toDataURL()
      }, 500)
    },
    uploadSnapshot() {
      if (this.cloudinary.cloudname.length === 0 || this.cloudinary.preset.length === 0) {
        console.log(`Upload to Cloudinary unsuccessful: use settings to provide cloud name and preset`)
        return
      }
      this.uploading = true
      this.uploadToCloudinary(this.cloudinary.cloudname, this.cloudinary.preset, this.$refs.snapshotCanvas.toDataURL("image/jpeg"))
          .then(result => {
            this.hideSnapshotModal()

            this.toast.show = true
            this.toast.message = `Téléversement réussi!`

            // eslint-disable-next-line no-console
            console.log("upload to cloudinary:", result)

            // track mixpanel
            this.rootApp.$mixpanel.track('Uploaded snapshot', result);
          })
          .catch(err => {
            this.toast.show = true
            this.toast.message = 'Échec du téléchargement!'
            this.toast.type = 'warning'

            console.log(`Upload to Cloudinary unsuccessful. Check settings.`)
            // eslint-disable-next-line no-console
            console.log("upload to cloudinary error:", err)
          })
          .finally(() => {
            this.uploading = false;
          })
    },
    // https://cloudinary.com/documentation/image_upload_api_reference
    // https://codepen.io/team/Cloudinary/pen/Edxjbj
    // https://support.cloudinary.com/hc/en-us/articles/209754169-Is-it-possible-to-upload-directly-to-Cloudinary-using-pure-Javascript-code-
    async uploadToCloudinary(cloudName, preset, fileData) {
      let fd = new FormData()
      let url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
      fd.append("upload_preset", preset)
      fd.append("tags", "browser_upload")
      fd.append("file", fileData)
      let res = await axios({
        method: "post",
        url: url,
        data: fd
      })
      return await res.data
    }
  }
}
</script>
