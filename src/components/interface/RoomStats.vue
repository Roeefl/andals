<template>
  <div class="room-stats">
    <span>
      You are in: {{ roomTitle }}
    </span>
    <span>
      Your SessionID is: {{ mySessionId }}
    </span>
  </div>
</template>

<script>
  export default {
    name: 'RoomStats',
    props: {
      roomTitle: {
        type: String,
        default: 'ROOM TITLE'
      },
      mySessionId: {
        type: String,
        default: '---'
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .room-stats {
    padding: 0 $spacer;
    display: flex;
    flex-direction: column;
  }
</style>
