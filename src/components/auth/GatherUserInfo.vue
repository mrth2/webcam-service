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
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label for="u-firstname" class="form-label">Prénom</label>
                    <div class="input-group">
                      <input type="text" class="form-control" id="u-firstname" placeholder="Entrez votre prénom"
                             v-model.trim="nameInput.first" required>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label for="u-lastname" class="form-label">Nom</label>
                    <div class="input-group">
                      <input type="text" class="form-control" id="u-lastname" placeholder="Entrez votre nom de famille"
                             v-model.trim="nameInput.last" required>
                    </div>
                  </div>
                  <div class="text-danger" v-if="error.name" v-html="error.name"></div>
                </div>
                <div class="mb-3">
                  <label for="u-email" class="form-label">Courriel</label>
                  <input type="email" class="form-control" id="u-email" placeholder="Entrer votre Email"
                         aria-describedby="emailHelp" v-model="emailInput" required>
<!--                  <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>-->
                  <div class="text-danger" v-if="error.email" v-html="error.email"></div>
                </div>
                <div class="mb-3">
                  <label for="u-location" class="form-label">Ville</label>
                  <input type="text" class="form-control" id="u-location" placeholder="Entrez votre ville (facultatif)"
                         v-model.trim="locationInput">
                  <div class="text-danger" v-if="error.location" v-html="error.location"></div>
                </div>
                <div class="mb-3">
                  <button type="submit" class="btn btn-primary mb-3">Soumettre</button>
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

const MODAL_TITLE = 'Merci d’entrer vos informations pour accéder à la diffusion en direct.'
const MODAL_MESSAGE = ''
const MODAL_RESTORE_TITLE = MODAL_TITLE
const MODAL_RESTORE_MESSAGE = ''

export default {
  props: ['name', 'email', 'location'],
  data() {
    return {
      title: MODAL_TITLE,
      message: MODAL_MESSAGE,
      isLoading: false,
      nameInput: {
        first: '',
        last: ''
      },
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
    fullName() {
      if (this.nameInput.first !== '' && this.nameInput.last !== '') {
        return `${this.nameInput.first} ${this.nameInput.last}`
      } else if (this.nameInput.first !== '') {
        return this.nameInput.first
      } else if (this.nameInput.last !== '') {
        return this.nameInput.last
      }
      return ''
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
      if (this.fullName === '') {
        this.error.name = 'S\'il vous plaît entrez votre nom.'
      }
      if (!helpers.validateEmail(this.emailInput)) {
        this.error.email = 'Veuillez soumettre un courriel valide.'
      }
      /*if (this.locationInput === '') {
        this.error.location = 'Veuillez entrer votre adresse'
      }*/
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
        "First name": this.nameInput.first,
        "Last name": this.nameInput.last,
        "Full name": this.fullName,
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
      this.$crisp.push(["set", "user:nickname", [this.fullName]])
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
    if (this.name) this.nameInput.first = this.name
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
      } else {
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
