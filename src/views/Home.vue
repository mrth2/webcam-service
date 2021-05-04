<template>
  <div class="loading" v-if="crispLoading">
    <img src="../assets/loading.svg"/>
  </div>
  <template v-else>
    <div class="home">
      <div class="container">
        <div class="row align-items-start">
          <div class="col-lg-6">
            <VimeoFeed></VimeoFeed>
          </div>
          <div class="col-lg-6">
            <WebCamMirror></WebCamMirror>
          </div>
        </div>
      </div>
    </div>
    <gather-user-info :name="name" :email="email" :location="location"></gather-user-info>
  </template>
</template>

<script>
// @ is an alias to /src
import VimeoFeed from '@/components/VimeoFeed.vue'
import WebCamMirror from '@/components/WebCamMirror.vue'
import GatherUserInfo from '@/components/GatherUserInfo.vue'
import helpers from '@/helpers/helpers.js'

export default {
  name: 'Home',
  components: {
    VimeoFeed,
    WebCamMirror,
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
      default: '',
    }
  },
  data() {
    return {
      crispLoading: true
    }
  },
  created() {
    this.checkCrispLoaded()
  },
  methods: {
    checkCrispLoaded() {
      if (window.CRISP_READY) {
        this.crispLoading = false
      } else {
        setTimeout(this.checkCrispLoaded, 500)
      }
    }
  }
}
</script>


<style scoped lang="scss">
div.col-lg-6 {
  & > div {
    border-style: double;
    max-width: 80%;
    margin: 0 auto;
  }
}
</style>
