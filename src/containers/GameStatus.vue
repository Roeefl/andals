<template>
  <div class="game-status">
    <div class="filler">
      -
    </div>
    <div class="room-stats">
      <RoomStats :room="roomState" :mySessionId="myPlayer.playerSessionId" />
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import RoomStats from '@/components/interface/RoomStats';

  export default {
    name: 'GameStatus',
    components: {
      RoomStats
    },
    computed: mapState([
      'roomState',
      'myPlayer'
    ])
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .game-status {
    flex: 1;
    height: 100%;
    color: $secondary;
    display: flex;
    justify-content: space-between;
  }
</style>
