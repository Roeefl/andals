<template>
  <main class="game-room">
    <BaseGame />
    <Snowflakes v-if="enableSnow" :count="40" class="snowflakes" />
  </main>
</template>

<script>
  import { mapState } from 'vuex';

  import BaseGame from '@/containers/BaseGame';
  import Snowflakes from '@/components/decor/Snowflakes';

  export default {
    name: 'GameRoom',
    components: {
      BaseGame,
      Snowflakes
    },
    computed: mapState([
      'enableSnow'
    ]),
  }
</script>

<style scoped lang="scss">
 @import '@/styles/partials';

  .game-room {
    height: 100%;
    display: flex;
    z-index: 20;
    padding: $spacer 0;

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
