<template>
   <v-img :src="src" :alt="alt" :aspect-ratio="aspectRatio" :max-width="maxWidth" :max-height="maxHeight" />
</template>

<script>
  export default {
    name: 'BaseImage',
    props: {
      src: {
        type: String,
        default: ''
      },
      alt: {
        type: String,
        default: 'An Image'
      },
      aspectRatio: {
        type: Number,
        default: 1.7
      },
      maxWidth: {
        type: Number,
        default: 200
      },
      maxHeight: {
        type: Number,
        default: 200
      }
    }
  }
</script>
