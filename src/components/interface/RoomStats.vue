<template>
  <div class="wrapper">
    <div class="room-stats">
      <span>
        Room Title: {{ roomTitle }}
      </span>
      <span>
        Room ID: {{ this.$route.params.roomId  }}
      </span>
      <span>
        Your SessionID is: {{ mySessionId }}
      </span>
    </div>
    <AppHeader />
  </div>
</template>

<script>
  import AppHeader from '@/containers/AppHeader';

  export default {
    name: 'RoomStats',
    components: {
      AppHeader
    },
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

  .wrapper {
    display: flex;
    justify-content: flex-end;
  }

  .room-stats {
    padding: 0 $spacer;
    display: flex;
    flex-direction: column;
  }
</style>
