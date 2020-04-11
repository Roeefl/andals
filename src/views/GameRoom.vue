<template>
  <div class="room">
    <div class="inner">
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
      <div class="board-area">
        <DraggableWidget class="players-list">
          <PlayersList
            :isGameReady="roomState.isGameReady"
            :currentTurn="roomState.currentTurn"
            :waitingTradeWith="waitingTradeWith"
            @display-deck="isDisplayMyDeck = true"
            @trade-with="requestTradeWith($event)"
            @steal-from="stealFrom($event)"
          />
        </DraggableWidget>
        <GameBoard
          :board="roomState.board"
          :robberPosition="roomState.robberPosition || -1"
          :ready="roomState.isGameReady"
          :isDiceRolled="roomState.isDiceRolled"
          :isSetupPhase="roomState.isSetupPhase"
          :isMyTurn="isMyTurn"
          @tile-clicked="onTileClick($event)"
          :desiredRobberTile="desiredRobberTile"
          @robber-dropped="desiredRobberTile = $event"
          class="game-board"
        />
        <aside class="sidebar">
          <DraggableWidget>
            <GameLog class="game-log" />
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
        <GameChat :messages="chatMessages" :myPlayerSessionId="myPlayer.playerSessionId || 'NO_SESSION_ID'" class="game-chat" />
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
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import router from '@/router';
  import colyseusService from '@/services/colyseus';

  import ControlPanel from '@/containers/ControlPanel';
  import GameStatus from '@/containers/GameStatus';
  import GameBoard from '@/containers/GameBoard';
  import GameChat from '@/containers/GameChat';
  import GameLog from '@/containers/GameLog';
  import PlayersList from '@/containers/PlayersList';

  import MyDeck from '@/components/interface/MyDeck';
  import TradeDialog from '@/components/interface/TradeDialog';
  import ConfirmMove from '@/components/interface/ConfirmMove';
  import ConfirmTrade from '@/components/interface/ConfirmTrade';
  import OpponentDeck from '@/components/interface/OpponentDeck';
  import SelectResource from '@/components/interface/SelectResource';

  import DraggableWidget from '@/components/common/DraggableWidget';

  import { initialResourceCounts } from '@/specs/resources';

  import {
    harborManifest,
    TILE_WATER,
    HARBOR_GENERIC
  } from '@/utils/tileManifest';

  import {
    MESSAGE_CHAT,
    MESSAGE_GAME_LOG,
    MESSAGE_READY,
    MESSAGE_ROLL_DICE,
    MESSAGE_COLLECT_ALL_LOOT,
    MESSAGE_FINISH_TURN,
    MESSAGE_PLACE_STRUCTURE,
    MESSAGE_PLACE_ROAD,
    MESSAGE_PURCHASE_GAME_CARD,
    MESSAGE_DISCARD_HALF_DECK,
    MESSAGE_MOVE_ROBBER,
    MESSAGE_STEAL_CARD,
    MESSAGE_SELECT_MONOPOLY_RESOURCE,
    MESSAGE_TRADE_WITH_BANK,
    MESSAGE_TRADE_REQUEST,
    MESSAGE_TRADE_ADD_CARD,
    MESSAGE_TRADE_REMOVE_CARD,
    MESSAGE_TRADE_CONFIRM,
    MESSAGE_TRADE_REFUSE,
    MESSAGE_TRADE_INCOMING_RESPONSE,
    CHAT_LOG_SIMPLE,
    CHAT_LOG_DICE,
    CHAT_LOG_LOOT,
    CHAT_LOG_DISCARD
  } from '@/store/constants';

  export default {
    name: 'GameRoom',
    components: {
      DraggableWidget,
      ControlPanel,
      GameStatus,
      GameBoard,
      GameChat,
      GameLog,
      PlayersList,
      ConfirmTrade,
      ConfirmMove,
      MyDeck,
      TradeDialog,
      OpponentDeck,
      SelectResource
    },
    data: () => ({
      chatMessages: [],
      isDisplayConfirmMove: false,
      isDisplayMyDeck: false,
      activePurchase: {
        type: 'road'
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
      stealingFrom: {}
    }),
    created() {
      if (!this.room) {
        router.push('/');
        return;
      }

      // Define a series of room lifecycle methods
      this.room.onStateChange.once(this.initializeState);
      this.room.onStateChange(this.updateState);

      this.room.onMessage(this.onBroadcastReceived);

      this.room.onError(this.onRoomError);
      this.room.onLeave(this.onRoomLeave);
    },
    destroyed() {
      this.$store.commit('destroyRoomState');
    },
    computed: {
      room: () => colyseusService.room,
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
        'players'
      ])
    },
    methods: {
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

          case MESSAGE_GAME_LOG:
            this.$store.commit('addGameLog', { type: CHAT_LOG_SIMPLE, message });
            // this.$store.commit('addAlert', message);
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
          type: 'gameCard'
        };
        this.isDisplayConfirmMove = true;
      },
      onTileClick: function(tile) {
        this.activePurchase = tile;
        this.isDisplayConfirmMove = true;
      },
      onConfirmPurchase: function(approved) {
        this.isDisplayConfirmMove = false;
        if (!approved) return;

        const { type, row, col } = this.activePurchase;

        if (type === 'gameCard') {
          colyseusService.room.send({
            type: MESSAGE_PURCHASE_GAME_CARD
          });

          this.$store.commit('setJustPurchasedGameCard', true);
          return;
        }
        
        colyseusService.room.send({
          type: type === 'road' ? MESSAGE_PLACE_ROAD : MESSAGE_PLACE_STRUCTURE,
          structureType: type === 'road' ? null : type,
          row,
          col
        });

        if (type === 'road' && this.roomState.isSetupPhase)
          this.finishTurn();
      },
      finishTurn: function() {
        colyseusService.room.send({
          type: MESSAGE_FINISH_TURN
        });

        this.$store.commit('setJustPurchasedGameCard', false);
      },
      requestTradeWith: function(withWho) {
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
        colyseusService.room.send({
          type: MESSAGE_TRADE_WITH_BANK,
          requestedResource: this.bankTradeResource
        });

        this.resetBankDummy();
      },
      respondToIncomingTrade: function(isAgreed) {
        colyseusService.room.send({
          type: MESSAGE_TRADE_INCOMING_RESPONSE,
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

  .room {
    height: 100%;
    display: flex;

    .inner {
      padding: 0 $spacer;
      flex: 1;
      display: flex;
      flex-direction: column;

      .control-panel {
        height: 70px;
        margin-bottom: $spacer / 2;
        justify-content: flex-start;
      }

      .board-area {
        display: flex;

        & > * {
          margin: 0 $spacer / 2;
        }

        .players-list {
          flex: 1;
        }

        .game-board {
          flex: 3;
        }

        .sidebar {
          flex: 1;
          display: flex;
          flex-direction: column;

          & > * {
            flex: 1;

            &:last-of-type {
              margin-top: $spacer;
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
  }

  .game-log {
    max-height: 35vh;
    overflow-y: auto;
  }

  .game-chat-widget {
    position: relative;
    max-height: 35vh;
    overflow-y: auto;
  }
</style>
