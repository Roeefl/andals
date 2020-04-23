<template>
  <div class="rooms-list-container">
    <h2 class="header">
      Rooms List
    </h2>
    <BaseGrid
      :columns="gridColumns"
      :items="rooms"
      :itemActions="gridActions"
      @action-clicked="$emit('join', $event)"
      class="rooms-list"
    />
  </div>
</template>

<script>
  import BaseGrid from '@/components/common/BaseGrid';

  const gridColumns = [
    {
      key: 'roomId',
      title: 'Room ID'
    },
    {
      key: 'name',
      title: 'Room Type'
    },
    {
      key: 'roomTitle',
      title: 'Room Title'
    },
    {
      key: 'clients',
      title: 'Current Players'
    }
  ];

  const gridActions = [
    {
      name: 'Join Room',
      emitValue: 'roomId',
      disabledKey: 'locked' 
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

    .header {
      margin-bottom: $spacer;
    }

    .rooms-list {
      width: 70%;
      font-size: $font-size-md;
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
