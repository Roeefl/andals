<template>
  <div class="wrapper">
    <div class="room-stats">
      <span>
        Room Title: {{ room.roomTitle }}
      </span>
      <span>
        Room ID: {{ this.$route.params.roomId  }}
      </span>
      <span>
        Your SessionID is: {{ mySessionId }}
      </span>
    </div>
    <div class="room-stats">
      <span v-for="(setting, s) in roomSettings" :key="s">
        {{ setting }}: {{ room[setting] }}
      </span>
    </div>
  </div>
</template>

<script>
  const roomSettings = ['autoPickupEnabled', 'friendlyGameLog', 'enableBotReplacement'];

  export default {
    name: 'RoomStats',
    props: {
      room: {
        type: Object,
        default: () => {}
      },
      mySessionId: {
        type: String,
        default: '---'
      }
    },
    created() {
      this.roomSettings = roomSettings;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .wrapper {
    display: flex;
    justify-content: flex-end;
    color: $primary;
  }

  .room-stats {
    padding: 0 $spacer;
    display: flex;
    flex-direction: column;
  }
</style>
