<template>
  <main class="game-room">
    <BaseGame />
  </main>
</template>

<script>
  import BaseGame from '@/containers/BaseGame';

  export default {
    name: 'GameRoom',
    components: {
      BaseGame
    }
  }
</script>

<style scoped lang="scss">
 @import '@/styles/partials';

  .game-room {
    height: 100%;
    display: flex;
  }
</style>
