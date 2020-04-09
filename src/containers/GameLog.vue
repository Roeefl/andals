<template>
  <MessageList title="Game Log" :messages="gameLog">
    <li v-for="(log, i) in gameLog" :key="i" class="log">
      <div v-if="log.type === CHAT_LOG_SIMPLE">
        {{ log.message }}
      </div>
      <div v-if="log.type === CHAT_LOG_DICE">
        {{ log.playerName }} rolls:
        <Icon v-for="(diceValue, i) in log.dice" :key="`cube-${i}`" size="20px" :color="!i ? 'yellow' : 'red'" :name="`dice-${diceValue}`" />
      </div>
      <div v-if="log.type === CHAT_LOG_LOOT || log.type === CHAT_LOG_DISCARD" class="loot">
        {{ log.playerName }} {{ log.type === CHAT_LOG_LOOT ? 'collects' : 'discards' }}
        <span v-for="resource in resourceCardTypes" :key="resource" v-show="log.loot[resource]" class="resource-type">
          <ResourceCard
            v-for="(card, i) in Array(log.loot[resource]).fill(resource)"
            :key="`card-${i}`"
            small
            hideCount
            hideIcon
            :resource="resource"
            class="resource"
          />
        </span>
      </div>
    </li>
  </MessageList>
</template>

<script>
  import { mapState } from 'vuex';

  import { CHAT_LOG_SIMPLE, CHAT_LOG_DICE, CHAT_LOG_LOOT, CHAT_LOG_DISCARD } from '@/store/constants';
  import { resourceCardTypes, resourceCardColors } from '@/utils/tileManifest';

  import MessageList from '@/components/common/MessageList';
  import ResourceCard from '@/components/game/ResourceCard';
  import Button from '@/components/common/Button';
  import Icon from '@/components/common/Icon';

  export default {
    name: 'GameLog',
    components: {
      MessageList,
      ResourceCard,
      Button,
      Icon
    },
    computed: mapState([
      'gameLog'
    ]),
    created() {
      this.resourceCardTypes = resourceCardTypes;
      this.resourceCardColors = resourceCardColors;
      this.CHAT_LOG_SIMPLE = CHAT_LOG_SIMPLE;
      this.CHAT_LOG_DICE = CHAT_LOG_DICE;
      this.CHAT_LOG_LOOT = CHAT_LOG_LOOT;
      this.CHAT_LOG_DISCARD = CHAT_LOG_DISCARD;
    }
  }
</script>

<style scoped lang="scss">
  .log {
    border-top: 1px solid lightgray;
    margin: $spacer / 3 0;
    padding: $spacer / 3 0;

    .loot {
      display: flex;

      .resource-type { 
        display: flex;

        .resource {
          width: 24px;
          height: 24px;
          margin-left: $spacer / 2;
        }
      }
    }
  }
</style>
