<template>
  <teleport to="body">
    <div id="modalGatherUserInfo" class="modal fade" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
          </div>
          <div class="modal-body">
            <p>{{ message }}</p>
            <form class="row g-3 needs-validation" :class="{'was-validated': hasError}" @submit.prevent="submitUserInfo"
                  novalidate>
              <template v-if="!isLoading">
                <div class="mb-3">
                  <label for="u-name" class="form-label">Your Name</label>
                  <input type="text" class="form-control" id="u-name" placeholder="Enter your name please..."
                         v-model.trim="nameInput" required>
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
                         v-model.trim="locationInput">
                  <div class="invalid-feedback" v-if="error.location" v-html="error.location"></div>
                </div>
                <div class="mb-3">
                  <button type="submit" class="btn btn-primary mb-3">Sign Up Now</button>
                </div>
              </template>
              <div class="loading" v-else>
                <inline-svg src="/img/loading.svg"/>
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
import Modal from 'bootstrap/js/dist/modal'

const MODAL_TITLE = 'Welcome to LegrandFourire Live Service!!!'
const MODAL_MESSAGE = 'Let\'s sign up to start using our application in 30 seconds'
const MODAL_RESTORE_TITLE = 'Welcome back to LegrandFourire Live Service'
const MODAL_RESTORE_MESSAGE = 'Please confirm your information then start using our application'

export default {
  props: ['name', 'email', 'location'],
  data() {
    return {
      title: MODAL_TITLE,
      message: MODAL_MESSAGE,
      isLoading: false,
      nameInput: '',
      emailInput: '',
      locationInput: '',
      error: {
        name: null,
        email: null,
        location: null
      },
      modal: null
    }
  },
  computed: {
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
      if (this.locationInput === '') {
        this.error.location = 'Please enter your address'
      }
      if (this.hasError) return false
      this.isLoading = true

      this.syncCrisp()
      this.syncMixpanel(() => {
        this.isLoading = false
        this.modal.hide()
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
        this.$mixpanel.alias(this.emailInput)
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
      this.modal = new Modal(document.getElementById('modalGatherUserInfo'), {
        backdrop: 'static',
        keyboard: false
      })
      this.modal.show()
    }
  },
  mounted() {
    if (this.name) this.nameInput = this.name
    if (this.email) this.emailInput = this.email
    if (this.location) this.locationInput = this.location
    // mixpanel
    this.$mixpanel.opt_in_tracking()
    const crispStoredEmail = this.$crisp.get('user:email')
    console.log(crispStoredEmail)
    // process props
    if (this.$props.email && this.$props.name && this.$props.location) {
      // passed email from props is different from crisp session email
      if (crispStoredEmail && this.$props.email !== crispStoredEmail) {
        this.title = MODAL_RESTORE_TITLE
        this.message = MODAL_RESTORE_MESSAGE
        this.showModal()
      }
      else {
        this.syncCrisp()
        this.syncMixpanel()
      }
    }
    // no stored email => show modal to gather
    else if (!crispStoredEmail) {
      this.showModal()
    }
  }
}
</script>