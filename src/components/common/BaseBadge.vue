<template>
  <v-badge :color="color" :content="content === 0 ? '0' : content" :icon="`mdi-${icon}`">
    <slot></slot>
  </v-badge>
</template>

<script>
  export default {
    name: 'BaseBadge',
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
