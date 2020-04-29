<template>
  <main class="game-lobby" id="game-lobby">
    <div class="loader-wrapper">
      <SnowyTown class="game-loader" />
      <Snowflakes :count="1" class="snowflakes" />
    </div>
    <section class="lobby-interface">
      <ul class="actions">
        <li class="action-item">
          <ChoiceDialog iconName="plus-circle" title="Create Room" buttonText="Create Room" @approve="createRoom" class="create-room">
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
        <li class="action-item">
          <ChoiceDialog
            iconName="wrench"
            title="Customize Player"
            buttonText="Customize Player"
            @approve="saveUserPreferences"
            class="customize-player"
          >
            <CustomizePlayer
              :nickname="nickname || currentUser.nickname"
              @update-nickname="nickname = $event"
              :color="color || currentUser.color"
              @update-color="color = $event"
              :avatar="avatar || currentUser.avatar"
              @update-avatar="avatar = $event"
            />
          </ChoiceDialog>
        </li>
        <li class="action-item">
          <BaseButton spaced color="info" iconName="lan-connect" iconSize="x-large" @click="reconnect" class="reconnect">
            Reconnect
          </BaseButton>
        </li>
      </ul>
      <RoomsList :rooms="rooms" @join="joinRoom($event)" class="rooms-list" />
    </section>
  </main>
</template>

<script>
  import { mapState } from 'vuex'
  import router from '@/router';
  import colyseusService, { ROOM_TYPE_FIRST_MEN } from '@/services/colyseus';
  import firebaseService from '@/services/firebase';
  
  import RoomsList from '@/components/lobby/RoomsList';
  import CustomizePlayer from '@/components/lobby/CustomizePlayer';
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
      CustomizePlayer,
      CustomizeRoom,
      BaseButton,
      SnowyTown,
      Snowflakes
    },
    async created() {
      this.fetchRooms();
    },
    computed: mapState([
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
        botReplacement: true,
        nickname: '',
        color: '',
        avatar: 0
      };
    },
    mounted() {
      this.autoRefresh = setInterval(
        () => this.fetchRooms(),
        15 * 1000
      );

      this.$store.commit('startAmbience');
    },
    destroyed: function() {
      clearInterval(this.autoRefresh);
    },
    methods: {
      fetchRooms: async function() {
        const rooms = await colyseusService.listRooms();
        this.$store.commit('setRooms', rooms);
      },
      refreshRooms: async function() {
        await this.fetchRooms();
        this.$store.commit('addAlert', 'Rooms list refreshed');
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
          const room = await colyseusService.reconnect();

          if (!room) {
            this.$store.commit('addAlert', 'Unable to reconnect. Sorry.');
            return;
          }
          
          colyseusService.setRoom(room);
          router.push(`/room/${room.id}`);
        } catch (err) {
          console.error('reconnect failed:', err);
        }
      },
      saveUserPreferences: async function() {
        if (this.currentUser && this.currentUser.uid) {
          const updatedUser = await firebaseService.updateProfile(this.nickname, this.color, this.avatar);
          this.$store.commit('setCurrentUser', updatedUser);

          this.nickname = '';
          this.color = '';
          this.avatar = 0;
        }
      }
    }
  }
</script>

<style scoped lang="scss">
 @import '@/styles/partials';

  .game-lobby {
    overflow-y: hidden;

    .lobby-interface {
      z-index: $zindex-interface;
      display: flex;
      flex-direction: column;
      padding-top: $header-height * 1.5;

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

      .refresh-list,
      .reconnect {
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
