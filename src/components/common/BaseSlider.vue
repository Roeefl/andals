<template>
  <v-slider
    thumb-label="always"
    thumb-color="info"
    :min="min"
    :max="max"
    :value="value"
    @end="$emit('changed', $event)"
  />
</template>

<script>
  export default {
    name: 'BaseSlider',
    props: {
      min: {
        type: Number,
        default: 1
      },
      max: {
        type: Number,
        default: 10
      },
      value: {
        type: Number,
        default: 5
      }
    }
  }
</script>
