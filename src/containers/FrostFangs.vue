<template>
  <div class="frostfangs" :class="{ ready: roomState.isGameReady }">
    &nbsp;
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'FrostFangs',
    computed: mapState([
      'roomState'
    ])
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .frostfangs {
    // opacity: 0.5;
    background-image: url('../assets/snowy-trees-sm.png');
    background-repeat: repeat;
    border: 2px dashed black;
    height: 300px;

    &.ready {
      opacity: 1;
    }
  }
</style>
