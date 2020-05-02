<template>
  <v-carousel
    hide-delimiters
    show-arrows
    :cycle="cycle"
    :height="height"
    :value="selected"
    @change="$emit('selected-image', $event)"
  >
    <v-carousel-item
      v-for="(image, i) in images"
      :key="i"
      class="carousel-item"
    >
      <img :src="require(`../../assets/${image.src}`)" :alt="image.alt || `image-${i}`" class="carousel-image" />
    </v-carousel-item>
  </v-carousel>
</template>

<script>
  export default {
    name: 'BaseCarousel',
    props: {
      cycle: {
        type: Boolean,
        default: false
      },
      height: {
        type: Number,
        default: 300
      },
      images: {
        type: Array,
        default: () => []
      },
      selected: {
        type: Number,
        default: 0
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/partials';

  .carousel-item {
    .v-responsive__content {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .carousel-image {
    width: 250px;
    height: 250px;
  }
</style>
