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
      <BaseSwitch
        label="Play vs. Bots"
        :value="playVsBots"
        @flipped="$emit('toggle-bots')"
      />
    </form>
  </div>
</template>

<script>
  import TextField from '@/components/common/TextField';
  import SelectValue from '@/components/common/SelectValue';
  import BaseSwitch from '@/components/common/BaseSwitch';

  const maxPlayersOptions = [2, 3, 4].map(value => ({ text: String(value), value }));

  export default {
    name: 'CustomizeRoom',
    components: {
      TextField,
      SelectValue,
      BaseSwitch
    },
    props: {
      roomTitle: {
        type: String,
        default: 'My Room'
      },
      roomMaxPlayers: {
        type: Number,
        default: 2
      },
      playVsBots: {
        type: Boolean,
        default: false
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
