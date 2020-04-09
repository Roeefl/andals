<template>
  <div class="room">
    <div v-if="this.room" class="inner">
      <ControlPanel
        :isMyTurn="isMyTurn"
        :desiredRobberTile="desiredRobberTile"
        @toggle-ready="toggleReady"
        @dice-finished="sendDice($event)"
        @end-turn="finishTurn"
        @move-robber="moveRobber"
      />
      <div class="board-area">
        <PlayersList
          :isGameReady="roomState.isGameReady"
          :currentTurn="roomState.currentTurn"
          :waitingTradeWith="waitingTradeWith"
          @display-deck="isDisplayMyDeck = true"
          @trade-with="requestTradeWith($event)"
          @steal-from="stealFrom($event)"
        />
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
        />
        <aside class="sidebar">
          <GameLog />
          <GameChat :messages="chatMessages" :myPlayerSessionId="myPlayer.playerSessionId || 'NO_SESSION_ID'" />
        </aside>
      </div>
      <ConfirmMove
        :type="activeTile.type"
        :isOpen="isDisplayConfirmMove"
        :isFree="roomState.isSetupPhase"
        @yes="onTileBuild(true)"
        @no="onTileBuild(false)"
      />
    <MyDeck
      :isOpen="isDisplayMyDeck || myPlayer.mustDiscardHalfDeck"
      :discardMode="myPlayer.mustDiscardHalfDeck"
      :deck="myPlayer.resourceCounts"
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
    <OpponentDeck
      :isOpen="!!stealingFrom.playerSessionId"
      :opponent="stealingFrom"
      @steal="selectStealCard($event)"
    />
    </div>
    <div v-else>
      Not currently connected to any game room.
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import colyseusService from '@/services/colyseus';

  import ControlPanel from '@/containers/ControlPanel';
  import GameBoard from '@/containers/GameBoard';
  import GameChat from '@/containers/GameChat';
  import GameLog from '@/containers/GameLog';
  import PlayersList from '@/containers/PlayersList';

  import MyDeck from '@/components/interface/MyDeck';
  import TradeDialog from '@/components/interface/TradeDialog';
  import ConfirmMove from '@/components/interface/ConfirmMove';
  import ConfirmTrade from '@/components/interface/ConfirmTrade';
  import OpponentDeck from '@/components/interface/OpponentDeck';

  import { initialResourceCounts } from '@/utils/tileManifest';

  import {
    MESSAGE_CHAT,
    MESSAGE_GAME_LOG,
    MESSAGE_READY,
    MESSAGE_ROLL_DICE,
    MESSAGE_COLLECT_ALL_LOOT,
    MESSAGE_FINISH_TURN,
    MESSAGE_PLACE_STRUCTURE,
    MESSAGE_PLACE_ROAD,
    MESSAGE_DISCARD_HALF_DECK,
    MESSAGE_TRADE_REQUEST,
    MESSAGE_TRADE_ADD_CARD,
    MESSAGE_TRADE_REMOVE_CARD,
    MESSAGE_TRADE_CONFIRM,
    MESSAGE_TRADE_REFUSE,
    MESSAGE_TRADE_INCOMING_RESPONSE,
    MESSAGE_MOVE_ROBBER,
    MESSAGE_STEAL_CARD,
    CHAT_LOG_SIMPLE,
    CHAT_LOG_DICE,
    CHAT_LOG_LOOT,
    CHAT_LOG_DISCARD
  } from '@/store/constants';

  export default {
    name: 'GameRoom',
    components: {
      ControlPanel,
      GameBoard,
      GameChat,
      GameLog,
      PlayersList,
      ConfirmTrade,
      ConfirmMove,
      MyDeck,
      TradeDialog,
      OpponentDeck
    },
    data: () => ({
      chatMessages: [],
      isDisplayConfirmMove: false,
      isDisplayMyDeck: false,
      activeTile: {
        type: 'road'
      },
      waitingTradeWith: null,
      desiredRobberTile: -1,
      stealingFrom: {}
    }),
    created() {
      if (!this.room) return;

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
            this.$store.commit('addAlert', message);
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
      onTileClick: function(tile) {
        this.activeTile = tile;
        this.isDisplayConfirmMove = true;
      },
      onTileBuild: function(approved) {
        this.isDisplayConfirmMove = false;
        if (!approved) return;

        const { type, row, col } = this.activeTile;
        
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
      },
      requestTradeWith: function(withWho) {
        colyseusService.room.send({
          type: MESSAGE_TRADE_REQUEST,
          withWho
        });

        this.waitingTradeWith = withWho;
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
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }

  .board-area {
    flex: 1;
    background: $board-background;
    display: grid;
    grid-template-columns: 20% 60% 20%;

    .sidebar {
      background: #5E35B1;
      border-left: 1px solid gray;
      padding-left: $spacer / 2;
      height: 100%;
      display: flex;
      flex-direction: column;

      & > * {
        flex: 1;
        max-height: 40vh; // @FIXME: not like this
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        color: white;
      }
    }
  }
</style>
