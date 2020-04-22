<template>
  <v-card max-width="500" class="hero-card">
    <header class="card-header">
      <h3>
        {{ card.name }}
      </h3>
      <h4>
        {{ card.title }}
      </h4>
    </header>
    <section class="card-image">
      <img :src="require(`../../assets/${name}.png`)" :alt="`Hero: ${card.title}`" />
    </section>
  </v-card>
</template>

<script>
  export default {
    name: 'GameCard',
    props: {
      name: {
        type: String,
        required: true
      },
      card: {
        type: Object,
        required: true
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';
  
  .hero-card {
    padding: $spacer / 2;
    position: relative;
    background: orange;
    display: flex;
    flex-direction: column;

    .card-header {
      flex: 1;
    }

    .card-image {
      flex: 4;
    }
  }
</style>