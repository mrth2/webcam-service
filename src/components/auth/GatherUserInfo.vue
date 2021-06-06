<template>
  <teleport to="body">
    <div id="modalGatherUserInfo" class="modal fade" tabindex="-1">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" v-html="title"></h5>
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
                  <input type="email" class="form-control" id="u-email" placeholder="Entrez votre adresse courriel"
                         aria-describedby="emailHelp" v-model="emailInput" required>
                  <div class="text-danger" v-if="error.email" v-html="error.email"></div>
                </div>
                <div class="mb-3">
                  <label for="u-location" class="form-label">Ville</label>
                  <input type="text" class="form-control" id="u-location" placeholder="Entrez votre ville (facultatif)"
                         v-model.trim="locationInput">
                  <div class="text-danger" v-if="error.location" v-html="error.location"></div>
                </div>
                <div class="mb-3">
                  <input class="form-check-input" type="checkbox" v-model="termAgreed" id="term-agreement" required>
                  <label class="form-check-label" style="margin-left: 10px;" for="term-agreement">
                    <a href="https://legrandfourire.com/politique-de-confidentialite/" target="_blank">J'accepte les
                      conditions d'utilisation du site.</a>
                  </label>
                  <div class="text-danger" v-if="error.term" v-html="error.term"></div>
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

const MODAL_TITLE = `
Pour avoir l’expérience du Grand fou rire la plus complète, nous vous recommandons d’autoriser l’utilisation de votre caméra et de votre micro. Votre signal vidéo ne sera pas transmis en direct lors de l’événement, mais votre caméra vous servira à créer un effet miroir, qui sera utile pour certains exercices. À certains moments, vous serez également invité(e) à CAPTURER des photos de vous en action ou à ENREGISTRER de courts clips vidéo de votre plus beau rire, qui seront directement envoyés à la Fondation québécoise du cancer. Le fait d’activer votre caméra et votre micro vous permettra d’utiliser ces fonctionnalités, si vous le souhaitez. En les utilisant, vous acceptez que la Fondation utilise ce matériel (capture photo ou court clip vidéo) dans ses activités de promotion et de communication.
Et si vous n’avez pas de caméra ou de micro, pas de soucis! Vous aurez quand même une belle expérience.
<br/><br/>
Merci d’entrer vos renseignements pour accéder à la diffusion en direct.
`
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
      termAgreed: false,
      error: {
        name: null,
        email: null,
        location: null,
        term: null
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
      let errorOccurred = false
      for (const i in this.error) {
        // eslint-disable-next-line no-prototype-builtins
        if (this.error.hasOwnProperty(i)) {
          if (this.error[i] !== null) errorOccurred = true
        }
      }
      return errorOccurred
    }
  },
  watch: {
    emailInput() {
      this.error.email = null
    },
    fullName() {
      this.error.name = null
    },
    termAgreed() {
      this.error.term = null
    }
  },
  methods: {
    clearError() {
      this.error = {
        name: null,
        email: null,
        location: null,
        term: null
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
      if (!this.termAgreed) {
        this.error.term = 'Veuillez accepter notre terme.'
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
    if (this.name) {
      const frg = this.name.split(' ')
      if (frg.length) {
        this.nameInput.first = frg[0]
        this.nameInput.last = frg.splice(1).join(' ')
      } else {

        this.nameInput.first = this.name
      }
    }
    if (this.email) this.emailInput = this.email
    if (this.location) this.locationInput = this.location
    // mixpanel
    this.$mixpanel.opt_in_tracking()
    const crispStoredEmail = this.$crisp.get('user:email')
    // process props
    if (this.$props.email && this.$props.name && this.$props.location) {
      // passed email from props is different from crisp session email
      //if (crispStoredEmail && this.$props.email !== crispStoredEmail) {
      this.title = MODAL_RESTORE_TITLE
      this.message = MODAL_RESTORE_MESSAGE
      this.showModal()
      // } else {
      //   this.syncCrisp()
      //   this.syncMixpanel()
      // }
    }
    // no stored email => show modal to gather
    else if (!crispStoredEmail) {
      this.showModal()
    }
  }
}
</script>

<style scoped lang="scss">
.modal-title {
  font-size: 15px;
}

@media screen and (max-width: 768px) {
  .modal-title {
    font-size: 12px;
  }
  label[for="term-agreement"] {
    font-size: 14px;
  }
}
</style>
