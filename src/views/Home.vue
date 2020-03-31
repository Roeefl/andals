<template>
  <main class="home">
    <Button color="primary" rounded :onClick="createRoom">
      Create Room
    </Button>
    <div class="rooms-list">
      <h2 class="header">
        Room List
      </h2>
      <ul>
        <li v-for="room in this.rooms" :key="room.roomId" class="room">
          <span>
            Room ID: {{ room.roomId }}
          </span>
          <span>
            Room Name: {{ room.name }}
          </span>
          <span>
            Players: {{ room.clients }}
          </span>
          <span>
            Max Players: {{ room.maxClients }}
          </span>
          <Button :onClick="() => joinRoom(room.roomId)" :disabled="room.locked">
            Join Room
          </Button>
        </li>
      </ul>
    </div>
  </main>
</template>

<script>
  import { mapState } from 'vuex'
  import axios from 'axios';
  import router from '@/router';
  import colyseusService from '@/services/colyseus';
  import Button from '@/components/Button';

  export default {
    name: 'Home',
    components: {
      Button
    },
    async created() {
      this.fetchRooms();
    },
    computed: mapState([
      'rooms',
      'profile'
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
