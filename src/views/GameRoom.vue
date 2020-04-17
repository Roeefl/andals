<template>
  <main class="game-room">
    <BaseGame />
    <Snowflakes :count="40" class="snowflakes" />
  </main>
</template>

<script>
  import BaseGame from '@/containers/BaseGame';
  import Snowflakes from '@/components/decor/Snowflakes';

  export default {
    name: 'GameRoom',
    components: {
      BaseGame,
      Snowflakes
    }
  }
</script>

<style scoped lang="scss">
 @import '@/styles/partials';

  .game-room {
    height: 100%;
    display: flex;
    z-index: 20;

    & > * {
      z-index: 20;
    }
  }

  .snowflakes {
    z-index: 0;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
