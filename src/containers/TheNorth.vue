<template>
  <div class="the-north" :class="{ ready: roomState.isGameReady }">
    <div class="west">
      <WildlingSpawn :counts="roomState.spawnCounts" />
    </div>
    <div class="wall-area">
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
        :guards="guards"
        :allowPurchase="allowPurchase"
        :allowRemove="myPlayer.allowKill === GUARD"
        @wall-clicked="onWallClicked($event)"
        @kill-guard="onGuardKill($event)"
        @relocate-guard="onGuardRelocate($event)"
        class="the-wall"
      />
    </div>
    <CardSwapper
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
  import CardSwapper from '@/components/interface/CardSwapper';

  import {
    MESSAGE_WILDLINGS_REVEAL_TOKENS,
    MESSAGE_WILDLINGS_ADVANCE_CLEARING,
    MESSAGE_WILDLINGS_WALL_BATTLE,
    MESSAGE_WILDLINGS_REMOVE_FROM_CAMP,
    MESSAGE_WILDLINGS_REMOVE_FROM_CLEARING,
    MESSAGE_PLAY_HERO_CARD,
    MESSAGE_SELECT_HERO_CARD,
    MESSAGE_RELOCATE_GUARD,
    MESSAGE_PLACE_GUARD,
    CHAT_LOG_WILDLING_TOKENS,
    CHAT_LOG_SIMPLE,
    CHAT_LOG_HERO_CARD
  } from '@/constants';

  import { ROAD, GUARD } from '@/specs/purchases';
  import { HERO_CARD_BenjenStark } from '@/specs/heroCards';
  import { WILDLING_REGULAR, WILDLING_CLIMBER, WILDLING_GIANT } from '@/specs/wildlings';

  export default {
    name: 'TheNorth',
    components: {
      WildlingSpawn,
      WildlingCamps,
      WildlingClearing,
      Wall,
      CardSwapper
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
            const owner = this.players.find(({ playerSessionId }) => playerSessionId === guard.ownerId);
            if (!owner) return guard;

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
      onGuardRelocate: function(relocationData) {
        if (!this.myPlayer.allowGuardRelocate) return;

        this.room.send({
          type: MESSAGE_RELOCATE_GUARD,
          ...relocationData
        });
      },
      onGuardKill: function(location) {
        if (!this.myPlayer.allowKill || this.myPlayer.allowKill !== GUARD) return;
        
        console.log("onGuardKill -> location", location)
        const { section, position } = location;

        const killedGuard = this.roomState.wall
          .find(guard => guard.section === section && guard.position === position);

        if (killedGuard && killedGuard.ownerId !== this.myPlayer.playerSessionId)
          this.$emit('kill-guard', location);
      },
      onBroadcastReceived: function(broadcast) {
        const { type } = broadcast;
        let header = '';

        switch (type) {
          case MESSAGE_PLACE_GUARD:
            this.$store.commit('addGameLog', { type: CHAT_LOG_SIMPLE, message: broadcast.message });
            this.$store.commit('setEssentialOverlay', { header: broadcast.message, guardPurchased: true });
            break;

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
            header = `A ${wildling.type} has advanced to the clearing!`;

            this.$store.commit('addGameLog', { type: CHAT_LOG_SIMPLE, message: header });
            this.$store.commit('setEssentialOverlay', { header });
            break;

          case MESSAGE_WILDLINGS_WALL_BATTLE:
            const { invader } = broadcast;

            let guardsKilled = 0;
            if (invader.type === WILDLING_REGULAR) {
              header = 'Attack on the wall! The wildlings have overthrown the guards and invaded Westeros';
              guardsKilled = 1;
            } else if (invader.type === WILDLING_CLIMBER) {
              header = 'A wildling has climbed the wall!';
            } else if (invader.type === WILDLING_GIANT) {
              header = 'Attack on the wall! A giant has killed a guard';
              guardsKilled = 1;
            };

            this.$store.commit('addGameLog', { type: CHAT_LOG_SIMPLE, message: header });
            this.$store.commit('setEssentialOverlay', { header, guardsKilled, wildlingType: invader.type });
            break;

          case MESSAGE_PLAY_HERO_CARD:
            const {
              playerName,
              heroCard
            } = broadcast;

            header = `${playerName} has played ${heroCard.name}`;

            this.$store.commit('addGameLog', { type: CHAT_LOG_HERO_CARD, playerName, heroCard });
            this.$store.commit('setEssentialOverlay', { header, heroCard });
            break;

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
    @include dashed-around();
    display: grid;
    grid-template-columns: 20% 60% 20%;

   &.ready {
      opacity: 1;
    }

    .west {
      background: white;
    }

    .wall-area {
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
