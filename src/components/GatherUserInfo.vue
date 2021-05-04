<template>
  <teleport to="body">
    <div id="modalGatherUserInfo" class="modal fade" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Welcome to LegrandFourire Live Service!!!</h5>
          </div>
          <div class="modal-body">
            <p>Let's sign up to start using our application in 30 seconds</p>
            <form class="row g-3 needs-validation" :class="{'was-validated': hasError}" @submit.prevent="submitUserInfo"
                  novalidate>
              <template v-if="!isLoading">
                <div class="mb-3">
                  <label for="u-name" class="form-label">Your Name</label>
                  <input type="text" class="form-control" id="u-name" placeholder="Enter your name please..."
                         v-model="nameInput" required>
                  <div class="invalid-feedback" v-if="error.name" v-html="error.name"></div>
                </div>
                <div class="mb-3">
                  <label for="u-email" class="form-label">Your Email</label>
                  <input type="email" class="form-control" id="u-email" placeholder="Enter your email please..."
                         aria-describedby="emailHelp" v-model="emailInput" required>
                  <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                  <div class="invalid-feedback" v-if="error.email" v-html="error.email"></div>
                </div>
                <div class="mb-3">
                  <label for="u-location" class="form-label">Your Address</label>
                  <input type="text" class="form-control" id="u-location" placeholder="Enter your location please..."
                         v-model="locationInput">
                  <div class="invalid-feedback" v-if="error.location" v-html="error.location"></div>
                </div>
                <div class="mb-3">
                  <button type="submit" class="btn btn-primary mb-3">Sign Up Now</button>
                </div>
              </template>
              <div class="loading" v-else>
                <img src="src/assets/loading.svg"/>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import helpers from '@/helpers/helpers.js'
import {Modal} from 'bootstrap'

export default {
  props: ['name', 'email', 'location'],
  data() {
    return {
      isLoading: false,
      isShow: false,
      error: {
        name: null,
        email: null,
        location: null
      }
    }
  },
  computed: {
    nameInput() {
      return this.name
    },
    emailInput() {
      return this.email
    },
    locationInput() {
      return this.location
    },
    userID() {
      return this.$store.getters['getUserID']
    },
    hasError() {
      return this.error.email !== null || this.error.name !== null || this.error.location !== null
    }
  },
  methods: {
    clearError() {
      this.error = {
        name: null,
        email: null,
        location: null
      }
    },
    submitUserInfo() {
      this.clearError()
      if (this.nameInput === '') {
        this.error.name = 'Please enter your name'
      }
      if (!helpers.validateEmail(this.emailInput)) {
        this.error.email = 'Please enter a valid email'
      }
      if (this.location === '') {
        this.error.location = 'Please enter your address'
      }
      if (this.hasError) return false
      this.isLoading = true

      this.syncCrisp()
      this.syncMixpanel(() => {
        this.isLoading = false
      })
    },
    syncMixpanel(callback) {
      // sync to mixpanel
      this.$mixpanel.people.set_once({
        "Full name": this.nameInput,
        "$email": this.emailInput,
        "USER_ID": this.userID,
        "Sign up date": new Date().toISOString(),
        "Location": this.locationInput
      }, () => {
        if (typeof callback === 'function') callback()
      })
    },
    syncCrisp() {
      // sync to crisp
      this.$crisp.push(["set", "user:nickname", [this.nameInput]])
      this.$crisp.push(["set", "user:email", [this.emailInput]])
      this.$crisp.push(["set", "session:data", [[["userID", this.userID]]]])
    },
    showModal() {
      new Modal(document.getElementById('modalGatherUserInfo'), {
        backdrop: 'static',
        keyboard: false
      }).show()
    }
  },
  mounted() {
    // mixpanel
    this.$mixpanel.opt_in_tracking()
    // crisp
    const crispStoredUserEmail = this.$crisp.get("user:email")
    // process props
    if (this.$props.email && this.$props.name && this.$props.location) {
      // sync info to crisp
      if (crispStoredUserEmail === null) {
        this.syncCrisp()
      }
      this.syncMixpanel()
    }
    // no stored email => show modal to gather
    else if (!crispStoredUserEmail) {
      this.showModal()
    }
  }
}
</script>