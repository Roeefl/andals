<template>
  <div class="base-game">
    <DraggableWidget class="control-panel">
      <ControlPanel
        :isMyTurn="isMyTurn"
        :desiredRobberTile="desiredRobberTile"
        @toggle-ready="toggleReady"
        @dice-finished="sendDice($event)"
        @end-turn="finishTurn"
        @move-robber="moveRobber"
      />
    </DraggableWidget>
    <div class="board-container">
      <DraggableWidget class="players-list">
        <PlayersList
          :isGameReady="roomState.isGameReady"
          :isGameStarted="roomState.isGameStarted"
          :currentTurn="roomState.currentTurn"
          :waitingTradeWith="waitingTradeWith"
          @display-deck="isDisplayMyDeck = true"
          @trade-with="requestTradeWith($event)"
          @steal-from="stealFrom($event)"
        />
      </DraggableWidget>
      <div class="board-area">
        <TheNorth
          v-if="isWithNorth"
          :allowPurchase="allowPurchase"
          @wall-clicked="onGuardClick($event)"
          class="the-north"
        />
        <GameBoard
          :allowPurchase="allowPurchase"
          :desiredRobberTile="desiredRobberTile"
          @tile-clicked="onTileClick($event)"
          @robber-dropped="desiredRobberTile = $event"
          class="game-board"
          :class="{ 'with-north': isWithNorth }"
        />
      </div>
      <aside class="sidebar" :class="{ 'compact': isWithNorth }">
        <DraggableWidget v-if="isWithNorth" :level="0" class="breach-marker">
          <BreachMarker />
        </DraggableWidget>
        <DraggableWidget class="game-log">
          <GameLog :friendly="roomState.friendlyGameLog" />
        </DraggableWidget>
        <DraggableWidget class="game-chat-widget">
          <GameChat :messages="chatMessages" :myPlayerSessionId="myPlayer.playerSessionId || 'NO_SESSION_ID'" />
        </DraggableWidget>
      </aside>
    </div>
    <DraggableWidget class="game-status">
      <GameStatus :isMyTurn="isMyTurn" @purchase-card="onGameCardPurchase" @bank-trading="onTradeWithBank($event)" />
    </DraggableWidget>
    <ConfirmMove
      :type="activePurchase.type"
      :isOpen="isDisplayConfirmMove"
      :isFree="roomState.isSetupPhase"
      @yes="onConfirmPurchase(true)"
      @no="onConfirmPurchase(false)"
    />
    <MyDeck
      :isOpen="isDisplayMyDeck || myPlayer.mustDiscardHalfDeck"
      :myPlayer="myPlayer"
      @close="closeDeck"
      @approve="closeDeck($event)"
    />
    <ConfirmTrade
      :isOpen="!!myPlayer.pendingTrade"
      :withWho="tradingWith"
      @no="respondToIncomingTrade(false)"
      @yes="respondToIncomingTrade(true)"
    />
    <TradeDialog
      :isOpen="!!myPlayer.tradingWith"
      :players="[myPlayer, players.find(({ playerSessionId }) => playerSessionId === myPlayer.tradingWith)]"
      @add-card="addTradeCard($event)"
      @remove-card="removeTradeCard($event)"
      @refuse="refuseTrade"
      @confirm-trade="confirmTrade"
    >
      <GameChat :messages="chatMessages" :myPlayerSessionId="myPlayer.playerSessionId || 'NO_SESSION_ID'" />
    </TradeDialog>
    <TradeDialog
      :isOpen="!!bankTradeResource"
      withBank
      :players="bankTradePlayers"
      @add-card="addTradeCard($event)"
      @remove-card="removeTradeCard($event)"
      @refuse="cancelBankTrade"
      @confirm-trade="requestBankTrade"
      cancelText="Cancel"
    />
    <OpponentDeck
      :isOpen="!!stealingFrom.playerSessionId"
      :opponent="stealingFrom"
      @steal="selectStealCard($event)"
    />
    <SelectResource
      :isOpen="myPlayer.isDeclaringMonopoly"
      @resource-selected="onMonopolySelected($event)"
    />
    <BaseOverlay :isOpen="showVictoryScreen" closeText="OKEY COOL FOR HIM" @close="showVictoryScreen = false" />
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import router from '@/router';
  import colyseusService, { ROOM_TYPE_FIRST_MEN } from '@/services/colyseus';

  import ControlPanel from '@/containers/ControlPanel';
  import GameStatus from '@/containers/GameStatus';
  import GameBoard from '@/containers/GameBoard';
  import TheNorth from '@/containers/TheNorth';
  import GameChat from '@/containers/GameChat';
  import GameLog from '@/containers/GameLog';
  import PlayersList from '@/containers/PlayersList';

  import BreachMarker from '@/components/north/BreachMarker';

  import MyDeck from '@/components/interface/MyDeck';
  import TradeDialog from '@/components/interface/TradeDialog';
  import ConfirmMove from '@/components/interface/ConfirmMove';
  import ConfirmTrade from '@/components/interface/ConfirmTrade';
  import OpponentDeck from '@/components/interface/OpponentDeck';
  import SelectResource from '@/components/interface/SelectResource';

  import DraggableWidget from '@/components/common/DraggableWidget';
  import BaseOverlay from '@/components/common/BaseOverlay';

  import { initialResourceCounts } from '@/specs/resources';
  import { ROAD, GUARD, GAME_CARD } from '@/specs/purchases';

  import { HARBOR_GENERIC } from '@/utils/tileManifest';

  import {
    MESSAGE_CHAT,
    MESSAGE_GAME_LOG,
    MESSAGE_READY,
    MESSAGE_ROLL_DICE,
    MESSAGE_COLLECT_ALL_LOOT,
    MESSAGE_FINISH_TURN,
    MESSAGE_PLACE_STRUCTURE,
    MESSAGE_PLACE_ROAD,
    MESSAGE_PLACE_GUARD,
    MESSAGE_PURCHASE_GAME_CARD,
    MESSAGE_DISCARD_HALF_DECK,
    MESSAGE_MOVE_ROBBER,
    MESSAGE_STEAL_CARD,
    MESSAGE_GAME_VICTORY,
    MESSAGE_SELECT_MONOPOLY_RESOURCE,
    MESSAGE_TRADE_WITH_BANK,
    MESSAGE_TRADE_REQUEST,
    MESSAGE_TRADE_START_AGREED,
    MESSAGE_TRADE_ADD_CARD,
    MESSAGE_TRADE_REMOVE_CARD,
    MESSAGE_TRADE_CONFIRM,
    MESSAGE_TRADE_REFUSE,
    CHAT_LOG_SIMPLE,
    CHAT_LOG_DICE,
    CHAT_LOG_LOOT,
    CHAT_LOG_DISCARD
  } from '@/constants';

  export default {
    name: 'BaseGame',
    components: {
      DraggableWidget,
      BaseOverlay,
      ControlPanel,
      GameStatus,
      GameBoard,
      TheNorth,
      GameChat,
      GameLog,
      PlayersList,
      ConfirmTrade,
      ConfirmMove,
      MyDeck,
      TradeDialog,
      OpponentDeck,
      SelectResource,
      BreachMarker
    },
    data: () => ({
      chatMessages: [],
      isDisplayConfirmMove: false,
      isDisplayMyDeck: false,
      activePurchase: {
        type: ROAD
      },
      waitingTradeWith: null,
      bankTradeResource: null,
      desiredRobberTile: -1,
      bankDummy: {
        nickname: 'Bank',
        playerSessionId: '-bank-',
        resourceCounts: {},
        tradeCounts: {},
        isTradeConfirmed: false
      },
      stealingFrom: {},
      showVictoryScreen: false
    }),
    async created() {
      if (!this.room) {
        await this.reconnect();
        return;
      }

      this.initializeRoom();
      await colyseusService.fetchBuildingCosts();
    },
    destroyed() {
      this.$store.commit('destroyRoomState');
    },
    computed: {
      room: () => colyseusService.room,
      isWithNorth: function() {
        return this.room && this.room.name === ROOM_TYPE_FIRST_MEN;
      },
      myPlayerIndex: function() {
        return this.players
          .findIndex(p => p.playerSessionId === colyseusService.room.sessionId);
      },
      isMyTurn: function() {
        return this.roomState.currentTurn === this.myPlayerIndex
      },
      tradingWith: function() {
        return this.myPlayer.pendingTrade
          ? (this.players.find(({ playerSessionId }) => playerSessionId === this.myPlayer.pendingTrade) || {}).nickname
          : 'NONE';
      },
      allowPurchase: function() {
        return (
          this.isMyTurn &&
          (this.roomState.isSetupPhase || this.roomState.isDiceRolled) &&
          !this.myPlayer.mustMoveRobber
        );
      },
      bankTradePlayers: function() {
        return [
          this.myPlayer,
          this.bankDummy
        ];
      },
      ...mapState([
        'isSelfReady',
        'myPlayer',
        'roomState',
        'players',
        'gameWinner'
      ])
    },
    methods: {
      initializeRoom: function(room = this.room) {
        // Define a series of room lifecycle methods
        room.onStateChange.once(this.initializeState);
        room.onStateChange(this.updateState);
        room.onMessage(this.onBroadcastReceived);
        room.onError(this.onRoomError);
        room.onLeave(this.onRoomLeave);
      },
      reconnect: async function() {
        try {
          const room = await colyseusService.reconnect(this.$route.params.roomId);
          console.log("room", room)

          if (!room) {
            this.$store.commit('addAlert', 'Unable to reconnect. Sorry.');
            router.push('/lobby');
            return;
          }
          
          colyseusService.setRoom(room);
          this.initializeRoom(room);
        } catch (err) {
          console.error('reconnect failed:', err);
          this.$store.commit('addAlert', 'Unable to reconnect. Sorry.');
          router.push('/lobby');
        }
      },
      initializeState: function(initialRoomState) {
        this.$store.commit('updateRoomState', initialRoomState);
      },
      updateState: function(updatedRoomState) {
        this.$store.commit('updateRoomState', updatedRoomState);
        
        if (this.bankTradeResource) this.evaluateBankTrade();
      },
      onBroadcastReceived: function(broadcast) {
        const {
          type,
          sender,
          senderSessionId,
          message,
          playerName
        } = broadcast;

        switch (type) {
          case MESSAGE_CHAT:
            this.chatMessages = [
              ...this.chatMessages,
              broadcast
            ];
            break;

          case MESSAGE_ROLL_DICE:
            const { dice } = broadcast;
            this.$store.commit('addGameLog', { type: CHAT_LOG_DICE, playerName, dice });
            break;

          case MESSAGE_COLLECT_ALL_LOOT:
            const { loot } = broadcast;
            this.$store.commit('addGameLog', { type: CHAT_LOG_LOOT, playerName, loot });
            break;

          case MESSAGE_DISCARD_HALF_DECK:
            const { discardedCounts } = broadcast;
            this.$store.commit('addGameLog', { type: CHAT_LOG_DISCARD, playerName, loot: discardedCounts });
            break;

          case MESSAGE_GAME_LOG:
            this.$store.commit('addGameLog', { type: CHAT_LOG_SIMPLE, message });
            // this.$store.commit('addAlert', message);
            break;

          case MESSAGE_GAME_VICTORY:
            this.$store.commit('addGameLog', { type: CHAT_LOG_SIMPLE, message: `${playerName} has won the game!!!` });
            this.$store.commit('victory', playerName);
            this.showVictoryScreen = true;
            break;
            
          default:
            break;
        }
      },
      onRoomError: function(error) {
        console.error(`Room ${this.room.sessionId} encountered error: ${error.message}`);
      },
      onRoomleave: function() {
        console.info(`${colyseusService.client.id} has left ${this.room.id}`);
      },
      toggleReady: function() {
        this.$store.commit('toggleSelfReady');
        
        colyseusService.room.send({
          type: MESSAGE_READY,
          message: true
        });
      },
      sendDice: function(dice) {
        colyseusService.room.send({
          type: MESSAGE_ROLL_DICE,
          dice
        });

        if (this.roomState.isTurnOrderPhase)
          this.finishTurn();
      },
      onGameCardPurchase: function() {
        this.activePurchase = {
          type: GAME_CARD
        };
        this.isDisplayConfirmMove = true;
      },
      onTileClick: function(tile) {
        this.activePurchase = tile;
        this.isDisplayConfirmMove = true;
      },
      onGuardClick: function(location) {
        const { section, position } = location;
        
        this.activePurchase = {
          type: GUARD,
          section,
          position
        };
        this.isDisplayConfirmMove = true;
      },
      onConfirmPurchase: function(approved) {
        this.isDisplayConfirmMove = false;
        if (!approved) return;

        const { type, row, col } = this.activePurchase;

        if (type === GUARD) {
          const { section, position } = this.activePurchase;

          colyseusService.room.send({
            type: MESSAGE_PLACE_GUARD,
            section,
            position
          });
          return;
        }

        if (type === GAME_CARD) {
          colyseusService.room.send({
            type: MESSAGE_PURCHASE_GAME_CARD
          });

          this.$store.commit('setJustPurchasedGameCard', true);
          return;
        }
        
        colyseusService.room.send({
          type: type === ROAD ? MESSAGE_PLACE_ROAD : MESSAGE_PLACE_STRUCTURE,
          structureType: type === ROAD ? null : type,
          row,
          col
        });

        if (type === ROAD && this.roomState.isSetupPhase)
          this.finishTurn();
      },
      finishTurn: function() {
        colyseusService.room.send({
          type: MESSAGE_FINISH_TURN
        });

        this.$store.commit('setJustPurchasedGameCard', false);
      },
      requestTradeWith: function(withWho) {
        if (!this.roomState.isGameStarted) return;

        colyseusService.room.send({
          type: MESSAGE_TRADE_REQUEST,
          withWho
        });

        this.waitingTradeWith = withWho;
      },
      resetBankDummy: function() {
        this.bankTradeResource = null;
        
        this.bankDummy = {
          ...this.bankDummy,
          tradeCounts: {},
          isTradeConfirmed: false
        };
      },
      cancelBankTrade: function() {
        this.resetBankDummy();
        this.refuseTrade();
      },
      onTradeWithBank: function(resource) {
        if (!this.roomState.isGameStarted) return;
        
        this.bankTradeResource = resource;

        const updateBankDummyTradeCounts = {
          ...this.bankDummy.tradeCounts,
          [resource]: 1
        };
        this.bankDummy = {
          ...this.bankDummy,
          tradeCounts: updateBankDummyTradeCounts
        };
      },
      evaluateBankTrade: function() {
        this.bankDummy.isTradeConfirmed = false;

        const tradeCounts = Object.entries(this.myPlayer.tradeCounts);
        console.log("tradeCounts", tradeCounts);

        const acceptableResourceIndex = tradeCounts.findIndex(([resource, count]) => (
          (this.myPlayer.ownedHarbors[resource] && count === 2) ||
          (this.myPlayer.ownedHarbors[HARBOR_GENERIC] && count === 3) ||
          count === 4
        ));

        if (acceptableResourceIndex < 0) return;

        const isTradeValid = tradeCounts
          .filter((x, index) => index !== acceptableResourceIndex)
          .every(([resource, count]) => count === 0)

        console.log("isTradeValid", isTradeValid);
        if (isTradeValid) this.bankDummy.isTradeConfirmed = true;
      },
      requestBankTrade: function() {
        if (!this.bankDummy.isTradeConfirmed) return;
        
        colyseusService.room.send({
          type: MESSAGE_TRADE_WITH_BANK,
          requestedResource: this.bankTradeResource
        });

        this.resetBankDummy();
      },
      respondToIncomingTrade: function(isAgreed) {
        colyseusService.room.send({
          type: MESSAGE_TRADE_START_AGREED,
          isAgreed
        });
      },
      addTradeCard: function(card) {
        const { resource } = card;
        
        colyseusService.room.send({
          type: MESSAGE_TRADE_ADD_CARD,
          resource
        });
      },
      removeTradeCard: function(resource) {
        colyseusService.room.send({
          type: MESSAGE_TRADE_REMOVE_CARD,
          resource
        });
      },
      refuseTrade: function() {
        colyseusService.room.send({
          type: MESSAGE_TRADE_REFUSE
        });
      },
      confirmTrade: function() {
        colyseusService.room.send({
          type: MESSAGE_TRADE_CONFIRM
        });
      },
      closeDeck: function(selectedCards) {
        this.isDisplayMyDeck = false;

        if (!this.myPlayer.mustDiscardHalfDeck) return;

        const discardedCounts = selectedCards.reduce((acc, { resource }) => {
          acc[resource]++;
          return acc;
        }, initialResourceCounts);

        colyseusService.room.send({
          type: MESSAGE_DISCARD_HALF_DECK,
          discardedCounts
        });
      },
      moveRobber: function() {
        if (!this.myPlayer.mustMoveRobber) return;

        colyseusService.room.send({
          type: MESSAGE_MOVE_ROBBER,
          tile: this.desiredRobberTile
        });
      },
      stealFrom: function(playerSessionId) {
        this.stealingFrom = this.players.find(p => p.playerSessionId === playerSessionId);
      },
      selectStealCard: function(selectedCard) {
        const { resource } = selectedCard;

        colyseusService.room.send({
          type: MESSAGE_STEAL_CARD,
          stealFrom: this.stealingFrom.playerSessionId,
          resource
        });

        this.stealingFrom = {};
      },
      onMonopolySelected: function(selectedResource) {
        colyseusService.room.send({
          type: MESSAGE_SELECT_MONOPOLY_RESOURCE,
          selectedResource
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  $board-height: 760px;

  .base-game {
    padding: 0 $spacer;
    flex: 1;
    display: flex;
    flex-direction: column;

    .control-panel {
      height: 70px;
      margin-bottom: $spacer / 2;
      justify-content: flex-start;
    }

    .board-container {
      display: grid;
      grid-template-columns: 300px 1fr 300px;

      & > * {
        margin: 0 $spacer / 2;
      }

      .board-area {
        display: flex;
        flex-direction: column;
        background: white;

        .the-north {
          height: $board-height / 2;
        }

        .game-board {
          background-image: url('../assets/ocean.jpg');
          background-size: cover;
          border: 4px dashed black;
          height: $board-height;

          &.with-north {
            height: $board-height * 0.8;
            background-image: url('../assets/snowy-ground.jpg');
            background-size: unset;
            background-repeat: repeat;
            color: $app-background;
          }
        }
      }

      .sidebar {
        display: flex;
        flex-direction: column;

        & > * {
          flex: 1;

          &:last-of-type {
            margin-top: $spacer;
          }
        }

        .game-log {
          max-height: $board-height / 2;
          overflow-y: auto;
        }

        .game-chat-widget {
          position: relative;
          max-height: $board-height / 2;
          overflow-y: auto;
        }

        &.compact {
          .game-log,
          .game-chat-widget {
            max-height: $board-height * 0.4;
          }
        }
      }
    }

    .game-status {
      height: 70px;
      margin-top: $spacer / 2;
      justify-content: flex-start;
    }
  }
</style>
