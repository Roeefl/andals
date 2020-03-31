<template>
  <v-btn
    :color="color"
    :disabled="disabled"
    :rounded="rounded"
    :icon="icon"
    @click="onClick"
  >
    <slot></slot>
  </v-btn>
</template>

<script>
  export default {
    name: 'Button',
    props: {
      color: {
        type: String,
        default: 'primary'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      rounded: {
        type: Boolean,
        default: false
      },
      icon: {
        type: Boolean,
        default: false
      },
      onClick: Function
    }
  }
</script>

<style scoped lang="scss">

</style>
