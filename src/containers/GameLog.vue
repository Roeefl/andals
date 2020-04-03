<template>
  <MessageList title="Game Log" :messages="gameLog">
    <li v-for="(log, i) in gameLog" :key="i" class="log">
      <div v-if="log.type === CHAT_LOG_SIMPLE">
        {{ log.message }}
      </div>
      <div v-if="log.type === CHAT_LOG_DICE" class="log">
        {{ log.playerName }} rolls:
        <Icon v-for="(diceValue, i) in log.dice" :key="`cube-${i}`" size="20px" :color="!i ? 'yellow' : 'red'" :name="`dice-${diceValue}`" />
      </div>
    </li>
  </MessageList>
</template>

<script>
  import { mapState } from 'vuex';
  import { CHAT_LOG_SIMPLE, CHAT_LOG_DICE } from '@/store/constants';

  import MessageList from '@/components/MessageList';
  import Button from '@/components/Button';
  import Icon from '@/components/Icon';

  export default {
    name: 'GameLog',
    components: {
      MessageList,
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
  .log {
    border-top: 1px solid lightgray;
    margin: $spacer / 3 0;
    padding: $spacer / 3 0;
  }
</style>
