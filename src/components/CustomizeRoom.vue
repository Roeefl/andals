<template>
  <div class="customize">
    <form>
      <TextField :value="roomTitle" @input="$emit('saved', $event)" label="Room Title..." />
    </form>
  </div>
</template>

<script>
  import TextField from '@/components/TextField';

  export default {
    name: 'CustomizeRoom',
    components: {
      TextField
    },
    props: {
      roomTitle: {
        type: String,
        default: 'My Room'
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .customize {
    display: flex;
    flex-direction: column;
  }
</style>
