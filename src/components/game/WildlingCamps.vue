<template>
  <div class="wildling-camps">

  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'WildlingCamps',
    computed: mapState([
      'roomState'
    ])
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .wildling-camps {
    background-image: url('../../assets/snowy-trees-sm.png');
    background-repeat: repeat;
  }
</style>
