<template>
  <v-text-field
    :value="value"
    @input="$emit('input', $event)"
    :dark="dark"
    :label="label"
    :placeholder="placeholder"
  />
</template>

<script>
  export default {
    name: 'TextField',
    props: {
      value: {
        type: String,
        required: true
      },
      label: {
        type: String,
        default: 'Type here...'
      },
      placeholder: {
        type: String,
        default: null
      },
      dark: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

