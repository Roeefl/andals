<template>
  <div class="room">
    <div v-if="this.room" class="inner">
      <h2 class="header">
        You are in a game room | ID: {{ room.id }} | Name: {{ room.name }} | SessionID: {{ room.sessionId }}
      </h2>
      <div class="control">
        <Dialog iconName="wrench" buttonText="Building Costs" title="Building Costs">
          <BuildingCosts />
        </Dialog>
        <div class="dice" v-if="roomState.isGameReady">
          <Button color="success" :onClick="rollDice" :disabled="roomState.currentTurn !== myPlayerIndex">
            Roll Dice
          </Button>
          <Dice v-if="isDisplayDice" @finished="sendDice($event)"/>
          <div v-for="(diceValue, i) in roomState.dice" :key="i" class="cube" :class="`cube-${i}`">
            <Icon size="50px" color="black" :name="`dice-${diceValue}`" />
          </div>
        </div>
        <Button
          v-if="!roomState.isGameReady"
          :color="isSelfReady ? 'red' : 'green'"
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
        <div class="players-wrapper">
          <ul class="players">
            <li
              v-for="(player, index) in players"
              :key="`player-${player.playerSessionId}-${player.isReady}`"
              class="player-wrapper"
              :class="{ 'current-turn': roomState.currentTurn === index }"
            >
              <Player :data="player" :isStarted="roomState.isGameReady" />
            </li>
          </ul>
        </div>
        <Board
          :board="roomState.board"
          :ready="roomState.isGameReady"
        />
        <aside class="sidebar">
          <GameLog />
          <Chat :messages="chatMessages" />
        </aside>
      </div>
      <Alert v-for="(log, i) in gameLog" :key="i" :text="log" />
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
  import Dice from '@/components/Dice';
  import Player from '@/components/Player';
  import Button from '@/components/Button';
  import Icon from '@/components/Icon';
  import Dialog from '@/components/Dialog';
  import Alert from '@/components/Alert';
  import BuildingCosts from '@/components/BuildingCosts';
  import { MESSAGE_CHAT, MESSAGE_GAME_LOG, MESSAGE_READY, MESSAGE_ROLL_DICE, MESSAGE_FINISH_TURN } from '@/store/constants';

  export default {
    name: 'GameRoom',
    components: {
      Board,
      Chat,
      GameLog,
      Icon,
      Player,
      Dice,
      Button,
      Dialog,
      Alert,
      BuildingCosts
    },
    data: () => ({
      chatMessages: [],
      isDisplayDice: false
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
        return this.players.findIndex(p => p.playerSessionId === colyseusService.room.sessionId);
      },
      ...mapState([
        'isSelfReady',
        'roomState',
        'players',
        'gameLog'
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
      toggleReady: function() {
        this.$store.commit('toggleSelfReady');

        console.log('sending ready');
        
        colyseusService.room.send({
          type: MESSAGE_READY,
          message: true
        });
      },
      rollDice: function() {
        this.isDisplayDice = true;
        setTimeout(() => (this.isDisplayDice = false), 3000);
      },
      sendDice: function(dice) {
        colyseusService.room.send({
          type: MESSAGE_ROLL_DICE,
          dice
        });

        // if (this.roomState.isTurnOrderPhase) {
          colyseusService.room.send({
            type: MESSAGE_FINISH_TURN
          });
        // }
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
            width: 64px;
            height: 64px;
            border: 1px solid black;
            display: flex;
            justify-content: center;
            align-items: center;

            &.cube-0 {
              background: rgba(yellow, 0.5);
            }

            &.cube-1 {
              background: rgba(red, 0.5);
            }
          }
        }
      }
    }
  }

  .board-area {
    background: $board-background;
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

  .players-wrapper {
    height: 100%;
    padding-left: $spacer / 2;
    
    .players {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }

  .player-wrapper {
    // flex: 1;
    overflow-y: hidden;
    height: 24%;
    border-radius: 20px;
    margin-top: $spacer / 2;
    background: #B0BEC5;

    &.current-turn {
      background: red;
    }

    & + & {
      border-top: 1px solid gray;
    }
  }
</style>
