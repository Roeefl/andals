<template>
  <div class="the-north" :class="{ ready: roomState.isGameReady }">
    <div class="west">
      <WildlingSpawn :counts="roomState.spawnCounts" />
    </div>
    <div class="east">
      <WildlingCamps class="wildling-camps" />
      <div class="wildling-clearings">
        <WildlingClearing v-for="(clearing, c) in roomState.wildlingClearings" :key="`clearing-${c}`" :clearing="clearing" class="clearing" :class="`clearing-${c}`" />
      </div>
      <TheWall :myColor="myPlayer.color" :wall="guards" @wall-clicked="onWallClicked($event)" class="the-wall" />
    </div>
    <BaseOverlay :isOpen="!!revealedWildlingTokens">
      <div class="overlay-content">
        <h1>
          The Wildlings Advance
        </h1>
        <WildlingToken
          v-for="(token, t) in revealedWildlingTokens"
          :key="`token-${t}`"
          size="50px"
          :wildling="token.wildlingType"
          :clan="token.clanType"
          class="wildling-token"
        />
      </div>
    </BaseOverlay>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import colyseusService, { ROOM_TYPE_FIRST_MEN } from '@/services/colyseus';

  import WildlingSpawn from '@/components/north/WildlingSpawn';
  import WildlingCamps from '@/components/north/WildlingCamps';
  import WildlingClearing from '@/components/north/WildlingClearing';
  import TheWall from '@/components/north/TheWall';
  import WildlingToken from '@/components/north/WildlingToken';

  import BaseOverlay from '@/components/common/BaseOverlay';

  import {
    MESSAGE_REVEAL_WILDLING_TOKENS,
    MESSAGE_PLACE_GUARD,
    CHAT_LOG_WILDLING_TOKENS
  } from '@/constants';

  export default {
    name: 'TheNorth',
    components: {
      WildlingSpawn,
      WildlingCamps,
      WildlingClearing,
      TheWall,
      WildlingToken,
      BaseOverlay
    },
    props: {
      allowPurchase: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      room: () => colyseusService.room,
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
    data: () => ({
      revealedWildlingTokens: null
    }),
    created() {
      this.initializeRoom(this.room);
    },
    methods: {
      initializeRoom: function(room = this.room) {
        room.onMessage(this.onBroadcastReceived);
      },
      onWallClicked: function(location) {
        const { section, position } = location;
        
        if (this.allowPurchase && this.myPlayer.hasResources.guard)
          this.$emit('wall-clicked', location);
      },
      onBroadcastReceived: function(broadcast) {
        const { type } = broadcast;

        switch (type) {
          case MESSAGE_REVEAL_WILDLING_TOKENS:
            const { tokens } = broadcast;
            this.$store.commit('addGameLog', { type: CHAT_LOG_WILDLING_TOKENS, tokens });

            this.revealedWildlingTokens = tokens;
            setTimeout(
              () => this.revealedWildlingTokens = null,
              3000
            );

            break;

          default:
            break;
        }
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

      .wildling-clearings {
        flex: 1;
        display: flex;
      }

      .the-wall {
        flex: 1;
      }
    }
  }

  .overlay-content {
    animation: swing-in-top-fwd 1.2s cubic-bezier(0.550, 0.055, 0.675, 0.190) both;
    width: 60vw;
    height: 30vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .revealed-tokens {
      display: flex;
    }
  }

  .wildling-token {
    width: 100px;
    height: 100px;

    & + & {
      margin-left: $spacer * 2;
    }
  }

  .clearing {
    width: 100%;
    height: 50px;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    padding: 0 $spacer * 2;

    &.clearing-0,
    &.clearing-1 {
      justify-content: flex-start;
    }

    &.clearing-2,
    &.clearing-3 {
      justify-content: flex-end;
    }
  }
</style>
