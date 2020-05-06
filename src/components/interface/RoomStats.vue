<template>
  <div class="wrapper">
    <div class="room-stats">
      <div>
        <h3>
          Room Title: 
        </h3>
        <span>
          {{ roomState.roomTitle }}
        </span>
      </div>
      <div>
        <h3>
          Room ID: 
        </h3>
        <span>
          {{ this.$route.params.roomId  }}
        </span>
      </div>
      <div>
        <h3>
          Your SessionID:
        </h3>
        <span>
          {{ myPlayer.playerSessionId }}
        </span>
      </div>
    </div>
    <div class="room-stats">
      <div v-for="(setting, s) in roomSettings" :key="s">
        <h3>
          {{ setting }}:
        </h3>
        <span>
          {{ roomState[setting] }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  const roomSettings = ['autoPickupEnabled', 'friendlyGameLog', 'enableBotReplacement'];

  export default {
    name: 'RoomStats',
    computed: mapState([
      'roomState',
      'myPlayer'
    ]),
    created() {
      this.roomSettings = roomSettings;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .wrapper {
    display: flex;
    justify-content: space-evenly;
    padding: $spacer;
    font-size: $font-size-md;
  }

  .room-stats {
    flex: 1;
    display: flex;
    flex-direction: column;

    & + & {
      padding-left: $spacer;
      border-left: 1px solid $primary;
    }

    & > div {
      display: grid;
      grid-template-columns: 70% 30%;
      align-items: center;
    }

    span {
      color: $warning;
    }
  }
</style>
