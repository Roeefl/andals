<template>
  <div class="rooms-list-container">
    <BaseGrid
      :columns="gridColumns"
      :items="refinedRooms"
      :itemActions="gridActions"
      @join="$emit('join', $event)"
      @reconnect="$emit('reconnect', $event)"
      class="rooms-list"
    />
  </div>
</template>

<script>
  import localStorage from '@/services/localStorage';
  import BaseGrid from '@/components/common/BaseGrid';

  const gridColumns = [
    {
      key: 'name',
      title: 'Room Type'
    },
    {
      key: 'roomId',
      title: 'Room ID'
    },
    {
      key: 'roomTitle',
      title: 'Room Title'
    },
    {
      key: 'clients',
      title: 'Current Players'
    },
    {
      key: 'createdAt',
      title: 'Created At'
    }
  ];

  const gridActions = [
    {
      key: 'join',
      name: 'Join Room',
      emitValue: 'roomId',
      disabledKey: 'locked' 
    },
    {
      key: 'reconnect',
      name: 'Reconnect',
      // icon: 'lan-connect',
      emitValue: 'roomId',
      disabledKey: 'locked',
      isDisabled: room => room.roomId !== localStorage.lastRoomId
    }
  ];

  export default {
    name: 'RoomsList',
    components: {
      BaseGrid
    },
    props: {
      rooms: {
        type: Array,
        default: []
      }
    },
    computed: {
      refinedRooms: function() {
        return this.rooms.map(room => ({
          ...room,
          roomTitle: room.metadata.roomTitle,
          active: new Date(room.createdAt)
        }))
      }
    },
    created() {
      this.gridColumns = gridColumns;
      this.gridActions = gridActions;
    }
  }
</script>

<style scoped lang="scss">
 @import '@/styles/partials';

  .rooms-list-container {
    width: 100%;
    padding: $spacer;
    display: flex;
    flex-direction: column;

    .rooms-list {
      font-size: $font-size-lg;
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
