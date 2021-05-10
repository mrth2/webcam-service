<template>
  <div class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" v-if="title">{{ title }}</h5>
          <button v-if="close" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" v-if="message">
          <p>{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="$emit('cancel')">Cancel
          </button>
          <button type="button" class="btn btn-primary" @click="confirm">{{ yesBtn }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal'

export default {
  props: {
    title: {
      type: String,
      default: 'Are you sure?'
    },
    message: {
      type: String,
      default: ''
    },
    close: {
      type: Boolean,
      default: true
    },
    yesBtn: {
      type: String,
      default: 'OK, Got it'
    }
  },
  data() {
    return {
      modal: null
    }
  },
  emits: ['confirm', 'cancel', 'dismiss'],
  methods: {
    confirm() {
      this.modal.hide()
      this.$emit('confirm')
    }
  },
  mounted() {
    this.modal = new Modal(this.$el)
    this.$el.addEventListener('hidden.bs.modal', () => {
      this.modal.dispose()
      this.$emit('dismiss')
    })
    this.modal.show()
  }
}
</script>