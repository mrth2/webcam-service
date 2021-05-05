<template>
  <div class="home">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 col-md-12 mb-4 mb-md-0 align-self-end">
          <VimeoFeed></VimeoFeed>
        </div>
        <div class="col-lg-6 col-md-12 mb-4 mb-md-0">
          <Camera></Camera>
        </div>
      </div>
    </div>
  </div>
  <gather-user-info :name="name" :email="email" :location="location"></gather-user-info>
</template>

<script>
// @ is an alias to /src
import VimeoFeed from '@/components/VimeoFeed.vue'
import GatherUserInfo from '@/components/GatherUserInfo.vue'
import helpers from '@/helpers/helpers.js'
import Camera from '@/components/Camera.vue'

export default {
  name: 'Home',
  components: {
    VimeoFeed,
    Camera,
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
  }
}
</script>
