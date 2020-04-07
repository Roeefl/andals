<template>
  <div class="room">
    <div v-if="this.room" class="inner">
      <ControlPanel
        :isMyTurn="isMyTurn"
        @toggle-ready="toggleReady"
        @dice-finished="sendDice($event)"
        @end-turn="finishTurn"
      />
      <div class="board-area">
        <PlayersList
          :isGameReady="roomState.isGameReady"
          :currentTurn="roomState.currentTurn"
          @display-deck="isDisplayMyDeck = true"
          @trade-with="tradeWith($event)"
        />
        <GameBoard
          :board="roomState.board"
          :ready="roomState.isGameReady"
          :isDiceRolled="roomState.isDiceRolled"
          :isSetupPhase="roomState.isSetupPhase"
          :isMyTurn="isMyTurn"
          @tile-clicked="onTileClick($event)"
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
      :isOpen="isDisplayMyDeck"
      @close="isDisplayMyDeck = false"
      :deck="myPlayer.resourceCounts"
    />
    <TradeDialog
      :isOpen="!!tradingWith"
      :players="[myPlayer, tradingWith]"
      @refuse="refuseTrade"
      @add-card="addTradeCard($event)"
      @remove-card="removeTradeCard($event)"
      @confirm-trade="confirmTrade"
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

  import {
    MESSAGE_CHAT,
    MESSAGE_GAME_LOG,
    MESSAGE_READY,
    MESSAGE_ROLL_DICE,
    MESSAGE_COLLECT_ALL_LOOT,
    MESSAGE_FINISH_TURN,
    MESSAGE_PLACE_STRUCTURE,
    MESSAGE_PLACE_ROAD,
    MESSAGE_TRADE_REQUEST,
    MESSAGE_TRADE_ADD_CARD,
    MESSAGE_TRADE_REMOVE_CARD,
    MESSAGE_TRADE_CONFIRM,
    MESSAGE_TRADE_REFUSE,
    CHAT_LOG_SIMPLE,
    CHAT_LOG_DICE,
    CHAT_LOG_LOOT
  } from '@/store/constants';

  export default {
    name: 'GameRoom',
    components: {
      ControlPanel,
      GameBoard,
      GameChat,
      GameLog,
      PlayersList,
      ConfirmMove,
      MyDeck,
      TradeDialog
    },
    data: () => ({
      chatMessages: [],
      isDisplayConfirmMove: false,
      isDisplayMyDeck: false,
      tradingWith: null,
      activeTile: {
        type: 'road'
      }
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
    updated() {
      console.log(this.myPlayer);
      
      if (this.myPlayer.pendingTrade)
        this.tradingWidth = this.myPlayer.pendingTrade
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
      tradeWith(otherPlayerSessionId) {
        colyseusService.room.send({
          type: MESSAGE_TRADE_REQUEST,
          otherPlayerSessionId
        });

// this.tradingWith = this.players.find(({ playerSessionId }) => playerSessionId === otherPlayerSessionId);
      },
      addTradeCard(resource) {
        colyseusService.room.send({
          type: MESSAGE_TRADE_ADD_CARD,
          resource
        });
      },
      removeTradeCard(resource) {
        colyseusService.room.send({
          type: MESSAGE_TRADE_REMOVE_CARD,
          resource
        });
      },
      refuseTrade() {
        colyseusService.room.send({
          type: MESSAGE_TRADE_REFUSE,
          otherPlayerSessionId: tradingWith.playerSessionId
        });
        
        this.tradingWith = null;
      },
      confirmTrade() {
        colyseusService.room.send({
          type: MESSAGE_TRADE_CONFIRM,
          otherPlayerSessionId: tradingWith.playerSessionId
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
