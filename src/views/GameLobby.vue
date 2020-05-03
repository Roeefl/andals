<template>
  <main class="game-lobby" id="game-lobby">
    <div class="loader-wrapper">
      <SnowyTown class="game-loader" />
      <Snowflakes :count="lobbySnowflakes" class="snowflakes" />
    </div>
    <div class="header-fallback" />
    <section class="lobby-interface">
      <ul class="actions">
        <li class="action-item">
          <ChoiceDialog iconName="plus-circle" title="Create Room" buttonText="Create Room" :disabled="!isServerUp" @approve="createRoom" class="create-room">
            <CustomizeRoom
              :roomType="roomType"
              @select-room-type="roomType = $event"
              :roomTitle="roomTitle"
              @update-title="roomTitle = $event"
              :roomMaxPlayers="roomMaxPlayers"
              @update-max-players="roomMaxPlayers = $event"
              :playVsBots="playVsBots"
              @toggle-bots="playVsBots = !playVsBots"
              :autoPickup="autoPickup"
              @toggle-auto-pickup="autoPickup = !autoPickup"
              :friendlyGameLog="friendlyGameLog"
              @toggle-friendly-game-log="friendlyGameLog = !friendlyGameLog"
              :botReplacement="botReplacement"
              @toggle-bot-replacement="botReplacement = !botReplacement"
            />
          </ChoiceDialog>
        </li>
        <li class="action-item">
          <BaseButton spaced color="info" iconColor="white" iconName="refresh-circle" iconSize="x-large" @click="refreshRooms" class="refresh-list">
            Refresh List
          </BaseButton>
        </li>
      </ul>
      <RoomsList :rooms="rooms" @join="joinRoom($event)" @reconnect="reconnect($event)" class="rooms-list" />
    </section>
  </main>
</template>

<script>
  import { mapState } from 'vuex';
  import router from '@/router';
  import colyseusService, { ROOM_TYPE_FIRST_MEN } from '@/services/colyseus';
  import firebaseService from '@/services/firebase';
  
  import RoomsList from '@/components/lobby/RoomsList';
  import CustomizeRoom from '@/components/lobby/CustomizeRoom';
  import ChoiceDialog from '@/components/common/ChoiceDialog';
  import BaseButton from '@/components/common/BaseButton';

  import SnowyTown from '@/components/decor/SnowyTown';
  import Snowflakes from '@/components/decor/Snowflakes';

  export default {
    name: 'GameLobby',
    components: {
      RoomsList,
      ChoiceDialog,
      CustomizeRoom,
      BaseButton,
      SnowyTown,
      Snowflakes
    },
    async created() {
      this.fetchRooms();
    },
    computed: mapState([
      'isServerUp',
      'lobbySnowflakes',
      'currentUser',
      'rooms'
    ]),
    data: function() {
      const randomInt = Math.floor(Math.random() * 9999);
      
      return {
        roomType: ROOM_TYPE_FIRST_MEN,
        roomTitle: `Room ${randomInt}`,
        roomMaxPlayers: 2,
        autoRefresh: null,
        playVsBots: false,
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

      this.$store.commit('startAmbience');
    },
    destroyed: function() {
      clearInterval(this.autoRefresh);
    },
    methods: {
      fetchRooms: async function() {
        try {
          const rooms = await colyseusService.listRooms();
          this.$store.commit('setRooms', rooms);
          this.$store.commit('setServerStatus', true);

          return true;
        } catch (err) {
          this.$store.commit('setServerStatus', false);
      
          console.error('Unable to fetch rooms list. Game server might be down');
          this.$store.commit('addAlert', 'Unable to connect to game server');

          return false;
        }
      },
      refreshRooms: async function() {
        try {
          const isSuccess = await this.fetchRooms();
          if (isSuccess)
            this.$store.commit('addAlert', 'Rooms list refreshed');
        } catch (err) {
          console.error('Unable to fetch rooms list. Game server might be down');
          this.$store.commit('addAlert', 'Unable to connect to game server');
        }
      },
      createRoom: async function() {
        try {
          this.$store.commit('setGameLoading', true);
          
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
            this.$store.commit('addAlert', 'Unable to reconnect. Sorry.');
            return;
          }
          
          colyseusService.setRoom(room);
          router.push(`/room/${room.id}`);
        } catch (err) {
          console.error('Reconnect Failed:', err);
        }
      }
    }
  }
</script>

<style scoped lang="scss">
 @import '@/styles/partials';

  .game-lobby {
    overflow-y: hidden;

    .header-fallback {
      height: $header-height;
      background: $primary;
      margin-bottom: $spacer * 2;
    }

    .lobby-interface {
      z-index: $zindex-interface;
      display: flex;
      flex-direction: column;

      & > * {
        z-index: $zindex-interface;
      }

      .rooms-list {
        margin-top: $spacer * 1.5;
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
  }

  .loader-wrapper {
    z-index: 10;
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
</style>
