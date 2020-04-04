<template>
  <v-icon
    :size="size"
    :color="color"
    :dark="dark"
  >
    {{ `mdi-${name}` }}
  </v-icon>
</template>

<script>
  const sizes = ['x-small', 'small', 'medium', 'large', 'x-large'];
  const [XS, SM, MD, LG, XL] = sizes;

  export default {
    name: 'Icon',
    props: {
      name: {
        type: String,
        required: true
      },
      size: {
        type: String,
        default: MD,
        validator: value => sizes.includes(value) || value.endsWith('px')
      },
      dark: {
        type: Boolean,
        default: false
      },
      color: {
        type: String,
        default: 'blue'
      }
    }
  }
</script>
