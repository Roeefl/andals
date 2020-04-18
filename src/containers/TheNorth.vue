<template>
  <div class="the-north" :class="{ ready: roomState.isGameReady }">
    <div class="west">
      <WildlingSpawn :counts="roomState.spawnCounts" />
    </div>
    <div class="east">
      <WildlingCamps class="wildling-camps" />
      <TheWall :myColor="myPlayer.color" @wall-clicked="onWallClicked($event)" class="the-wall" />
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  
  import WildlingSpawn from '@/components/north/WildlingSpawn';
  import WildlingCamps from '@/components/north/WildlingCamps';
  import TheWall from '@/components/north/TheWall';

  export default {
    name: 'TheNorth',
    components: {
      WildlingSpawn,
      WildlingCamps,
      TheWall
    },
    props: {
      allowPurchase: {
        type: Boolean,
        default: false
      }
    },
    computed: mapState([
      'roomState',
      'myPlayer'
    ]),
    methods: {
      isGuardAllowed: function(section, position) {
        const { wall } = this.roomState;

        const startPos = section * 5;
        const wallSection = wall.slice(startPos, startPos + 5);

        return wallSection
          .filter((pos, p) => p < position)
          .every(guard => !!guard);
      },
      onWallClicked: function(location) {
        const { section, position } = location;

        if (this.allowPurchase && this.myPlayer.hasResources.guard && this.isGuardAllowed(section, position))
          this.$emit('wall-clicked', location)
      }
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
        flex: 4;
      }

      .the-wall {
        flex: 1;
      }
    }
  }
</style>
