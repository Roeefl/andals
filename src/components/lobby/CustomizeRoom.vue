<template>
  <div>
    <form class="customize">
      <SelectValue
        label="Game Type"
        :options="roomTypeOptions"
        :selected="{ text: roomType, value: roomType }"
        @selected="$emit('select-room-type', $event)"
      />
      <TextField :value="roomTitle" @input="$emit('update-title', $event)" label="Room Title..." />
      <SelectValue
        label="Max Players"
        :options="maxPlayersOptions"
        :selected="{ text: String(roomMaxPlayers), value: roomMaxPlayers }"
        @selected="$emit('update-max-players', $event)"
      />
      <BaseSwitch
        label="Play vs. Bots"
        :value="playVsBots"
        @flipped="$emit('toggle-bots')"
      />
      <BaseSwitch
        label="Automatically pick up Loot"
        :value="autoPickup"
        @flipped="$emit('toggle-auto-pickup')"
      />
      <BaseSwitch
        label="Display collected resources in Game Log (Good while still learning the game)"
        :value="friendlyGameLog"
        @flipped="$emit('toggle-friendly-game-log')"
      />
      <BaseSwitch
        label="Immediately replace disconnected players by Bots until reconnection"
        :value="botReplacement"
        @flipped="$emit('toggle-bot-replacement')"
      />
    </form>
  </div>
</template>

<script>
  import TextField from '@/components/common/TextField';
  import SelectValue from '@/components/common/SelectValue';
  import BaseSwitch from '@/components/common/BaseSwitch';
  import { roomTypes, ROOM_TYPE_BASE_GAME } from '@/services/colyseus';

  const maxPlayersOptions = [2, 3, 4].map(value => ({ text: String(value), value }));
  const roomTypeOptions = roomTypes.map(roomType => ({ text: roomType, value: roomType }));

  export default {
    name: 'CustomizeRoom',
    components: {
      TextField,
      SelectValue,
      BaseSwitch
    },
    props: {
      roomType: {
        type: String,
        default: ROOM_TYPE_BASE_GAME
      },
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
      },
      autoPickup: {
        type: Boolean,
        default: true
      },
      friendlyGameLog: {
        type: Boolean,
        default: false
      },
      botReplacement: {
        type: Boolean,
        default: true
      }
    },
    created() {
      this.maxPlayersOptions = maxPlayersOptions;
      this.roomTypeOptions = roomTypeOptions;
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
