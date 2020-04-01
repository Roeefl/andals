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
      size: {
        type: String,
        default: MD
      },
      name: {
        type: String,
        default: 'account'
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
