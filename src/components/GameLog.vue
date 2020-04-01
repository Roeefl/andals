<template>
  <div class="logs">
    <h2>
      Game Log
    </h2>
    <ul>
      <li v-for="(log, i) in gameLog" :key="i">
        <div class="log">
          {{ log }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import Button from '@/components/Button';

  export default {
    name: 'GameLog',
    components: {
      Button
    },
    computed: mapState([
      'gameLog'
    ]),
  }
</script>

<style scoped lang="scss">
  .logs {
    max-height: 320px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    color: white;
  }
</style>