<template>
  <v-switch
    :label="`Enable: ${label}`"
    :input-value="value"
    @change="$emit('flipped')"
  />
</template>

<script>
  export default {
    name: 'BaseSwitch',
    props: {
      value: {
        type: Boolean,
        required: true
      },
      label: {
        type: String,
        default: '-'
      }
    }
  }
</script>
