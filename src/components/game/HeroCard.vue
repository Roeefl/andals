<template>
  <div class="hero-card" :class="{ 'name-only': nameOnly, 'was-played': card.wasPlayed }">
    <header class="card-header" :class="{ 'highlight': !thumbnail, 'thumbnail': thumbnail }">
      <h3>
        {{ card.name }}
      </h3>
      <h4 v-if="!thumbnail && !nameOnly">
        {{ card.title }}
      </h4>
      <h5 v-if="!thumbnail && !nameOnly">
        {{ card.ability }}
      </h5>
    </header>
    <section v-if="!nameOnly" class="card-image-wrapper">
      <img :src="require(`../../assets/heroes/${card.type}.jpg`)" :alt="`Hero: ${card.title}`" class="card-image" />
    </section>
    <section v-if="!thumbnail && !nameOnly" class="card-description" :class="{ 'highlight': !thumbnail }">
      {{ card.description }}
    </section>
    <BaseIcon v-if="thumbnail && card.wasPlayed" name="flip-horizontal" color="white" class="icon-was-played" />
  </div>
</template>

<script>
  import BaseIcon from '@/components/common/BaseIcon';

  export default {
    name: 'GameCard',
    components: {
      BaseIcon
    },
    props: {
      card: {
        type: Object,
        required: true
      },
      thumbnail: {
        type: Boolean,
        default: false
      },
      nameOnly: {
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
    position: relative;
    padding: $spacer;
    text-align: center;
    background: $app-background;
    color: $primary;
    display: flex;
    flex-direction: column;

    &.name-only {
      padding: 0;
      justify-content: center;
    }

    &.was-played {
      opacity: 0.8;
    }

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

    .icon-was-played {
      position: absolute;
      top: $spacer / 2;
      right: $spacer * -0.5;
    }
  }
</style>