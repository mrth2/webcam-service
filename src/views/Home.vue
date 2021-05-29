<template>
  <div class="home">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 col-md-12 mb-1 mb-md-0 align-self-start">
          <vimeo-feed></vimeo-feed>
        </div>
        <div class="col-lg-4 col-md-12 mb-1 align-self-start">
          <div class="d-flex align-items-end flex-column my-lg-0 my-5">
            <ziggeo-mirror v-if="ziggeoGranted"></ziggeo-mirror>
            <div v-else>
              <img class="img-fluid" src="./../assets/CameraPermissionRequired.png" alt="">
            </div>
            <div class="row mirror-info text-center px-5 m-auto mt-5 align-baseline">
              This is the information about the live event, which will be added later!
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-xxl-5 text-center">
        <a href="https://www.jedonneenligne.org/fondationquebecoiseducancer/WGFR21/" target="_blank">
          <div class="btn btn-primary">Faire un don</div>
        </a>
      </div>
    </div>
  </div>
  <gather-user-info :name="name" :email="email" :location="location"></gather-user-info>
</template>

<script>
// @ is an alias to /src
import VimeoFeed from '@/components/vimeo/VimeoFeed.vue'
import GatherUserInfo from '@/components/auth/GatherUserInfo.vue'
import helpers from '@/helpers/helpers.js'
import ZiggeoMirror from '@/components/ziggeo/ZiggeoMirror.vue'

export default {
  name: 'Home',
  components: {
    VimeoFeed,
    //Camera,
    ZiggeoMirror,
    GatherUserInfo
  },
  props: {
    name: {
      type: String,
      default: '',
      validator(value) {
        return value !== ''
      }
    },
    email: {
      type: String,
      default: '',
      validator(value) {
        return helpers.validateEmail(value)
      }
    },
    location: {
      type: String,
      default: ''
    }
  },
  computed: {
    ziggeoGranted() {
      return this.$store.getters['isZiggeoPermissionGranted']
    }
  }
}
</script>

<style scoped lang="scss">
.home {
  .col-lg-6 {
    height: 360px;
  }
}
</style>
