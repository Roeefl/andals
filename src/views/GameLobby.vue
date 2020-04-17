<template>
  <main class="game-lobby">
    <div class="loader-wrapper">
      <SnowyTown class="game-loader" />
      <Snowflakes class="snowflakes" />
    </div>
    <section class="lobby-interface">
      <AppHeader />
      <div class="actions">
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
        <BaseButton iconName="refresh-circle" @click="refreshRooms" class="refresh-list">
          Refresh List
        </BaseButton>
        <ChoiceDialog iconName="wrench" title="Customize Player" buttonText="Customize Player" @approve="saveProfile" @cancel="revertProfile" class="customize-player">
          <CustomizePlayer :storedColor="profile.color" :storedName="profile.nickname" @saved="updateProfile($event)" />
        </ChoiceDialog>
        <BaseButton iconName="add" @click="reconnect">
          Reconnect
        </BaseButton>
      </div>
      <RoomsList :rooms="rooms" @join="joinRoom($event)" />
    </section>
  </main>
</template>

<script>
  import { mapState } from 'vuex'
  import router from '@/router';
  import colyseusService, { ROOM_TYPE_FIRST_MEN } from '@/services/colyseus';
  
  import AppHeader from '@/containers/AppHeader';
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
      AppHeader,
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
      'profile',
      'rooms'
    ]),
    data: function() {
      const randomInt = Math.floor(Math.random() * 9999);
      
      return {
        roomType: ROOM_TYPE_FIRST_MEN,
        roomTitle: `Room ${randomInt}`,
        roomMaxPlayers: 4,
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
          const options = {
            roomTitle: this.roomTitle,
            maxPlayers: this.roomMaxPlayers,
            playVsBots: this.playVsBots,
            autoPickup: this.autoPickup,
            friendlyGameLog: this.friendlyGameLog,
            botReplacement: this.botReplacement,
            ...this.profile
          };

          const room = await colyseusService.createRoom(this.roomType, options);

          colyseusService.setRoom(room);
          router.push(`/room/${room.id}`);
        } catch (err) {
          console.error(err);
        }
      },
      joinRoom: async function(roomId) {
        try {
          const options = {
            ...this.profile
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
      updateProfile: function(updatedProfile) {
        this.$store.commit('updateProfile', updatedProfile);
      },
      saveProfile: function() {
        this.$store.commit('syncProfile');
      },
      revertProfile: function() {
        this.$store.commit('revertProfile');
      }
    }
  }
</script>

<style scoped lang="scss">
 @import '@/styles/partials';

  .game-lobby {
    overflow-y: hidden;

    .lobby-interface {
      z-index: 20;
      display: flex;
      flex-direction: column;

      & > * {
        z-index: 20;
      }
    }

    .actions {
      display: flex;

      .refresh-list {
        margin-left: $spacer;
      }

      .customize-player {
        margin-left: $spacer * 3;
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
      background: $app-background;
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