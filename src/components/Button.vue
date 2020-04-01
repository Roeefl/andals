<template>
  <v-btn
    :type="type"
    :color="color"
    :disabled="disabled"
    :rounded="rounded"
    :icon="icon"
    @click="onClick"
    v-on="on"
  >
    <slot></slot>
  </v-btn>
</template>

<script>
  export default {
    name: 'Button',
    props: {
      type: {
        type: String,
        default: 'button'
      },
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
      onClick: {
        type: Function,
        default: () => {}
      },
      on: Object
    }
  }
</script>

<style scoped lang="scss">

</style>
