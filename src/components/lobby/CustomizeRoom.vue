<template>
  <div>
    <form class="customize">
      <TextField :value="roomTitle" @input="$emit('update-title', $event)" label="Room Title..." />
      <SelectValue
        :options="maxPlayersOptions"
        label="Max Players"
        :selected="{ text: String(roomMaxPlayers), value: roomMaxPlayers }"
        @selected="$emit('update-max-players', $event)"
      />
    </form>
  </div>
</template>

<script>
  import TextField from '@/components/common/TextField';
  import SelectValue from '@/components/common/SelectValue';

  const maxPlayersOptions = [2, 3, 4].map(value => ({ text: String(value), value }));

  export default {
    name: 'CustomizeRoom',
    components: {
      TextField,
      SelectValue
    },
    props: {
      roomTitle: {
        type: String,
        default: 'My Room'
      },
      roomMaxPlayers: {
        type: Number,
        default: 2
      }
    },
    created() {
      this.maxPlayersOptions = maxPlayersOptions;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .customize {
    padding: $spacer;
    display: flex;
    flex-direction: column;
  }
</style>
