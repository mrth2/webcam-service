<template>
  <div class="home">
    <div class="container" v-if="ziggeoGranted">
      <div class="row">
        <div class="col-lg-6 col-md-12 mb-1 mb-md-0 align-self-center">
          <vimeo-feed></vimeo-feed>
        </div>
        <div class="col-lg-6 col-md-12 mb-1 mb-md-0 align-self-center">
          <ziggeo-mirror></ziggeo-mirror>
        </div>
      </div>
      <div class="row mt-xxl-5 text-center">
        <a href="https://www.jedonneenligne.org/fondationquebecoiseducancer/WGFR21/" target="_blank">
          <div class="btn btn-primary">Faire un don</div>
        </a>
      </div>
    </div>
    <div class="container" v-else>
      <img class="col-lg-12" src="https://legrandfourire.wpengine.com/wp-content/uploads/2021/04/Banner-Hero-1.jpg">
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
