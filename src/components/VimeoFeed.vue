<template>
    <div>
      <iframe class="vimeo-feed" title="vimeo-player" src="https://player.vimeo.com/video/415275179" frameborder="0" allowfullscreen></iframe>
    </div>
</template>

<script>
export default {
  data() {
    return {
      feed: ''
    }
  }
}
</script>

<style scoped lang="scss">
iframe.vimeo-feed {
  width: 100%;
  height: 400px;
}
</style>