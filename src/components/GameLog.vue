<template>
  <div class="logs">
    <h2>
      Game Log
    </h2>
    <ul>
      <li v-for="(log, i) in gameLog" :key="i">
        <div v-if="log.type === CHAT_LOG_SIMPLE" class="log">
          {{ log.message }}
        </div>
        <div v-if="log.type === CHAT_LOG_DICE" class="roll">
          {{ log.playerName }} rolls:
          <Icon v-for="(diceValue, i) in log.dice" :key="`cube-${i}`" size="20px" :color="!i ? 'yellow' : 'red'" :name="`dice-${diceValue}`" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import Button from '@/components/Button';
  import Icon from '@/components/Icon';
  import { CHAT_LOG_SIMPLE, CHAT_LOG_DICE } from '@/store/constants';

  export default {
    name: 'GameLog',
    components: {
      Button,
      Icon
    },
    computed: mapState([
      'gameLog'
    ]),
    created() {
      this.CHAT_LOG_SIMPLE = CHAT_LOG_SIMPLE;
      this.CHAT_LOG_DICE = CHAT_LOG_DICE;
    }
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