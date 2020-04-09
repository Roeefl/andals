<template>
  <v-select
    :label="label"
    :items="options"
    :value="selected"
    @change="$emit('selected', $event)"
  />
</template>

<script>
  export default {
    name: 'SelectValue',
    props: {
      label: {
        type: String,
        default: 'Select:'
      },
      options: {
        type: Array,
        default: [
          {
            text: '-',
            value: 0
          }
        ]
      },
      selected: {
        type: Object,
        required: true
      }
    }
  }
</script>
