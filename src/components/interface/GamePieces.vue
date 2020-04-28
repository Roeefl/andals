<template>
  <div class="pieces">
    <GamePiece v-for="(piece, i) in pieces" :key="i" :type="type" :color="color" />
  </div>
</template>

<script>
  import GamePiece from '@/components/game/GamePiece';

  export default {
    name: 'GamePieces',
    components: {
      GamePiece
    },
    props: {
      type: {
        type: String,
        default: 'road'
      },
      pieces: {
        type: Number,
        default: 0
      },
      color: {
        type: String,
        default: 'secondary'
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .pieces {
    display: flex;
    flex-flow: row wrap;
  }
</style>
