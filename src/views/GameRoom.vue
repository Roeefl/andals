<template>
  <main id="game-room">
    <BaseGame />
    <Snowflakes v-if="false" :count="40" class="snowflakes" />
    <Attentions
      :isOpen="attentions.isOpen"
      :overlay="attentions"
    />
  </main>
</template>

<script>
  // v-if="enableSnow"
  import { mapState } from 'vuex';

  import BaseGame from '@/containers/BaseGame';
  import Snowflakes from '@/components/decor/Snowflakes';
  import Attentions from '@/components/interface/Attentions';

  export default {
    name: 'GameRoom',
    components: {
      BaseGame,
      Snowflakes,
      Attentions
    },
    computed: mapState([
      'enableSnow',
      'attentions'
    ]),
    async beforeRouteLeave (to, from, next) {
      try {
        const approved = await this.$dialog.confirm('Are you sure you want to leave this game?');
        next();
      } catch (refused) {
        next(false);
      }
    }
  }
</script>

<style scoped lang="scss">
 @import '@/styles/partials';

  #game-room {
    height: 100%;
    display: flex;
    z-index: $zindex-interface;
    padding: $spacer / 3 0;

    & > * {
      z-index: $zindex-interface;
    }
  }

  .snowflakes {
    z-index: 0;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
