<template>
  <main class="home">
    <div class="actions">
      <ChoiceDialog iconName="plus-circle" title="Create Room" @approve="createRoom">
        <CustomizeRoom
          :roomTitle="roomTitle"
          @update-title="roomTitle = $event"
          :roomMaxPlayers="roomMaxPlayers"
          @update-max-players="roomMaxPlayers = $event"
        />
      </ChoiceDialog>
      <BaseButton iconName="refresh-circle" @click="refreshRooms">
        Refresh List
      </BaseButton>
      <ChoiceDialog iconName="wrench" title="Customize Player" @approve="saveProfile" @cancel="revertProfile">
        <CustomizePlayer :storedColor="profile.color" :storedName="profile.nickname" @saved="updateProfile($event)" />
      </ChoiceDialog>
    </div>
    <RoomsList :rooms="rooms" @join="joinRoom($event)" />
  </main>
</template>

<script>
  import { mapState } from 'vuex'
  import router from '@/router';
  import colyseusService from '@/services/colyseus';
  
  import RoomsList from '@/components/lobby/RoomsList';
  import CustomizePlayer from '@/components/lobby/CustomizePlayer';
  import CustomizeRoom from '@/components/lobby/CustomizeRoom';
  import ChoiceDialog from '@/components/common/ChoiceDialog';
  import BaseButton from '@/components/common/BaseButton';

  export default {
    name: 'Home',
    components: {
      RoomsList,
      ChoiceDialog,
      CustomizePlayer,
      CustomizeRoom,
      BaseButton
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
        roomTitle: `Room ${randomInt}`,
        roomMaxPlayers: 2,
        autoRefresh: null
      };
    },
    mounted: function() {
      this.autoRefresh = setInterval(
        () => this.fetchRooms(),
        5 * 1000
      );
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
            ...this.profile
          };

          const room = await colyseusService.createRoom(options);

          colyseusService.setRoom(room);
          router.push('/room');
        } catch (err) {
          console.error(err);
        }
      },
      joinRoom: async function (roomId) {
        try {
          const options = {
            ...this.profile
          };

          const room = await colyseusService.joinById(roomId, options);

          colyseusService.setRoom(room);
          router.push('/room');
        } catch (err) {
          console.error(err);
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

  .home {
    display: flex;
    flex-direction: column;

    .actions {
      display: flex;

      & > * {
        margin-right: $spacer;
      }
    }
  }
</style>
