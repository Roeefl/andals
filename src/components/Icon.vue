<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    role="presentation"
    :width="width"
    :height="height"
    :aria-labelledby="name"
  >
    <title lang="en">
      {{ name }} icon
    </title>
    <g :fill="iconColor">
      <slot />
    </g>
  </svg>
</template>

<script>
  export default {
    props: {
      name: {
        type: String,
        default: 'none'
      },
      width: {
        type: [Number, String],
        default: 32
      },
      height: {
        type: [Number, String],
        default: 32
      },
      iconColor: {
        type: String,
        default: 'currentColor'
      }
    }
  }
</script>