<template>
  <v-badge :color="color" :content="content" :icon="`mdi-${icon}`" />
</template>

<script>
  export default {
    name: 'NumberBadge',
    props: {
      color: {
        type: String,
        default: ''
      },
      content: {
        type: [String, Number],
        default: ''
      },
      icon: {
        type: String,
        default: ''
      }
    } 
  }
</script>
