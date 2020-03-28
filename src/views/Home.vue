<template>
  <main class="home">
    <Button color="primary" round :onClick="createRoom">
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
          <button @click="joinRoom(room.roomId)" :disabled="room.locked">
            Join Room
          </button>
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
      'reservations',
      'profile'
    ]),
    methods: {
      fetchRooms: async function() {
        const rooms = await colyseusService.listRooms();
        this.$store.commit('setRooms', rooms);
      },
      createRoom: async function() {
        try {
          const seatReservation = await colyseusService.createRoom();
          // this.$store.commit('addReservation', seatReservation);

          this.fetchRooms();
        } catch (err) {
          console.error(err);
        }
      },
      joinRoom: async function (roomId) {
        try {
          // const availableReservation = this.reservations.find(res => res.id === roomId);
          // let room = null;

          // if (availableReservation) {
            // room = await colyseusService.client.consumeSeatReservation(availableReservation)
            // this.$store.commit('removeReservation', roomId);
          // } else {
          // }
          const options = {
            nickname: this.profile.nickname,
            color: this.profile.color
          };

          const room = await colyseusService.client.joinById(roomId, options);
          console.info("joinById returned: ", room)

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
