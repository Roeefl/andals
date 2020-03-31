<template>
  <div class="room">
    <div v-if="this.room" class="inner">
      <h2 class="header">
        You are in a game room | ID: {{ room.id }} | Name: {{ room.name }} | SessionID: {{ room.sessionId }}
      </h2>
      <div class="control">
        <Button color="primary" :onClick="toggleModal">
          Building Costs
        </Button>
        <div class="dice">
          <Button color="success" :onClick="rollDice">
            Roll
          </Button>
          <div v-for="(diceValue, i) in roomState.dice" :key="i" class="cube">
            {{ diceValue }}
          </div>
        </div>
        <Button
          v-if="!roomState.isGameStarted"
          :color="isSelfReady ? 'danger' : 'success'"
          :onClick="toggleReady"
          class="ready"
        >
          <span v-if="isSelfReady">
            Not Ready
          </span>
          <span v-else>
            Ready!
          </span>
        </Button>
      </div>
      <div class="board-area">
        <ul class="players">
          <li v-for="player in players" :key="`player-${player.playerSessionId}-${player.isReady}`" class="player-wrapper" :style="{ background: player.color }">
            <Player :data="player" :isGameStarted="roomState.isGameStarted" />
          </li>
        </ul>
        <Board
          :board="roomState.board"
          :harbors="roomState.harbors"
          :isGameStarted="roomState.isGameStarted"
        />
        <aside class="sidebar">
          <GameLog />
          <Chat :messages="chatMessages" />
        </aside>
      </div>
      <Modal :isOpen="isDisplayModal">
        <BuildingCosts />
      </Modal>
    </div>
    <div v-else>
      Not currently connected to any game room.
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import colyseusService from '@/services/colyseus';
  import Board from '@/components/Board';
  import GameLog from '@/components/GameLog';
  import Chat from '@/components/Chat';
  import Player from '@/components/Player';
  import Button from '@/components/Button';
  import Modal from '@/components/Modal';
  import BuildingCosts from '@/components/BuildingCosts';
  import { MESSAGE_CHAT, MESSAGE_GAME_LOG, MESSAGE_READY } from '@/store/constants';

  export default {
    name: 'GameRoom',
    components: {
      Board,
      Chat,
      GameLog,
      Player,
      Button,
      Modal,
      BuildingCosts
    },
    data: () => ({
      chatMessages: []
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
      console.log(this.players[0].isReady);
    },
    computed: {
      room: () => colyseusService.room,
      ...mapState([
        'isSelfReady',
        'isDisplayModal',
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
        const { type, sender, message } = broadcast;

        switch (type) {
          case MESSAGE_CHAT:
            this.chatMessages = [
              ...this.chatMessages,
              { sender, message }
            ];
            break;

          case MESSAGE_GAME_LOG:
            this.$store.commit('addGameLog', message);
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
      toggleModal: function() {
        this.$store.commit('toggleModal');
      },
      toggleReady: function() {
        this.$store.commit('toggleSelfReady');

        console.log('sending ready');
        
        colyseusService.room.send({
          type: MESSAGE_READY,
          message: true
        });
      },
      rollDice: function() {
        console.log('rolled');
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

      .header {
        margin-bottom: $spacer * 2;
      }

      .control {
        display: flex;
        justify-content: space-evenly;

        .dice {
          display: flex;

          .cube {
            width: 32px;
            height: 32px;
            background: yellow;
            border: 1px solid black;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
  }

  .board-area {
    background: $tile-water / 2;
    display: grid;
    grid-template-columns: 20% 60% 20%;

    .sidebar {
      border-left: 1px solid gray;
      padding-left: $spacer / 2;
      height: 100%;
      display: flex;
      flex-direction: column;

      & > * {
        flex: 1;
      }
    }
  }

  .players {
    height: 100%;
    display: flex;
    flex-direction: column;

    .player-wrapper {
      // flex: 1;
      height: 25%;
    }
  }
</style>
