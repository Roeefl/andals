<template>
  <div class="hero-card" :class="{ 'name-only': nameOnly, 'was-played': card.wasPlayed }">
    <header class="card-header" :class="{ 'highlighted-section': !thumbnail, 'thumbnail': thumbnail }">
      <h3>
        {{ card.name }}
      </h3>
      <h4 v-if="!thumbnail && !nameOnly">
        {{ card.title }}
      </h4>
    </header>
    <section v-if="!nameOnly" class="card-image-wrapper" :class="{ 'thumbnail': thumbnail }">
      <img :src="require(`../../assets/heroes/${card.type}.jpg`)" :alt="`Hero: ${card.title}`" class="card-image" />
    </section>
    <section v-if="!thumbnail && !nameOnly" class="card-description" :class="{ 'highlighted-section': !thumbnail }">
      <h3 class="card-ability">
        {{ card.ability }}
      </h3>
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
  
  .hero-card {
    border-radius: 8px;
    position: relative;
    padding: $spacer;
    text-align: center;
    background: $secondary;
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
      &.highlighted-section {
        background: $info;
        color: $secondary;
      }

      &.thumbnail {
        & > * {
          @include text-truncate();
          font-size: $font-size-xs;
        }
      }
    }

    .card-image-wrapper {
      height: 50%;
      padding: $spacer / 4;
      display: flex;
      justify-content: center;

      &.thumbnail {
        height: 80%;
      }

      .card-image {
        width: 60%;
        height: 100%;
      }
    }

    .card-description {
      flex: 2;
      display: flex;
      flex-direction: column;
      align-items: center;

      &.highlighted-section {
        background: $info;
        color: $secondary;
      }

      .card-ability {
        margin-top: $spacer / 3;
        width: 50%;
        font-style: italic;
        box-shadow: 0 0 4px 4px $primary;
      }
    }

    .icon-was-played {
      position: absolute;
      top: $spacer / 2;
      right: $spacer * -0.5;
    }
  }
</style>