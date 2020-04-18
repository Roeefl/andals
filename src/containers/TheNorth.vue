<template>
  <div class="the-north" :class="{ ready: roomState.isGameReady }">
    <div class="west">
      <WildlingSpawn :wildlings="wildlingsMock" />
    </div>
    <div class="east">
      <WildlingCamps class="wildling-camps" />
      <TheWall :myColor="myPlayer.color" class="the-wall" />
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  
  import WildlingSpawn from '@/components/north/WildlingSpawn';
  import WildlingCamps from '@/components/north/WildlingCamps';
  import TheWall from '@/components/north/TheWall';

  const wildlingsMock = {
    regular: 12,
    climber: 8,
    giant: 6
  };

  export default {
    name: 'TheNorth',
    components: {
      WildlingSpawn,
      WildlingCamps,
      TheWall
    },
    computed: mapState([
      'roomState',
      'myPlayer'
    ]),
    created() {
      this.wildlingsMock = wildlingsMock;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .the-north {
    // opacity: 0.5;
    height: 400px;
    display: grid;
    grid-template-columns: 35% 65%;
    border: 2px dashed black;

    &.ready {
      opacity: 1;
    }

    .west {
      background: white;
    }

    .east {
      display: flex;
      flex-direction: column;

      .wildling-camps {
        flex: 3;
      }

      .the-wall {
        flex: 1;
      }
    }
  }
</style>
