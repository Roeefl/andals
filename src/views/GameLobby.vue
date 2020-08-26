<script>
  import { mapState, mapMutations } from 'vuex';
  import router from '@/router';
  import colyseusService, { ROOM_TYPE_FIRST_MEN } from '@/services/colyseus';
  import firebaseService from '@/services/firebase';

  import RoomsList from '@/components/lobby/RoomsList';
  import GameChat from '@/components/interface/GameChat';
  import RoomSettings from '@/components/lobby/RoomSettings';
  import ChoiceDialog from '@/components/common/ChoiceDialog';
  import BaseButton from '@/components/common/BaseButton';
  import Avital from '@/components/common/Avital';

  import SnowyTown from '@/components/decor/SnowyTown';
  import Snowflakes from '@/components/decor/Snowflakes';

  export default {
    name: 'GameLobby',
    components: {
      RoomsList,
      GameChat,
      ChoiceDialog,
      RoomSettings,
      BaseButton,
      SnowyTown,
      Snowflakes,
      Avital
    },
    async created() {
      this.fetchRooms();
    },
    computed: mapState([
      'isServerUp',
      'lobbySnowflakes',
      'currentUser',
      'rooms',
      'lobbyChat'
    ]),
    data: function() {
      const randomInt = Math.floor(Math.random() * 9999);
      
      return {
        roomType: ROOM_TYPE_FIRST_MEN,
        roomTitle: `Room ${randomInt}`,
        roomMaxPlayers: 2,
        autoRefresh: null,
        playVsBots: true,
        autoPickup: true,
        friendlyGameLog: false,
        botReplacement: true
      };
    },
    mounted() {
      this.autoRefresh = setInterval(
        () => this.fetchRooms(),
        20 * 1000
      );

      this.startAmbience();
    },
    destroyed: function() {
      clearInterval(this.autoRefresh);
    },
    watch: {
      lobbyChat: function(newMessages, oldMessages) {
        if (newMessages.length > oldMessages.length) {
          const { messageReceived } = this.$refs;
          if (messageReceived) messageReceived.play(); 
        }
      }
    },
    methods: {
      ...mapMutations([
        'setServerStatus',
        'addAlert',
        'setRooms',
        'setGameLoading',
        'startAmbience'
      ]),
      fetchRooms: async function() {
        try {
          const rooms = await colyseusService.listRooms();
          this.setRooms(rooms);
          this.setServerStatus(true);

          return true;
        } catch (err) {
          this.setServerStatus(false);
      
          console.error('Unable to fetch rooms list. Game server might be down');
          this.addAlert({ color: 'warning', text: 'Unable to connect to game server' });

          return false;
        }
      },
      refreshRooms: async function() {
        try {
          const isSuccess = await this.fetchRooms();
          if (isSuccess)
            this.addAlert({ text: 'Rooms list refreshed' });
        } catch (err) {
          console.error('Unable to fetch rooms list. Game server might be down');
          this.addAlert({ color: 'warning', text: 'Unable to connect to game server' });
        }
      },
      createRoom: async function() {
        try {
          this.setGameLoading(true);
          
          const options = {
            roomTitle: this.roomTitle,
            maxPlayers: this.roomMaxPlayers,
            playVsBots: this.playVsBots,
            autoPickup: this.autoPickup,
            friendlyGameLog: this.friendlyGameLog,
            enableBotReplacement: this.botReplacement,
            nickname: this.currentUser.nickname,
            color: this.currentUser.color,
            avatar: this.currentUser.avatar
          };

          const room = await colyseusService.createRoom(this.roomType, options);
          console.log("room", room)

          colyseusService.setRoom(room);
          router.push(`/room/${room.id}`);
        } catch (err) {
          console.error(err);
        }
      },
      joinRoom: async function(roomId) {
        try {
          const options = {
            nickname: this.currentUser.nickname,
            color: this.currentUser.color,
            avatar: this.currentUser.avatar
          };

          const room = await colyseusService.joinById(roomId, options);

          colyseusService.setRoom(room);
          router.push(`/room/${room.id}`);
        } catch (err) {
          console.error(err);
        }
      },
      reconnect: async function(roomId) {
        try {
          const room = await colyseusService.reconnect(roomId);

          if (!room) {
            this.addAlert({ color: 'warning', text: 'Unable to reconnect. Sorry.' });
            return;
          }
          
          colyseusService.setRoom(room);
          router.push(`/room/${room.id}`);
        } catch (err) {
          console.error('Reconnect Failed:', err);
        }
      },
      sendLobbyMessage: function({ channel, message }) {
        firebaseService.sendLobbyChatMessage(this.currentUser.nickname, channel, message);
      },
      startAmbience: function() {
        const { ambience } = this.$refs;

        if (ambience) {
          ambience.play(); 
          ambience.loop = true;
        }
      },
      stopAmbience: function() {
        const { ambience } = this.$refs;
        
        if (ambience) {
          ambience.pause();
          ambience.currentTime = 0;
        }
      }
    }
  }
</script>

<template>
  <main class="game-lobby" id="game-lobby">
    <div class="loader-wrapper">
      <SnowyTown class="game-loader" />
      <Snowflakes :count="lobbySnowflakes" class="snowflakes" />
    </div>
    <Avital class="avital" />
    <BaseButton
      spaced
      color="primary"
      iconName="play-box-outline"
      iconSize="24px"
      iconColor="success"
      @click="startAmbience"
      class="ambience-start"
    >
      Ambience, Please
    </BaseButton>
    <audio ref="ambience">
      <source src="../assets/audio/snowstorm-ambience.mp3" type="audio/mpeg">
    </audio>
  </main>
</template>

<style scoped lang="scss">
 @import '@/styles/partials';

  .game-lobby {
    height: 100%;
    overflow-y: hidden;
    display: flex;
    flex-direction: column;

    .header-fallback {
      height: $header-height;
      background: $primary;
      margin-bottom: $spacer * 2;
    }

    .lobby-interface {
      flex: 1;
      z-index: $zindex-interface;
      display: flex;
      flex-direction: column;

      & > * {
        z-index: $zindex-interface;
      }
    }

    .actions {
      display: flex;

      .action-item {
        width: 200px;
        height: 50px;
        margin-left: $spacer;
      }

      .refresh-list {
        width: 100%;
        height: 100%;
      }
    }

    .lobby-contents {
      flex: 1;
      max-height: 80%;
      overflow-y: auto;
      margin-top: $spacer * 1.5;
      display: grid;
      grid-template-columns: 80% 20%;

      .lobby-chat {
        position: relative;
        max-height: 50vh;
        overflow-y: auto;
      }
    }
  }

  .loader-wrapper {
    z-index: $zindex-overlay-wrapper;
    overflow-y: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-end;

    .game-loader {
      background: $secondary;
      width: 100%;
      height: 60%;
    }

    .snowflakes {
      z-index: 0;
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  .avital {
    position: absolute;
    top: 5%;
    left: 10%;
    z-index: 10000;
  }

  .ambience-start {
    position: absolute;
    top: $spacer * 2;
    left: $spacer * 2;
    z-index: 2000;
  }
</style>
