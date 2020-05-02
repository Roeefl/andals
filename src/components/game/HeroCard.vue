<template>
  <div class="hero-card">
    <header class="card-header" :class="{ 'highlighted-section': !thumbnail, 'thumbnail': thumbnail }">
      <h3>
        {{ card.name }}
      </h3>
      <h4 v-if="!thumbnail" class="card-title">
        {{ card.title }}
      </h4>
    </header>
    <section class="card-image-wrapper" :class="{ 'thumbnail': thumbnail }">
      <img v-if="card.type" :src="require(`../../assets/heroes/${card.type}.jpg`)" :alt="`Hero: ${card.title}`" class="card-image" />
    </section>
    <section v-if="!thumbnail" class="card-info" :class="{ 'highlighted-section': !thumbnail }">
      <h3 class="card-ability">
        {{ card.ability }}
      </h3>
      <div class="card-description">
        {{ card.description }}
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    name: 'HeroCard',
    props: {
      card: {
        type: Object,
        default: () => {}
      },
      thumbnail: {
        type: Boolean,
        default: false
      }
    },
    updated() {
      console.log(this.card);
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
    background: $primary;
    color: $secondary;
    display: flex;
    flex-direction: column;

    .card-header {
      &.highlighted-section {
        background: $error;
        color: $primary;
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

    .card-info {
      flex: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      white-space: normal;

      &.highlighted-section {
        background: $error;
        color: $primary;
      }

      .card-ability {
        margin-top: $spacer / 3;
        width: 100%;
        font-style: italic;
        box-shadow: 0 0 4px 4px $secondary;
      }

      .card-description {
        flex: 1;
        display: flex;
        align-items: center;
      }
    }

    .card-title {
      position: relative;
    }
  }
</style>