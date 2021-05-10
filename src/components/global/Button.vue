<template>
  <button type="button" class="btn" :class="btnClass">
    <slot></slot>
  </button>
</template>

<script>
  export default {
    props: {
      type: {
        type: String,
        default() {
          return 'secondary'
        }
      },
      extraClass: {
        type: String
      }
    },
    computed: {
      btnClass() {
        const parseExtraClass = this.extraClass.trim().split(',')
        const btnClass = `btn-${this.type}`
        if (parseExtraClass.length) return [btnClass, ...parseExtraClass]
        return [btnClass]
      }
    }
  }
</script>