<template>
  <main id="game-room">
    <BaseGame />
    <Snowflakes v-if="false" :count="40" class="snowflakes" />
    <EssentialOverlay
      :isOpen="essentialOverlay.isOpen"
      :overlay="essentialOverlay"
    />
  </main>
</template>

<script>
  // v-if="enableSnow"
  import { mapState } from 'vuex';

  import BaseGame from '@/containers/BaseGame';
  import Snowflakes from '@/components/decor/Snowflakes';
  import EssentialOverlay from '@/components/interface/EssentialOverlay';

  export default {
    name: 'GameRoom',
    components: {
      BaseGame,
      Snowflakes,
      EssentialOverlay
    },
    computed: mapState([
      'enableSnow',
      'essentialOverlay'
    ])
  }
</script>

<style scoped lang="scss">
 @import '@/styles/partials';

  #game-room {
    height: 100%;
    display: flex;
    z-index: 20;
    padding: $spacer / 3 0;

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
