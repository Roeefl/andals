<template>
  <div class="control-panel">
    <div class="app-header">
      <AppHeader />
    </div>
    <div class="game-ui">
      <div class="building-costs">
        <ChoiceDialog iconName="wrench" title="Building Costs" buttonText="Costs" buttonColor="info" :width="500">
          <BuildingCosts />
        </ChoiceDialog>
      </div>
      <AvailableLoot
        :counts="myPlayer.availableLoot"
        :collectAll="myPlayer.allowCollectAll"
        @collect-all="collectAll"
        @collect-resource="collectResource($event)"
        class="available-loot"
      />
      <GameCards
        visible
        :deck="myPlayer.gameCards"
        @game-card-clicked="playGameCard($event)"
        class="game-cards"
      />
    </div>
    <div class="game-actions">
      <div class="dice">
        <GameDice :dice="roomState.dice" :enabled="isDiceEnabled" @clicked="rollDice" />
        <RollingDice v-if="isDisplayDice" :type="roomState.roomType" @finished="$emit('dice-finished', $event)"/>
      </div>
      <div class="turn-action">
        <BaseButton v-if="roomState.isGameReady && !myPlayer.mustMoveRobber" color="red" @click="$emit('end-turn')" :clickable="!isEndTurnDisabled">
          End Turn
        </BaseButton>
        <BaseButton
          v-if="myPlayer.mustMoveRobber"
          color="primary"
          @click="$emit('move-robber')"
          :clickable="desiredRobberTile > -1 && roomState.robberPosition !== desiredRobberTile"
        >
          Move Robber
        </BaseButton>
        <BaseButton
          v-if="!roomState.isGameReady"
          :color="isSelfReady ? 'error' : 'highlight'"
          @click="() => $emit('toggle-ready')"
          class="ready"
        >
          <span v-if="isSelfReady">
            Not Ready
          </span>
          <span v-else>
            Ready!
          </span>
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import colyseusService from '@/services/colyseus';

  import AppHeader from '@/containers/AppHeader';
  import ChoiceDialog from '@/components/common/ChoiceDialog';
  import BuildingCosts from '@/components/interface/BuildingCosts';
  import AvailableLoot from '@/components/interface/AvailableLoot';
  import GameCards from '@/components/interface/GameCards';
  import RollingDice from '@/components/interface/RollingDice';
  import GameDice from '@/components/interface/GameDice';
  import BaseButton from '@/components/common/BaseButton';

  import { MESSAGE_COLLECT_ALL_LOOT, MESSAGE_COLLECT_RESOURCE_LOOT, MESSAGE_PLAY_GAME_CARD } from '@/constants';
  import { CARD_VICTORY_POINT } from '@/specs/gameCards';
  import { diceColors } from '@/specs/dice';

  export default {
    name: 'ControlPanel',
    components: {
      AppHeader,
      ChoiceDialog,
      BuildingCosts,
      AvailableLoot,
      GameCards,
      RollingDice,
      GameDice,
      BaseButton
    },
    props: {
      isMyTurn: {
        type: Boolean,
        default: false
      },
      desiredRobberTile: {
        type: Number,
        required: true
      }
    },
    computed: {
      isDiceEnabled: function() {
        return !this.roomState.isSetupPhase && this.isMyTurn && !this.roomState.isDiceRolled;
      },
      isGameCardsEnabled: function() {
        return(
          this.roomState.isGameStarted &&
          this.isMyTurn &&
          !this.myPlayer.hasPlayedGameCard
        );
      },
      isEndTurnDisabled: function() {
        return (
          this.roomState.isTurnOrderPhase ||
          (this.roomState.isSetupPhase && (this.myPlayer.hasResources.road || this.myPlayer.hasResources.settlement || this.myPlayer.hasResources.guard)) ||
          // Game started - meaning: either its not even my turn, or it is but I have not played yet
          !this.isMyTurn ||
          (!this.roomState.isSetupPhase && !this.roomState.isDiceRolled) ||
          (this.myPlayer.mustMoveRobber && this.desiredRobberTile === -1) ||
          this.myPlayer.allowStealingFrom.length > 0 ||
          this.myPlayer.allowFreeRoads > 0
        );
      },
      ...mapState([
        'roomState',
        'myPlayer',
        'isSelfReady',
        'justPurchasedGameCard'
      ])
    },
    data: () => ({
      isDisplayDice: false
    }),
    created() {
      this.diceColors = diceColors;
    },
    methods: {
      rollDice: function() {
        this.isDisplayDice = true;

        setTimeout(
          () => this.isDisplayDice = false,
          3000
        );
      },
      collectAll: function() {
        colyseusService.room.send({
          type: MESSAGE_COLLECT_ALL_LOOT
        });
      },
      collectResource: function(resource) {
        colyseusService.room.send({
          type: MESSAGE_COLLECT_RESOURCE_LOOT,
          resource
        });
      },
      playGameCard: function(card) {
        const { index, cardType } = card;
        console.log("cardType", cardType)
        console.log("index", index)
        
        if (this.justPurchasedGameCard && index === this.myPlayer.gameCards.length - 1) {
          this.$store.commit('addAlert', 'You cannot play a development card on the same round you purchased it');
          return;
        };
        if (cardType === CARD_VICTORY_POINT) return; // not a playable card

        colyseusService.room.send({
          type: MESSAGE_PLAY_GAME_CARD,
          cardType,
          cardIndex: index
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .control-panel {
    flex: 1;
    display: grid;
    grid-template-columns: 20% 60% 20%;

    .app-header {
      padding-left: $spacer;
      display: flex;
      align-items: center;
    }

    .game-ui {
      padding-right: $spacer;
      display: grid;
      grid-template-columns: 20% 50% 30%;
      place-items: center center;

      .building-costs {
        height: 60px;
      }

      .available-loot {
        padding-left: $spacer;
      }

      .game-cards {
        display: flex;
        justify-content: flex-end;
      }
    }

    .game-actions {
      display: flex;
      justify-content: center;
      align-items: center;

      .dice {
        flex: 1;
        display: flex;
        justify-content: center;
      }

      .turn-action {
        flex: 1;
        display: flex;
        justify-content: center;
      }
    }
  }
</style>
