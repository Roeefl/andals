<template>
  <div class="the-north" :class="{ ready: roomState.isGameReady }">
    <div class="west">
      <WildlingSpawn :counts="roomState.spawnCounts" />
    </div>
    <div class="east">
      <WildlingCamps class="wildling-camps" />
      <TheWall :myColor="myPlayer.color" :wall="guards" @wall-clicked="onWallClicked($event)" class="the-wall" />
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
    computed: {
      guards: function() {
        const { wall = [] } = this.roomState;

        return (wall || [])
          .map(guard => {
            if (!guard.ownerId) return guard;

            const owner = this.players.find(({ playerSessionId }) => playerSessionId === guard.ownerId) || {};
            return {
              ...guard,
              ownerColor: owner.color
            };
          });
      },
      ...mapState([
        'roomState',
        'players',
        'myPlayer'
      ])
    },
    methods: {
      onWallClicked: function(location) {
        const { section, position } = location;
        
        if (this.allowPurchase && this.myPlayer.hasResources.guard)
          this.$emit('wall-clicked', location);
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .the-north {
    // opacity: 0.5;
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
