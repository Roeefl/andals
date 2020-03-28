<template>
  <div class="room">
    <div v-if="this.room" class="inner">
      <h1 class="header">
        You are in a game room | ID: {{ room.id }} | Name: {{ room.name }} | SessionID: {{ room.sessionId }}
      </h1>
      <div class="control">
        <div class="messages">
          <h2>
            Messages from Room:
          </h2>
          <div>
            <input v-model="newMessage" placeholder="Say hello..." />
            <Button color="primary" :onClick="sendMessage">
              Send Message
            </Button>
          </div>
          <ul>
            <li v-for="(chatMsg, i) in chatMessages" :key="i">
              <div class="chat-message">
                {{ chatMsg.sender }}: {{ chatMsg.message }}
              </div>
            </li>
          </ul>
        </div>
        <div class="players">
          <h2>
            Players in Room:
          </h2>
          <ul>
            <li v-for="(player, i) in currentRoomState.players" :key="i">
              <div class="player" :style="{ color: player.color }">
                {{ player.nickname }}
              </div>
            </li>
          </ul>
        </div>
      </div>
      <Board :board="this.currentRoomState.board" class="board" />
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
  import Button from '@/components/Button';

  export default {
    name: 'GameRoom',
    components: {
      Board,
      Button
    },
    data: () => ({
      chatMessages: [],
      newMessage: ''
    }),
    created() {
      if (!this.room) return;

      // Define a series of room lifecycle methods
      this.room.onStateChange.once(this.initializeState);
      this.room.onStateChange(this.updateState);

      this.room.onMessage(this.onMessageReceived);

      this.room.onError(this.onRoomError);
      this.room.onLeave(this.onRoomLeave);
    },
    computed: {
      room: () => colyseusService.room,
      ...mapState([
        'currentRoomState'
      ])
    },
    methods: {
      initializeState: function(initialRoomState) {
        this.$store.commit('updateRoomState', initialRoomState)
      },
      updateState: function(updatedRoomState) {
        this.$store.commit('updateRoomState', updatedRoomState);
      },
      onMessageReceived: function(message) {
        this.chatMessages = [
          ...this.chatMessages,
          message
        ];
      },
      onRoomError: function(error) {
        console.error(`Room ${this.room.sessionId} encountered error: ${error.message}`);
      },
      onRoomleave: function() {
        console.info(`${colyseusService.client.id} has left ${this.room.id}`);
      },
      sendMessage: function(e) {
        e.preventDefault();
        if (!this.newMessage || !this.newMessage.length) return;

        this.room.send({ message: this.newMessage });
        this.newMessage = '';
      }
    }
  }
</script>


<style scoped lang="scss">
  @import '@/styles/partials';

  .room {
    display: flex;
    // justify-content: center;
    // align-items: center

    .inner {
      flex: 1;

      .header {
        margin-bottom: $spacer * 2;
      }

      .control {
        display: flex;

        .messages { 
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .players {
          border-left: 1px solid black;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;

          .player {

          }
        }
      }

      .board {
        margin-top: $spacer * 3;
      }
    }
  }
</style>
