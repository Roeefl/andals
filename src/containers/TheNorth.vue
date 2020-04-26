<template>
  <div class="the-north" :class="{ ready: roomState.isGameReady }">
    <div class="west">
      <WildlingSpawn :counts="roomState.spawnCounts" />
    </div>
    <div class="east">
      <WildlingCamps @remove-wildling="onRemoveWildlingFromCamp($event)" class="wildling-camps" />
      <div class="wildling-clearings">
        <WildlingClearing
          v-for="(clearing, c) in roomState.wildlingClearings"
          :key="`clearing-${c}`"
          :clearing="clearing"
          @remove-wildling="onRemoveWildlingFromClearing(c, $event)"
          class="clearing"
          :class="`clearing-${c}`"
        />
      </div>
      <Wall
        :myColor="myPlayer.color"
        :wall="guards"
        :allowPurchase="allowPurchase"
        :allowRemove="myPlayer.allowKill === GUARD"
        @wall-clicked="onWallClicked($event)"
        @kill-guard="onGuardKill($event)"
        class="the-wall"
      />
    </div>
    <HeroCardSwapper
      v-if="myPlayer.swappingHeroCard"
      :isOpen="myPlayer.swappingHeroCard"
      :cards="roomState.heroCards"
      @selected="onSelectHeroCard($event)"
    />
    <audio ref="wildlingsAudio">
      <source src="../assets/audio/snow-footsteps.mp3" type="audio/mpeg">
    </audio>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import colyseusService, { ROOM_TYPE_FIRST_MEN } from '@/services/colyseus';

  import Wall from '@/components/north/Wall';
  import WildlingSpawn from '@/components/north/WildlingSpawn';
  import WildlingCamps from '@/components/north/WildlingCamps';
  import WildlingClearing from '@/components/north/WildlingClearing';
  import HeroCardSwapper from '@/components/game/HeroCardSwapper';

  import {
    MESSAGE_WILDLINGS_REVEAL_TOKENS,
    MESSAGE_WILDLINGS_ADVANCE_CLEARING,
    MESSAGE_WILDLINGS_WALL_BATTLE,
    MESSAGE_WILDLINGS_REMOVE_FROM_CAMP,
    MESSAGE_WILDLINGS_REMOVE_FROM_CLEARING,
    MESSAGE_PLAY_HERO_CARD,
    MESSAGE_SELECT_HERO_CARD,
    CHAT_LOG_WILDLING_TOKENS,
    CHAT_LOG_SIMPLE,
    CHAT_LOG_HERO_CARD
  } from '@/constants';

  import { ROAD, GUARD } from '@/specs/purchases';
  import { HERO_CARD_BenjenStark } from '@/specs/heroCards';

  export default {
    name: 'TheNorth',
    components: {
      WildlingSpawn,
      WildlingCamps,
      WildlingClearing,
      Wall,
      HeroCardSwapper
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
    created() {
      this.initializeRoom(this.room);
      this.GUARD = GUARD;
    },
    methods: {
      initializeRoom: function(room = this.room) {
        room.onMessage(this.onBroadcastReceived);
      },
      onWallClicked: function(location) {
        const { section, position } = location;
        
        if (this.allowPurchase && (this.myPlayer.hasResources.guard || this.myPlayer.allowFreeGuard))
          this.$emit('wall-clicked', location);
      },
      onGuardKill: function(location) {
      console.log("location", location)
       const { section, position } = location;
        
        if (this.myPlayer.allowKill === GUARD && this.guards[section * 5 + position] && this.guards[section * 5 + position].ownerId !== this.myPlayer.playerSessionId)
          this.$emit('kill-guard', location);
      },
      onBroadcastReceived: function(broadcast) {
        const { type } = broadcast;
        let header = '';

        switch (type) {
          case MESSAGE_WILDLINGS_REVEAL_TOKENS:
            const { tokens } = broadcast;
            header = 'Wildlings Tokens Revealed:';

            this.$store.commit('addGameLog', { type: CHAT_LOG_WILDLING_TOKENS, tokens });
            this.$store.commit('setEssentialOverlay', { header, tokens });

            const { wildlingsAudio } = this.$refs;
            if (wildlingsAudio) wildlingsAudio.play(); 
            break;

          case MESSAGE_WILDLINGS_ADVANCE_CLEARING:
            const { wildling } = broadcast;
            header = `A ${wildling} has advanced to the clearing!`;

            this.$store.commit('addGameLog', { type: CHAT_LOG_SIMPLE, message: header });
            this.$store.commit('setEssentialOverlay', { header });

          case MESSAGE_WILDLINGS_WALL_BATTLE:
            const { invader } = broadcast;
            header = `Attack on the wall! ${invader.type} has attacked the guards`;

            this.$store.commit('addGameLog', { type: CHAT_LOG_SIMPLE, message: header });
            this.$store.commit('setEssentialOverlay', { header });

          case MESSAGE_PLAY_HERO_CARD:
            const {
              playerName,
              heroCard
            } = broadcast;

            header = `${playerName} has played ${heroCard.name}`;

            this.$store.commit('addGameLog', { type: CHAT_LOG_HERO_CARD, playerName, heroCard });
            this.$store.commit('setEssentialOverlay', { header, heroCard });

          default:
            break;
        }
      },
      onSelectHeroCard: function(heroCard) {
        this.room.send({
          type: MESSAGE_SELECT_HERO_CARD,
          heroType: heroCard.type
        });
      },
      onRemoveWildlingFromCamp: function(data) {
        if (!this.myPlayer.heroPrivilege === HERO_CARD_BenjenStark) return;

        const { clanName, campIndex } = data;

        this.room.send({
          type: MESSAGE_WILDLINGS_REMOVE_FROM_CAMP,
          clanName,
          campIndex
        });
      },
      onRemoveWildlingFromClearing: function(clearingIndex, wildlingIndex) {
        if (!this.myPlayer.heroPrivilege === HERO_CARD_BenjenStark) return;
        
        this.room.send({
          type: MESSAGE_WILDLINGS_REMOVE_FROM_CLEARING,
          clearingIndex,
          wildlingIndex
        });
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
