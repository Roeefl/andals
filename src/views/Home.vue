<template>
  <main class="home">
    <Button :onClick="createRoom">
      Create Room
    </Button>
    <RoomsList :rooms="rooms" @join="joinRoom($event)" />
  </main>
</template>

<script>
  import { mapState } from 'vuex'
  import router from '@/router';
  import colyseusService from '@/services/colyseus';
  import RoomsList from '@/components/RoomsList';
  import Button from '@/components/Button';

  export default {
    name: 'Home',
    components: {
      RoomsList,
      Button
    },
    async created() {
      this.fetchRooms();
    },
    computed: mapState([
      'profile',
      'rooms'
    ]),
    methods: {
      fetchRooms: async function() {
        const rooms = await colyseusService.listRooms();
        this.$store.commit('setRooms', rooms);
      },
      createRoom: async function() {
       return this.joinRoom(null);
      },
      joinRoom: async function (roomId) {
        try {
          const options = {
            nickname: this.profile.nickname,
            color: this.profile.color
          };

          const room = await colyseusService.joinById(roomId, options);

          colyseusService.setRoom(room);
          router.push('/room');
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
</script>

<style scoped lang="scss">
 @import '@/styles/partials';

  .rooms-list {
    width: 30%;
    padding: $spacer;
    display: flex;
    flex-direction: column;

    .header {
      margin-bottom: $spacer;
    }
  }

  .room {
    border: 1px solid black;
    padding: $spacer;
    display: flex;
    flex-direction: column;
  
    & + & {
      margin-top: $spacer * 2;
    }

    & > * {
      margin-bottom: $spacer / 2;
    }
  }
</style>
