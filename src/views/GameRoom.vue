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
          :players="players"
          :isGameReady="roomState.isGameReady"
          :currentTurn="roomState.currentTurn"
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
        @yes="onTileBuild(true)"
        @no="onTileBuild(false)"
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
  
  import PlayersList from '@/components/PlayersList';
  import ConfirmMove from '@/components/ConfirmMove';

  import {
    MESSAGE_CHAT,
    MESSAGE_GAME_LOG,
    MESSAGE_READY,
    MESSAGE_ROLL_DICE,
    MESSAGE_FINISH_TURN,
    MESSAGE_PLACE_STRUCTURE,
    MESSAGE_PLACE_ROAD,
    CHAT_LOG_SIMPLE,
    CHAT_LOG_DICE 
  } from '@/store/constants';

  export default {
    name: 'GameRoom',
    components: {
      ControlPanel,
      GameBoard,
      GameChat,
      GameLog,
      PlayersList,
      ConfirmMove
    },
    data: () => ({
      chatMessages: [],
      isDisplayConfirmMove: false,
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
    destroyed() {
      this.$store.commit('destroyRoomState');
    },
    computed: {
      room: () => colyseusService.room,
      isMyTurn: function() {
        const myPlayerIndex = this.players
          .findIndex(p => p.playerSessionId === colyseusService.room.sessionId);

        return this.roomState.currentTurn === myPlayerIndex
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
          message
        } = broadcast;

        switch (type) {
          case MESSAGE_CHAT:
            this.chatMessages = [
              ...this.chatMessages,
              broadcast
            ];
            break;

          case MESSAGE_ROLL_DICE:
            const { playerName, dice } = broadcast;
            this.$store.commit('addGameLog', { type: CHAT_LOG_DICE, playerName, dice });
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

        if (this.roomState.isTurnOrderPhase) {
          colyseusService.room.send({
            type: MESSAGE_FINISH_TURN
          });
        }
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
        })
      },
      finishTurn: function() {
        colyseusService.room.send({
          type: MESSAGE_FINISH_TURN
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .room {
    display: flex;

    .inner {
      flex: 1;
    }
  }

  .board-area {
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
