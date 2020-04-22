<template>
  <div class="hero-card">
    <header class="card-header" :class="{ 'highlight': !thumbnail, 'thumbnail': thumbnail }">
      <h3>
        {{ card.name }}
      </h3>
      <h4 v-if="!thumbnail">
        {{ card.title }}
      </h4>
    </header>
    <section class="card-image-wrapper">
      <img :src="require(`../../assets/heroes/${card.type}.jpg`)" :alt="`Hero: ${card.title}`" class="card-image" />
    </section>
    <section v-if="!thumbnail" class="card-description" :class="{ 'highlight': !thumbnail }">
      {{ card.description }}
    </section>
  </div>
</template>

<script>
  export default {
    name: 'GameCard',
    props: {
      card: {
        type: Object,
        required: true
      },
      thumbnail: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  $hero-text-background: #90CAF9;
  $hero-text-color: black;
  
  .hero-card {
    border-radius: 8px;
    padding: $spacer;
    text-align: center;
    background: $app-background;
    color: $primary;
    display: flex;
    flex-direction: column;

    .card-header {
      &.highlight {
        background: $hero-text-background;
        color: $hero-text-color;
      }

      &.thumbnail {
        & > * {
          @include text-truncate();
          font-size: $font-size-xs;
        }
      }
    }

    .card-image-wrapper {
      height: 80%;
      padding: $spacer / 4;
      display: flex;
      justify-content: center;

      .card-image {
        width: 50%;
        height: 100%;
      }
    }

    .card-description {
      flex: 2;

      &.highlight {
        background: $hero-text-background;
        color: $hero-text-color;
      }
    }
  }
</style>