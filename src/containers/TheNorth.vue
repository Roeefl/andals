<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
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
    MESSAGE_SWAPPED_HERO_CARD,
    MESSAGE_RELOCATE_GUARD,
    MESSAGE_PLACE_GUARD,
    MESSAGE_REMOVE_GUARD,
    CHAT_LOG_WILDLING_TOKENS,
    CHAT_LOG_SIMPLE,
    CHAT_LOG_PURCHASE,
    CHAT_LOG_HERO_CARD
  } from '@/constants';

  import { GUARD } from '@/specs/purchases';
  import { isAllowNorthWildlingsRemove } from '@/utils/heroes';
  import { wildlingAttentionHeaders } from '@/specs/wildlings';
  import { heroSpecs } from '@/specs/heroCards';

  export default {
    name: 'TheNorth',
    components: {
      WildlingSpawn,
      WildlingCamps,
      WildlingClearing,
      Wall,
      CardSwapper
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
        'myPlayer',
        'activePurchase'
      ]),
      ...mapGetters([
        'isSetupPhase',
        'allowPurchasing'
      ])
    },
    created() {
      this.initializeRoom(this.room);
      this.GUARD = GUARD;
    },
    methods: {
      ...mapMutations([
        'setActivePurchase',
        'setActivePlacing',
        'addGameLog',
        'setAttentions',
        'addAttention',
        'addAlert'
      ]),
      ...mapActions([
        'finishTurn'
      ]),
      initializeRoom: function(room = this.room) {
        room.onMessage(this.onBroadcastReceived);
      },
      onGuardAction: function(location, isRemove = false) {
        console.log("TheNorth -> onGuardAction -> ", location, isRemove)
        const { section, position } = location;
        
        this.setActivePurchase({
          type: GUARD,
          section,
          position,
          isRemove
        });
      },
      onWallClicked: function(location) {
        const { section, position } = location;
        
        if (this.allowPurchasing && (this.myPlayer.hasResources.guard || this.myPlayer.allowFreeGuard))
          this.onGuardAction(location);
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
          this.onGuardAction(location, true);
      },
      onBroadcastReceived: function(broadcast) {
        const {
          type,
          playerName,
          playerColor,
          isAttention = false
        } = broadcast;

        let header = '';

        switch (type) {
          case MESSAGE_PLACE_GUARD:
            this.addGameLog({ type: CHAT_LOG_PURCHASE, playerName, playerColor, message: broadcast.message });
            this.addAlert({ color: 'success', text: broadcast.message });
            break;

          case MESSAGE_WILDLINGS_REVEAL_TOKENS:
            const { tokens } = broadcast;
            const subHeader = 'Wildlings Tokens Revealed:';

            this.addGameLog({ type: CHAT_LOG_WILDLING_TOKENS, tokens });
            this.addAttention({ subHeader, tokens });

            const { footstep } = this.$refs;
            if (footstep) footstep.play(); 
            break;

          case MESSAGE_WILDLINGS_ADVANCE_CLEARING:
            const { wildlingType } = broadcast;
            header = `A ${wildlingType} wildling has advanced to the clearing!`;

            this.addGameLog({ type: CHAT_LOG_SIMPLE, message: header });
            this.addAlert({ color: 'success', text: header});
            break;

          case MESSAGE_WILDLINGS_WALL_BATTLE:
            const { invaderType, guardsKilled } = broadcast;
            const invadeHeader = wildlingAttentionHeaders[invaderType || broadcast.wildlingType];

            this.addGameLog({ type: CHAT_LOG_SIMPLE, message: invadeHeader });
            this.addGameLog({ type: CHAT_LOG_SIMPLE, message: `${guardsKilled} guards were killed` });

            this.setAttentions({ header: invadeHeader, guardsKilled, wildlingType: invaderType });
            break;

          case MESSAGE_PLAY_HERO_CARD:
            const { heroCardType } = broadcast;
            const heroCard = heroSpecs[heroCardType];

            header = `${playerName} has played ${heroCard.name}`;
            this.addGameLog({ type: CHAT_LOG_HERO_CARD, playerName, playerColor, action: 'played', heroCard, heroCardType });
            this.setAttentions({ header, heroCardType, heroCard, timeout: 4000 });
            break;

          case MESSAGE_SWAPPED_HERO_CARD:
            const { newHeroCardType } = broadcast;
            const newHeroCard = heroSpecs[newHeroCardType];

            this.addGameLog({ type: CHAT_LOG_HERO_CARD, playerName, playerColor, action: 'picked', heroCard: newHeroCard });
            this.addAlert({ color: 'info', text: `${playerName} has swapped his hero card for ${newHeroCard.name}`});
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
        if (!isAllowNorthWildlingsRemove(this.myPlayer)) return;

        const { clanName, campIndex } = data;

        this.room.send({
          type: MESSAGE_WILDLINGS_REMOVE_FROM_CAMP,
          clanName,
          campIndex
        });
      },
      onRemoveWildlingFromClearing: function(clearingIndex, wildlingIndex) {
        if (!isAllowNorthWildlingsRemove(this.myPlayer)) return;
        
        this.room.send({
          type: MESSAGE_WILDLINGS_REMOVE_FROM_CLEARING,
          clearingIndex,
          wildlingIndex
        });
      },
      onConfirmPurchase: function(additionalData) {
        const { type, section, position, isRemove = false } = this.activePurchase;
        if (type !== GUARD) return;

        if (isRemove) {
          this.room.send({
            type: MESSAGE_REMOVE_GUARD,
            section,
            position
          });
          
          this.setActivePurchase(null);
          return;
        } else {
          this.room.send({
            type: MESSAGE_PLACE_GUARD,
            section,
            position,
            ...additionalData
          });
  
          if (this.isSetupPhase)
            this.finishTurn();
        }

        this.setActivePurchase(null);
        this.setActivePlacing(null);
      }
    }
  }
</script>

<template>
  <div class="the-north" :class="{ ready: roomState.isGameReady }">
    <!-- <div class="west"> -->
      <!-- <WildlingSpawn :counts="roomState.spawnCounts" /> -->
    <!-- </div> -->
    <div class="wall-area">
      <WildlingCamps @remove-wildling="onRemoveWildlingFromCamp($event)" class="wildling-camps" />
      <div class="wildling-clearings">
        <WildlingClearing
          v-for="(clearing, c) in roomState.wildlingClearings"
          :key="`clearing-${c}-${clearing.wildlings}`"
          :clearingIndex="c"
          :clearing="clearing"
          @remove-wildling="onRemoveWildlingFromClearing(c, $event)"
          class="clearing"
        />
      </div>
      <Wall
        :myColor="myPlayer.color"
        :guards="guards"
        :activePurchase="activePurchase"
        :myPlayer="myPlayer"
        :isSetupPhase="isSetupPhase"
        :allowPurchasing="allowPurchasing && (myPlayer.hasResources.guard || myPlayer.allowFreeGuard)"
        :allowRemove="myPlayer.allowKill === GUARD"
        @wall-clicked="onWallClicked($event)"
        @kill-guard="onGuardKill($event)"
        @relocate-guard="onGuardRelocate($event)"
        @cancel-purchase="setActivePurchase(null)"
        @confirm-purchase="onConfirmPurchase($event)"
        class="the-wall"
      />
    </div>
    <CardSwapper
      v-if="myPlayer.swappingHeroCard"
      isOpen
      :cards="roomState.heroCards"
      @selected="onSelectHeroCard($event)"
    />
    <audio ref="footstep">
      <source src="../assets/audio/footstep.ogg" type="audio/mpeg">
    </audio>
  </div>
</template>

<style scoped lang="scss">
  @import '@/styles/partials';

  .the-north {
    opacity: 0.5;
    display: flex;
    justify-content: center;
    background: red;

   &.ready {
      opacity: 1;
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
  }
</style>
