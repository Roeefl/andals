<template>
  <div class="rooms-list">
    <h2 class="header">
      Rooms List
    </h2>
    <ul>
      <li v-for="room in rooms" :key="room.roomId" class="room">
        <span>
          Room ID: {{ room.roomId }}
        </span>
        <span>
          Room Name: {{ room.roomTitle || room.name }}
        </span>
        <span>
          Players: {{ room.clients }}
        </span>
        <Button @click="$emit('join', room.roomId)" :disabled="room.locked">
          Join Room
        </Button>
      </li>
    </ul>
  </div>
</template>

<script>
  import Button from '@/components/common/Button';

  export default {
    name: 'RoomsList',
    components: {
      Button
    },
    props: {
      rooms: {
        type: Array,
        default: []
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
