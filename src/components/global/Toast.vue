<template>
  <div class="position-fixed top-0 end-0 p-3" style="z-index: 5">
    <div ref="toast" :class="`toast align-items-center text-white bg-${type} border-0`" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">
          {{ message }}
        </div>
        <button v-if="close" type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast"
                aria-label="Close"></button>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from 'bootstrap/js/dist/toast'

export default {
  props: {
    message: {
      type: String,
      default: 'Hey, this is an alert'
    },
    close: {
      type: Boolean,
      default: true
    },
    selfDestroy: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'success'
    }
  },
  emits: ['dismiss'],
  data() {
    return {
      toast: null
    }
  },
  mounted() {
    this.toast = new Toast(this.$refs.toast)
    this.$refs.toast.addEventListener('hidden.bs.toast', () => {
      this.$emit('dismiss')
    })
    this.toast.show()
  }
}
</script>
